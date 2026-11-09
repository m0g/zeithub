import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { InvoiceDocument } from '../../shared/invoice/document';
import type { InvoiceDocumentData } from '../../shared/types/models';

const data: InvoiceDocumentData = {
  invoice: {
    id: 1,
    number: 3,
    name: 'Invoice Farm Radio International 03/2018',
    date: '2018-04-13',
    dueDate: '2018-05-13',
    memo: 'Thank you!',
    discountCents: 10000,
    taxRate: 19,
    currencyCode: 'CAD',
    clientId: 1,
    bankAccountId: 1,
    userAddressId: 1,
  },
  items: [
    {
      id: 1,
      title: 'Zammad audio player',
      qty: 2,
      unitPriceCents: 30000,
      projectId: null,
    },
    {
      id: 2,
      title: 'Server configuration',
      qty: 1,
      unitPriceCents: 30000,
      projectId: null,
    },
  ],
  currency: { code: 'CAD', name: 'Canadian dollar', sign: '$', leading: true },
  client: {
    id: 1,
    name: 'Farm Radio International',
    taxNumber: null,
    vatNumber: 'CA123',
    address: {
      extra: null,
      street: '1404 Scott Street',
      city: 'Ottawa',
      postcode: 'K1Y 4M8',
      country: 'Canada',
    },
  },
  issuer: {
    firstName: 'Loïc',
    lastName: 'Nogues',
    email: 'loic@example.com',
    tel: null,
    website: null,
    taxNumber: '31/457/01861',
    vatNumber: null,
  },
  userAddress: {
    extra: 'c/o Someone',
    street: 'Wisbyerstr. 22A',
    city: 'Berlin',
    postcode: '10439',
    country: 'Germany',
  },
  bankAccount: {
    name: 'Sparkasse Berlin',
    owner: 'Loïc Nogues',
    iban: 'DE46100500001061334232',
    bic: 'BELADEBEXXX',
  },
};

const render = (doc: InvoiceDocumentData) =>
  renderToString(
    createSSRApp({ render: () => h(InvoiceDocument, { data: doc }) })
  );

describe('InvoiceDocument', () => {
  it('renders the parties, lines, totals and bank details', async () => {
    const html = await render(data);

    for (const text of [
      'Invoice Farm Radio International 03/2018',
      'Loïc Nogues',
      'c/o Someone',
      '10439 Berlin, Germany',
      'Steuernummer: </b><span>31/457/01861',
      'Farm Radio International',
      'K1Y 4M8 Ottawa, Canada',
      'VAT number: </b><span>CA123',
      '>003<',
      '13/04/2018',
      '13/05/2018',
      'Amount (CAD)',
      '$600.00',
      '$900.00', // net
      '$100.00', // discount
      '19.00%',
      '$152.00', // tax
      '$952.00', // total
      'Thank you!',
      'DE46 1005 0000 1061 3342 32',
      'BELADEBEXXX',
    ]) {
      expect(html).toContain(text);
    }
  });

  it('escapes user content', async () => {
    const html = await render({
      ...data,
      invoice: { ...data.invoice, name: '<script>alert(1)</script>' },
    });
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('copes with a missing client, address and bank account', async () => {
    const html = await render({
      ...data,
      client: null,
      userAddress: null,
      bankAccount: null,
    });
    expect(html).toContain('$952.00');
    expect(html).not.toContain('IBAN');
  });
});
