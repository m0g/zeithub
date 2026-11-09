// The invoice layout, used both on the invoice page and by the PDF renderer
// (server/api/invoices/[id]/pdf.get.ts). Written with h() so it renders on
// the server without a template compiler.
import { defineComponent, h, type PropType, type VNodeChild } from 'vue';
import type { AddressFields, InvoiceDocumentData } from '../types/models';
import {
  formatDate,
  formatIban,
  formatInvoiceNumber,
  formatMoney,
  formatPercentage,
} from '../utils/format';
import { computeInvoiceTotals, lineAmountCents } from '../utils/invoice-totals';

export const invoiceDocumentCss = `
.invoice-page {
  box-sizing: border-box;
  width: 210mm;
  min-height: 296mm;
  padding: 14mm 14mm 12mm;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #000;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 10pt;
  line-height: 1.4;
}
.invoice-page * { box-sizing: border-box; }
.invoice-page p { margin: 0; }
.invoice-page h1 {
  margin: 0 0 8mm;
  padding: 4mm 0;
  border-bottom: 1px solid #000;
  text-align: center;
  font-size: 20pt;
  font-weight: bold;
}
.invoice-page .parties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8mm;
  margin-bottom: 8mm;
}
.invoice-page table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
}
.invoice-page th, .invoice-page td { padding: 1.5mm 2mm; vertical-align: top; }
.invoice-page .info { margin-bottom: 8mm; }
.invoice-page .info td + td { text-align: right; }
.invoice-page .lines thead th {
  border-bottom: 1px solid #000;
  text-align: center;
  font-weight: bold;
}
.invoice-page .lines .center { text-align: center; }
.invoice-page .num {
  font-family: Menlo, Consolas, monospace;
  text-align: right;
  white-space: nowrap;
}
.invoice-page .lines .first-summary td { border-top: 1px solid #000; }
.invoice-page .lines .summary-label { text-align: right; font-weight: bold; }
.invoice-page .memo { margin-top: 6mm; white-space: pre-line; }
.invoice-page .footer {
  margin-top: auto;
  padding-top: 3mm;
  border-top: 1px solid #000;
}
`;

function addressLines(address: AddressFields | null): VNodeChild[] {
  if (!address) return [];
  return [
    address.extra ? h('p', address.extra) : null,
    h('p', address.street),
    h('p', `${address.postcode} ${address.city}, ${address.country}`),
  ];
}

function taxLines(party: {
  taxNumber: string | null;
  vatNumber: string | null;
}): VNodeChild[] {
  return [
    party.taxNumber
      ? h('p', [h('b', 'Steuernummer: '), h('span', party.taxNumber)])
      : null,
    party.vatNumber
      ? h('p', [h('b', 'VAT number: '), h('span', party.vatNumber)])
      : null,
  ];
}

export const InvoiceDocument = defineComponent({
  name: 'InvoiceDocument',
  props: {
    data: { type: Object as PropType<InvoiceDocumentData>, required: true },
  },
  setup(props) {
    return () => {
      const {
        invoice,
        items,
        currency,
        client,
        issuer,
        userAddress,
        bankAccount,
      } = props.data;
      const money = (cents: number) => formatMoney(cents, currency);
      const totals = computeInvoiceTotals(
        items,
        invoice.discountCents,
        invoice.taxRate
      );
      const issuerName = [issuer.firstName, issuer.lastName]
        .filter(Boolean)
        .join(' ');

      const summary: [string, string][] = [
        ['Net Amount', money(totals.netCents)],
        ['Discount', money(totals.discountCents)],
        ['Tax (VAT)', formatPercentage(invoice.taxRate)],
        ['Tax Amount', money(totals.taxCents)],
        [`Total (${currency.code})`, money(totals.totalCents)],
      ];

      return h('div', { class: 'invoice-page' }, [
        h('style', invoiceDocumentCss),
        h('h1', invoice.name),
        h('div', { class: 'parties' }, [
          h('div', { class: 'from' }, [
            h('p', [h('b', issuerName)]),
            ...addressLines(userAddress),
            ...taxLines(issuer),
          ]),
          h(
            'div',
            { class: 'to' },
            client
              ? [
                  h('p', [h('b', client.name)]),
                  ...addressLines(client.address),
                  ...taxLines(client),
                ]
              : []
          ),
        ]),
        h('table', { class: 'info' }, [
          h('tbody', [
            h('tr', [
              h('td', 'Invoice number'),
              h('td', formatInvoiceNumber(invoice.number)),
            ]),
            h('tr', [h('td', 'Date'), h('td', formatDate(invoice.date))]),
            h('tr', [
              h('td', 'Due date'),
              h('td', formatDate(invoice.dueDate)),
            ]),
          ]),
        ]),
        h('table', { class: 'lines' }, [
          h('thead', [
            h('tr', [
              h('th', 'Description'),
              h('th', 'Unit price'),
              h('th', 'Qty'),
              h('th', { style: 'width: 18%' }, `Amount (${currency.code})`),
            ]),
          ]),
          h('tbody', [
            ...items.map((item, index) =>
              h('tr', { key: item.id ?? index }, [
                h('td', { class: 'center' }, item.title),
                h('td', { class: 'num center' }, money(item.unitPriceCents)),
                h('td', { class: 'num center' }, String(item.qty)),
                h('td', { class: 'num' }, money(lineAmountCents(item))),
              ])
            ),
            ...summary.map(([label, value], index) =>
              h('tr', { class: index === 0 ? 'first-summary' : undefined }, [
                h('td', { class: 'summary-label', colspan: 3 }, label),
                h('td', { class: 'num' }, value),
              ])
            ),
          ]),
        ]),
        invoice.memo ? h('p', { class: 'memo' }, invoice.memo) : null,
        bankAccount
          ? h('div', { class: 'footer' }, [
              h('p', [h('b', bankAccount.name)]),
              h('p', [h('b', 'IBAN: '), formatIban(bankAccount.iban)]),
              h('p', [h('b', 'BIC: '), bankAccount.bic]),
            ])
          : null,
      ]);
    };
  },
});
