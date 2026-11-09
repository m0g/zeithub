// One-off import of an existing Zeithub MySQL/MariaDB database into SQLite.
//
//   MYSQL_URL=mysql://zeithub:zeithub@localhost:3306/zeithub \
//   DATABASE_PATH=.data/zeithub.db \
//   npm run db:import-mysql
//
// The target must be a new (or empty) SQLite file. IDs are kept, money is
// converted to integer cents, and rows that point at deleted parents (the old
// schema had no foreign keys) are skipped or unlinked. Nothing is written
// unless the whole import succeeds.
import { count } from 'drizzle-orm';
import mysql from 'mysql2/promise';
import { createDb, DEFAULT_DATABASE_PATH } from '../server/db/client';
import { migrateAndSeed } from '../server/db/migrate';
import * as t from '../server/db/schema';

type Row = Record<string, unknown>;

const mysqlUrl = process.env.MYSQL_URL;
const databasePath = process.env.DATABASE_PATH || DEFAULT_DATABASE_PATH;

if (!mysqlUrl) {
  console.error('Set MYSQL_URL, e.g. mysql://user:password@host:3306/zeithub');
  process.exit(1);
}

const str = (value: unknown) =>
  value === null || value === undefined ? null : String(value);

// Old code stored the literal string "undefined" for empty optional fields.
const optional = (value: unknown) => {
  const text = str(value)?.trim();
  return text && text !== 'undefined' && text !== 'null' ? text : null;
};

const cents = (value: unknown) =>
  value === null || value === undefined ? 0 : Math.round(Number(value) * 100);

const num = (value: unknown) => (value === null ? null : Number(value));

async function readSource() {
  const connection = await mysql.createConnection({
    uri: mysqlUrl,
    // Keep DATE columns as 'YYYY-MM-DD' instead of shifting them through a
    // JS Date in the local timezone.
    dateStrings: true,
  });

  const [tableRows] = await connection.query('show tables');
  const existing = new Set(
    (tableRows as Row[]).map(row => String(Object.values(row)[0]))
  );

  const read = async (table: string) => {
    if (!existing.has(table)) return [] as Row[];
    const [rows] = await connection.query(
      `select * from \`${table}\` order by 1`
    );
    return rows as Row[];
  };

  const source = {
    currencies: await read('currencies'),
    users: await read('users'),
    clients: await read('clients'),
    addresses: await read('addresses'),
    bank_accounts: await read('bank_accounts'),
    projects: await read('projects'),
    invoices: await read('invoices'),
    items: await read('items'),
  };

  await connection.end();
  return source;
}

interface Report {
  source: number;
  imported: number;
  notes: string[];
}

async function main() {
  console.log(`Reading ${mysqlUrl!.replace(/\/\/[^@]*@/, '//***@')}`);
  const source = await readSource();

  const db = createDb(databasePath);
  migrateAndSeed(db);

  const existingUsers =
    db.select({ value: count() }).from(t.users).get()?.value ?? 0;
  if (existingUsers > 0) {
    console.error(
      `${databasePath} already contains ${existingUsers} user(s). ` +
        'Import into a new file instead.'
    );
    process.exit(1);
  }

  const report: Record<string, Report> = {};
  const track = (table: string, sourceRows: Row[]): Report =>
    (report[table] = { source: sourceRows.length, imported: 0, notes: [] });

  // --- Transform (pure, before touching the database) ---

  const currencyRows = source.currencies.map(row => ({
    code: String(row.code),
    name: String(row.name),
    sign: String(row.sign),
    leading: Boolean(Number(row.leading)),
  }));
  const currencyCodes = new Set([
    'EUR',
    ...currencyRows.map(currency => currency.code),
  ]);

  const userRows = source.users.map(row => ({
    id: Number(row.id),
    name: optional(row.name) ?? `user${row.id}`,
    email: optional(row.email) ?? '',
    password: String(row.password),
    admin: Boolean(Number(row.admin)),
    firstName: optional(row.first_name),
    lastName: optional(row.last_name),
    tel: optional(row.tel),
    website: optional(row.website),
    taxNumber: optional(row.tax_number),
    vatNumber: optional(row.vat_number),
  }));
  const userIds = new Set(userRows.map(user => user.id));

  const usersReport = track('users', source.users);
  const duplicateNames = userRows
    .map(user => user.name)
    .filter((name, index, all) => all.indexOf(name) !== index);
  if (duplicateNames.length) {
    throw new Error(
      `Duplicate usernames: ${[...new Set(duplicateNames)].join(', ')}`
    );
  }
  usersReport.imported = userRows.length;

  const clientsReport = track('clients', source.clients);
  const clientRows = source.clients.flatMap(row => {
    const userId = num(row.user_id);
    if (!userId || !userIds.has(userId)) {
      clientsReport.notes.push(`client ${row.id}: owner missing, skipped`);
      return [];
    }
    return [
      {
        id: Number(row.id),
        userId,
        name: optional(row.name) ?? '(unnamed client)',
        taxNumber: optional(row.tax_number),
        vatNumber: optional(row.vat_number),
      },
    ];
  });
  const clientOwner = new Map(clientRows.map(c => [c.id, c.userId]));

  // Old schema: a user's own addresses have user_id; a client's address has
  // client_id and no user_id. Now every address has its owner in userId.
  const addressesReport = track('addresses', source.addresses);
  const addressRows = source.addresses.flatMap(row => {
    const sourceClientId = num(row.client_id);
    const clientId =
      sourceClientId && clientOwner.has(sourceClientId) ? sourceClientId : null;
    const userId = clientId ? clientOwner.get(clientId)! : num(row.user_id);

    if (!userId || !userIds.has(userId)) {
      addressesReport.notes.push(
        `address ${row.id}: owner or client missing, skipped`
      );
      return [];
    }
    return [
      {
        id: Number(row.id),
        userId,
        clientId,
        name: optional(row.name) ?? '',
        extra: optional(row.extra),
        street: optional(row.street) ?? '',
        city: optional(row.city) ?? '',
        postcode: optional(row.postcode) ?? '',
        country: optional(row.country) ?? '',
      },
    ];
  });
  const userAddressOwner = new Map(
    addressRows.filter(a => !a.clientId).map(a => [a.id, a.userId])
  );

  const bankAccountsReport = track('bank_accounts', source.bank_accounts);
  const bankAccountRows = source.bank_accounts.flatMap(row => {
    const userId = num(row.user_id);
    if (!userId || !userIds.has(userId)) {
      bankAccountsReport.notes.push(
        `bank account ${row.id}: owner missing, skipped`
      );
      return [];
    }
    return [
      {
        id: Number(row.id),
        userId,
        name: String(row.name),
        owner: String(row.owner),
        iban: String(row.iban).replace(/\s+/g, '').toUpperCase(),
        bic: String(row.bic).replace(/\s+/g, '').toUpperCase(),
      },
    ];
  });
  const bankAccountOwner = new Map(bankAccountRows.map(b => [b.id, b.userId]));

  const projectsReport = track('projects', source.projects);
  const seenSlugs = new Set<string>();
  const projectRows = source.projects.flatMap(row => {
    const userId = num(row.user_id);
    if (!userId || !userIds.has(userId)) {
      projectsReport.notes.push(`project ${row.id}: owner missing, skipped`);
      return [];
    }
    const sourceClientId = num(row.client_id);
    const clientId =
      sourceClientId && clientOwner.get(sourceClientId) === userId
        ? sourceClientId
        : null;
    if (sourceClientId && !clientId) {
      projectsReport.notes.push(
        `project ${row.id}: client ${sourceClientId} missing, unlinked`
      );
    }
    let slug = optional(row.slug) ?? `project-${row.id}`;
    if (seenSlugs.has(`${userId}/${slug}`)) {
      projectsReport.notes.push(
        `project ${row.id}: duplicate slug "${slug}", renamed`
      );
      slug = `${slug}-${row.id}`;
    }
    seenSlugs.add(`${userId}/${slug}`);
    return [
      {
        id: Number(row.id),
        userId,
        clientId,
        name: optional(row.name) ?? slug,
        slug,
      },
    ];
  });
  const projectOwner = new Map(projectRows.map(p => [p.id, p.userId]));

  const invoicesReport = track('invoices', source.invoices);
  const invoiceRows = source.invoices.flatMap(row => {
    const id = Number(row.id);
    const userId = num(row.user_id);
    if (!userId || !userIds.has(userId)) {
      invoicesReport.notes.push(`invoice ${id}: owner missing, skipped`);
      return [];
    }
    const owned = (map: Map<number, number>, value: unknown, what: string) => {
      const ref = num(value);
      if (!ref) return null;
      if (map.get(ref) === userId) return ref;
      invoicesReport.notes.push(
        `invoice ${id}: ${what} ${ref} missing, unlinked`
      );
      return null;
    };
    let currencyCode = String(row.currency_code ?? 'EUR');
    if (!currencyCodes.has(currencyCode)) {
      invoicesReport.notes.push(
        `invoice ${id}: unknown currency ${currencyCode}, set to EUR`
      );
      currencyCode = 'EUR';
    }
    return [
      {
        id,
        userId,
        number: Number(row.number),
        name: String(row.name),
        date: String(row.date).slice(0, 10),
        dueDate: String(row.due_date).slice(0, 10),
        memo: optional(row.memo),
        // `discount` was an INT amount in currency units.
        discountCents: cents(row.discount),
        taxRate: Number(row.tax ?? 0),
        currencyCode,
        clientId: owned(clientOwner, row.client_id, 'client'),
        bankAccountId: owned(
          bankAccountOwner,
          row.bank_account_id,
          'bank account'
        ),
        userAddressId: owned(userAddressOwner, row.user_address_id, 'address'),
      },
    ];
  });

  const numbers = new Map<string, number[]>();
  for (const invoice of invoiceRows) {
    const key = `${invoice.userId}/${invoice.number}`;
    numbers.set(key, [...(numbers.get(key) ?? []), invoice.id]);
  }
  const duplicates = [...numbers.entries()].filter(([, ids]) => ids.length > 1);
  if (duplicates.length) {
    throw new Error(
      'Invoice numbers must be unique per user. Fix these in MySQL first:\n' +
        duplicates
          .map(([key, ids]) => {
            const [user, number] = key.split('/');
            return `  user ${user}, number ${number}: invoice ids ${ids.join(', ')}`;
          })
          .join('\n')
    );
  }
  invoicesReport.imported = invoiceRows.length;
  const invoiceOwner = new Map(invoiceRows.map(i => [i.id, i.userId]));

  const itemsReport = track('items', source.items);
  let orphanItems = 0;
  const itemRows = source.items.flatMap(row => {
    const invoiceId = num(row.invoice_id);
    const userId = invoiceId ? invoiceOwner.get(invoiceId) : undefined;
    if (!invoiceId || !userId) {
      orphanItems++;
      return [];
    }
    const projectId = num(row.project_id);
    return [
      {
        id: Number(row.id),
        userId,
        invoiceId,
        projectId:
          projectId && projectOwner.get(projectId) === userId
            ? projectId
            : null,
        title: optional(row.title) ?? '',
        qty: row.qty === null ? 1 : Number(row.qty),
        unitPriceCents: cents(row.unit_price),
      },
    ];
  });
  if (orphanItems) {
    itemsReport.notes.push(
      `${orphanItems} item(s) of deleted invoices skipped`
    );
  }

  clientsReport.imported = clientRows.length;
  addressesReport.imported = addressRows.length;
  bankAccountsReport.imported = bankAccountRows.length;
  projectsReport.imported = projectRows.length;
  itemsReport.imported = itemRows.length;

  // --- Write everything in one transaction ---

  const batches = <T>(rows: T[], size = 200) =>
    Array.from({ length: Math.ceil(rows.length / size) }, (_, i) =>
      rows.slice(i * size, (i + 1) * size)
    );

  db.transaction(tx => {
    for (const batch of batches(currencyRows))
      tx.insert(t.currencies).values(batch).onConflictDoNothing().run();
    for (const batch of batches(userRows))
      tx.insert(t.users).values(batch).run();
    for (const batch of batches(clientRows))
      tx.insert(t.clients).values(batch).run();
    for (const batch of batches(addressRows))
      tx.insert(t.addresses).values(batch).run();
    for (const batch of batches(bankAccountRows))
      tx.insert(t.bankAccounts).values(batch).run();
    for (const batch of batches(projectRows))
      tx.insert(t.projects).values(batch).run();
    for (const batch of batches(invoiceRows))
      tx.insert(t.invoices).values(batch).run();
    for (const batch of batches(itemRows))
      tx.insert(t.items).values(batch).run();
  });

  // --- Verify against what is actually in SQLite ---

  const tables = {
    users: t.users,
    clients: t.clients,
    addresses: t.addresses,
    bank_accounts: t.bankAccounts,
    projects: t.projects,
    invoices: t.invoices,
    items: t.items,
  };

  console.log(`\nImported into ${databasePath}\n`);
  console.log('table           source  imported  in sqlite');
  let mismatch = false;
  for (const [name, table] of Object.entries(tables)) {
    const inDb = db.select({ value: count() }).from(table).get()?.value ?? 0;
    const entry = report[name]!;
    if (inDb !== entry.imported) mismatch = true;
    console.log(
      `${name.padEnd(15)} ${String(entry.source).padStart(6)}  ${String(
        entry.imported
      ).padStart(8)}  ${String(inDb).padStart(9)}`
    );
  }

  const notes = Object.values(report).flatMap(entry => entry.notes);
  if (notes.length) {
    console.log('\nNotes:');
    for (const note of notes) console.log(`  - ${note}`);
  }

  if (mismatch) {
    console.error('\nRow counts in SQLite do not match the import plan.');
    process.exit(1);
  }

  console.log(
    '\nDone. Existing passwords keep working: bcrypt hashes are upgraded on each user’s next sign-in.'
  );
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
