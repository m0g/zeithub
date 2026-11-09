// Builds the app, runs it against a throwaway SQLite file, and exercises the
// API over HTTP.
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setup, url } from '@nuxt/test-utils/e2e';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import { afterAll, describe, expect, it } from 'vitest';

const tempDir = mkdtempSync(join(tmpdir(), 'zeithub-test-'));
const databasePath = join(tempDir, 'zeithub.db');

const macChrome =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const chromeBin =
  process.env.CHROME_BIN || (existsSync(macChrome) ? macChrome : '');

await setup({
  rootDir: fileURLToPath(new URL('../..', import.meta.url)),
  server: true,
  build: true,
  env: {
    DATABASE_PATH: databasePath,
    NUXT_APP_SECRET: 'test-secret-that-is-long-enough-0123456789',
    CHROME_BIN: chromeBin,
  },
});

afterAll(() => {
  rmSync(tempDir, { recursive: true, force: true });
});

interface Response<T = any> {
  status: number;
  body: T;
  headers: Headers;
}

// Minimal client that keeps the session cookie, like a browser would.
function client() {
  let cookie = '';

  async function request<T = any>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<Response<T>> {
    const res = await fetch(url(path), {
      method,
      headers: {
        ...(body === undefined ? {} : { 'content-type': 'application/json' }),
        ...(cookie ? { cookie } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const setCookie = res.headers.getSetCookie();
    if (setCookie.length) {
      cookie = setCookie.map(value => value.split(';')[0]).join('; ');
    }

    const type = res.headers.get('content-type') ?? '';
    const parsed = type.includes('json')
      ? await res.json()
      : type.includes('pdf')
        ? await res.arrayBuffer()
        : await res.text();

    return { status: res.status, body: parsed as T, headers: res.headers };
  }

  return {
    get: <T = any>(path: string) => request<T>('GET', path),
    post: <T = any>(path: string, body?: unknown) =>
      request<T>('POST', path, body ?? {}),
    put: <T = any>(path: string, body?: unknown) =>
      request<T>('PUT', path, body ?? {}),
    delete: (path: string) => request('DELETE', path),
    raw: request,
  };
}

let userCount = 0;
async function signedUpClient() {
  const api = client();
  const name = `user${++userCount}`;
  const res = await api.post('/api/auth/signup', {
    username: name,
    email: `${name}@example.com`,
    password: 'correct horse battery',
  });
  expect(res.status).toBe(201);
  return { api, name };
}

const address = {
  name: 'Home',
  street: 'Wisbyerstr. 22A',
  city: 'Berlin',
  postcode: '10439',
  country: 'Germany',
};

const clientBody = {
  name: 'Farm Radio International',
  vatNumber: 'CA123',
  street: '1404 Scott Street',
  city: 'Ottawa',
  postcode: 'K1Y 4M8',
  country: 'Canada',
};

const bankAccount = {
  name: 'Sparkasse',
  owner: 'Jane Doe',
  iban: 'DE46 1005 0000 1061 3342 32',
  bic: 'BELADEBEXXX',
};

// Signs up a user with one of everything and an invoice.
async function userWithInvoice() {
  const { api, name } = await signedUpClient();
  const addressId = (await api.post('/api/addresses', address)).body.id;
  const clientId = (await api.post('/api/clients', clientBody)).body.id;
  const bankAccountId = (await api.post('/api/bank-accounts', bankAccount)).body
    .id;
  const project = (await api.post('/api/projects', { name: 'Zammad Audio' }))
    .body;

  const invoiceBody = {
    name: 'Invoice 03/2018',
    number: 3,
    date: '2018-04-13',
    dueDate: '2018-05-13',
    memo: 'Thanks',
    discountCents: 10000,
    taxRate: 19,
    currencyCode: 'CAD',
    clientId,
    bankAccountId,
    userAddressId: addressId,
    items: [
      {
        title: 'Audio player',
        qty: 2,
        unitPriceCents: 30000,
        projectId: project.id,
      },
      { title: 'Server setup', qty: 1, unitPriceCents: 30000, projectId: null },
    ],
  };
  const invoice = await api.post('/api/invoices', invoiceBody);
  expect(invoice.status).toBe(201);

  return {
    api,
    name,
    addressId,
    clientId,
    bankAccountId,
    project,
    invoiceBody,
    invoiceId: invoice.body.invoice.id as number,
  };
}

describe('auth', () => {
  it('rejects anonymous requests', async () => {
    const res = await client().get('/api/me');
    expect(res.status).toBe(401);
  });

  it('signs up with an httpOnly session cookie', async () => {
    const res = await fetch(url('/api/auth/signup'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        username: 'cookiemonster',
        email: 'cookie@example.com',
        password: 'correct horse battery',
      }),
    });
    expect(res.status).toBe(201);
    const cookie = res.headers.getSetCookie().join(';');
    expect(cookie).toMatch(/nuxt-auth-session=/);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Lax/i);
    // No token in the response body.
    expect(await res.json()).toEqual({
      id: expect.any(Number),
      name: 'cookiemonster',
    });
  });

  it('refuses a duplicate username or email', async () => {
    const { name } = await signedUpClient();
    const res = await client().post('/api/auth/signup', {
      username: name,
      email: 'someone-else@example.com',
      password: 'correct horse battery',
    });
    expect(res.status).toBe(409);
  });

  it('validates the sign-up body', async () => {
    const res = await client().post('/api/auth/signup', {
      username: '',
      email: 'nope',
      password: 'short',
    });
    expect(res.status).toBe(400);
    expect(res.body.data.issues.map((i: { path: string }) => i.path)).toEqual([
      'username',
      'email',
      'password',
    ]);
  });

  it('signs in, out and back in', async () => {
    const { api, name } = await signedUpClient();
    expect((await api.post('/api/auth/signout')).status).toBe(200);
    expect((await api.get('/api/me')).status).toBe(401);

    const wrong = await api.post('/api/auth/signin', {
      username: name,
      password: 'wrong password',
    });
    expect(wrong.status).toBe(401);

    const ok = await api.post('/api/auth/signin', {
      username: `${name}@example.com`,
      password: 'correct horse battery',
    });
    expect(ok.status).toBe(200);
    expect((await api.get('/api/me')).body.name).toBe(name);
  });

  it('accepts a legacy bcrypt hash and upgrades it to scrypt', async () => {
    const sqlite = new Database(databasePath);
    sqlite
      .prepare('insert into users (name, email, password) values (?, ?, ?)')
      .run('legacy', 'legacy@example.com', bcrypt.hashSync('oldpassword', 4));

    const api = client();
    const res = await api.post('/api/auth/signin', {
      username: 'legacy',
      password: 'oldpassword',
    });
    expect(res.status).toBe(200);

    const { password } = sqlite
      .prepare('select password from users where name = ?')
      .get('legacy') as { password: string };
    sqlite.close();
    expect(password.startsWith('$scrypt')).toBe(true);

    // The new hash works too.
    const again = await client().post('/api/auth/signin', {
      username: 'legacy',
      password: 'oldpassword',
    });
    expect(again.status).toBe(200);
  });

  it('changes the password', async () => {
    const { api, name } = await signedUpClient();
    const wrong = await api.put('/api/me/password', {
      currentPassword: 'nope',
      password: 'a brand new password',
    });
    expect(wrong.status).toBe(400);

    const ok = await api.put('/api/me/password', {
      currentPassword: 'correct horse battery',
      password: 'a brand new password',
    });
    expect(ok.status).toBe(200);

    const signin = await client().post('/api/auth/signin', {
      username: name,
      password: 'a brand new password',
    });
    expect(signin.status).toBe(200);
  });
});

describe('profile and settings', () => {
  it('updates the profile', async () => {
    const { api, name } = await signedUpClient();
    const res = await api.put('/api/me', {
      email: `${name}@example.org`,
      firstName: 'Jane',
      lastName: '',
      taxNumber: '12/345/67890',
    });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      email: `${name}@example.org`,
      firstName: 'Jane',
      lastName: null,
      taxNumber: '12/345/67890',
    });
    expect(res.body).not.toHaveProperty('password');
  });

  it('lists the currencies', async () => {
    const { api } = await signedUpClient();
    const res = await api.get('/api/currencies');
    expect(res.body.map((c: { code: string }) => c.code)).toEqual([
      'CAD',
      'EUR',
      'USD',
    ]);
  });

  it('does CRUD on addresses', async () => {
    const { api } = await signedUpClient();
    const created = await api.post('/api/addresses', address);
    expect(created.status).toBe(201);
    const id = created.body.id;

    const updated = await api.put(`/api/addresses/${id}`, {
      ...address,
      city: 'Hamburg',
    });
    expect(updated.body.city).toBe('Hamburg');
    expect((await api.get('/api/addresses')).body).toHaveLength(1);

    expect((await api.delete(`/api/addresses/${id}`)).status).toBe(204);
    expect((await api.get('/api/addresses')).body).toHaveLength(0);
  });

  it('normalises bank accounts and refuses duplicates', async () => {
    const { api } = await signedUpClient();
    const created = await api.post('/api/bank-accounts', bankAccount);
    expect(created.status).toBe(201);
    expect(created.body.iban).toBe('DE46100500001061334232');

    const duplicate = await api.post('/api/bank-accounts', bankAccount);
    expect(duplicate.status).toBe(409);

    const invalid = await api.post('/api/bank-accounts', {
      ...bankAccount,
      iban: 'not an iban',
    });
    expect(invalid.status).toBe(400);
  });

  it('keeps a client and its address together', async () => {
    const { api } = await signedUpClient();
    const created = await api.post('/api/clients', clientBody);
    expect(created.body).toMatchObject({
      name: 'Farm Radio International',
      address: { street: '1404 Scott Street', city: 'Ottawa' },
    });

    const updated = await api.put(`/api/clients/${created.body.id}`, {
      ...clientBody,
      street: '1 New Street',
    });
    expect(updated.body.address.street).toBe('1 New Street');

    // Client addresses don't show up as the user's own addresses.
    expect((await api.get('/api/addresses')).body).toHaveLength(0);

    expect((await api.delete(`/api/clients/${created.body.id}`)).status).toBe(
      204
    );
    expect((await api.get('/api/clients')).body).toHaveLength(0);
  });

  it('manages projects by slug', async () => {
    const { api } = await signedUpClient();
    const created = await api.post('/api/projects', {
      name: 'Website Redesign!',
    });
    expect(created.body.slug).toBe('website-redesign');

    const duplicate = await api.post('/api/projects', {
      name: 'Website Redesign',
    });
    expect(duplicate.status).toBe(409);

    const renamed = await api.put('/api/projects/website-redesign', {
      name: 'New name',
    });
    expect(renamed.body).toMatchObject({
      name: 'New name',
      slug: 'website-redesign',
    });

    expect((await api.delete('/api/projects/website-redesign')).status).toBe(
      204
    );
    expect((await api.get('/api/projects/website-redesign')).status).toBe(404);
  });

  it('is not injectable through the slug', async () => {
    const { api } = await signedUpClient();
    await api.post('/api/projects', { name: 'Secret' });
    const res = await api.get("/api/projects/x'%20or%201=1--");
    expect(res.status).toBe(404);
  });
});

describe('invoices', () => {
  it('creates an invoice with items and computes totals', async () => {
    const { api, invoiceId } = await userWithInvoice();

    const doc = await api.get(`/api/invoices/${invoiceId}`);
    expect(doc.status).toBe(200);
    expect(doc.body.invoice).toMatchObject({
      number: 3,
      discountCents: 10000,
      taxRate: 19,
    });
    expect(doc.body.items).toHaveLength(2);
    expect(doc.body.currency.code).toBe('CAD');
    expect(doc.body.client.address.city).toBe('Ottawa');
    expect(doc.body.bankAccount.iban).toBe('DE46100500001061334232');

    const list = await api.get('/api/invoices');
    expect(list.body).toHaveLength(1);
    expect(list.body[0].totals).toEqual({
      netCents: 90000,
      discountCents: 10000,
      taxCents: 15200,
      totalCents: 95200,
    });
  });

  it('updates an invoice and replaces its items', async () => {
    const { api, invoiceId, invoiceBody } = await userWithInvoice();
    const res = await api.put(`/api/invoices/${invoiceId}`, {
      ...invoiceBody,
      name: 'Renamed',
      items: [{ title: 'Only item', qty: 1.5, unitPriceCents: 1000 }],
    });
    expect(res.status).toBe(200);
    expect(res.body.invoice.name).toBe('Renamed');
    expect(res.body.items).toEqual([
      expect.objectContaining({
        title: 'Only item',
        qty: 1.5,
        unitPriceCents: 1000,
      }),
    ]);
  });

  it('refuses duplicate numbers and empty invoices', async () => {
    const { api, invoiceBody } = await userWithInvoice();
    const duplicate = await api.post('/api/invoices', invoiceBody);
    expect(duplicate.status).toBe(409);

    const empty = await api.post('/api/invoices', {
      ...invoiceBody,
      number: 99,
      items: [],
    });
    expect(empty.status).toBe(400);
    expect(empty.body.data.issues[0].message).toBe('Add at least one item');
  });

  it('protects records that invoices point at', async () => {
    const { api, clientId, bankAccountId, addressId } = await userWithInvoice();
    expect((await api.delete(`/api/clients/${clientId}`)).status).toBe(409);
    expect(
      (await api.delete(`/api/bank-accounts/${bankAccountId}`)).status
    ).toBe(409);
    expect((await api.delete(`/api/addresses/${addressId}`)).status).toBe(409);
  });

  it('deletes an invoice with its items', async () => {
    const { api, invoiceId } = await userWithInvoice();
    expect((await api.delete(`/api/invoices/${invoiceId}`)).status).toBe(204);
    expect((await api.get(`/api/invoices/${invoiceId}`)).status).toBe(404);

    const sqlite = new Database(databasePath, { readonly: true });
    const { count } = sqlite
      .prepare('select count(*) as count from items where invoice_id = ?')
      .get(invoiceId) as { count: number };
    sqlite.close();
    expect(count).toBe(0);
  });

  it.skipIf(!chromeBin)('renders the PDF', async () => {
    const { api, invoiceId } = await userWithInvoice();
    const res = await api.get(`/api/invoices/${invoiceId}/pdf`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/pdf');
    expect(res.headers.get('content-disposition')).toMatch(
      /attachment; filename="003-invoice-032018/
    );
    const bytes = new Uint8Array(res.body as ArrayBuffer);
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe('%PDF-');
  });
});

describe('isolation between users', () => {
  it("never exposes or touches another user's data", async () => {
    const alice = await userWithInvoice();
    const { api: bob } = await signedUpClient();

    // Reads
    expect((await bob.get(`/api/invoices/${alice.invoiceId}`)).status).toBe(
      404
    );
    expect((await bob.get(`/api/invoices/${alice.invoiceId}/pdf`)).status).toBe(
      404
    );
    expect((await bob.get('/api/invoices')).body).toEqual([]);
    expect((await bob.get('/api/clients')).body).toEqual([]);
    expect((await bob.get('/api/addresses')).body).toEqual([]);
    expect((await bob.get('/api/bank-accounts')).body).toEqual([]);
    expect((await bob.get('/api/projects')).body).toEqual([]);
    expect((await bob.get(`/api/projects/${alice.project.slug}`)).status).toBe(
      404
    );

    // Writes
    expect(
      (await bob.put(`/api/invoices/${alice.invoiceId}`, alice.invoiceBody))
        .status
    ).toBe(400); // references Alice's client etc.
    expect(
      (
        await bob.put(`/api/invoices/${alice.invoiceId}`, {
          ...alice.invoiceBody,
          clientId: null,
          bankAccountId: null,
          userAddressId: null,
          items: [{ title: 'x', qty: 1, unitPriceCents: 1 }],
        })
      ).status
    ).toBe(404);
    expect((await bob.delete(`/api/invoices/${alice.invoiceId}`)).status).toBe(
      404
    );
    expect(
      (await bob.put(`/api/addresses/${alice.addressId}`, address)).status
    ).toBe(404);
    expect((await bob.delete(`/api/clients/${alice.clientId}`)).status).toBe(
      404
    );
    expect(
      (await bob.delete(`/api/bank-accounts/${alice.bankAccountId}`)).status
    ).toBe(404);

    // Bob can't attach Alice's records to his own invoice or project.
    const stealing = await bob.post('/api/invoices', {
      ...alice.invoiceBody,
      clientId: alice.clientId,
    });
    expect(stealing.status).toBe(400);
    const stealingProject = await bob.post('/api/projects', {
      name: 'Mine',
      clientId: alice.clientId,
    });
    expect(stealingProject.status).toBe(400);

    // Alice's data is untouched.
    const doc = await alice.api.get(`/api/invoices/${alice.invoiceId}`);
    expect(doc.body.invoice.name).toBe('Invoice 03/2018');
    expect(doc.body.items).toHaveLength(2);
  });
});
