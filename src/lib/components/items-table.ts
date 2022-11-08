import { currency, percentage } from '../filters';

export default {
  template: `
    <table class="activities" style="border-collapse: collapse; border: none">
      <tr style="border-bottom: 1px solid black">
        <th>Description</th>
        <th>Unit price</th>
        <th>Qty</th>
        <th width="16%">Amount ({{ invoice.currencyCode }})</th>
      </tr>
      <tr v-for="item in items" :key="item.id">
        <td style="text-align: center">{{ item.title }}</td>
        <td style="text-align: center; font-family: monospace;">
          {{ item.unitPrice | currency(invoice) }}
        </td>
        <td style="text-align: center; font-family: monospace;">{{ item.qty }}</td>
        <td style="text-align: right; font-family: monospace;">{{ (item.qty * item.unitPrice) | currency(invoice) }}</td>
      </tr>

      <tr>
        <th></th>
        <td colspan="2"><b>Net Amount</b></td>
        <td colspan="2" style="text-align: right; font-family: monospace;">
          {{ computeNetAmount | currency(invoice) }}
        </td>
      </tr>
      <tr>
        <th></th>
        <td colspan="2"><b>Discount</b></td>
        <td colspan="2" style="text-align: right; font-family: monospace;">
          {{ invoice.discount | currency(invoice) }}
        </td>
      </tr>
      <tr>
        <th></th>
        <td colspan="2"><b>Tax (VAT)</b></td>
        <td colspan="2" style="text-align: right; font-family: monospace;">
          {{ invoice.tax | percentage }}
        </td>
      </tr>
      <tr>
        <th></th>
        <td colspan="2"><b>Tax Amount</b></td>
        <td colspan="2" style="text-align: right; font-family: monospace;">
          {{ taxAmount | currency(invoice) }}
        </td>
      </tr>
      <tr>
        <th></th>
        <td colspan="2">
          <b>Total ({{ invoice.currencyCode }})</b>
        </td>
        <td colspan="2" style="text-align: right; font-family: monospace;">
          {{ computeTotal | currency(invoice) }}
        </td>
      </tr>
    </table>
  `,
  props: ['invoice', 'items'],
  computed: {
    currency,
    percentage,
    computeNetAmount() {
      // @ts-ignore
      return this.items.reduce((acc, item) => {
        return acc + item.unitPrice * item.qty;
      }, 0);
    },

    computeTotal() {
      // @ts-ignore
      const subTotal = this.items.reduce((acc, item) => {
        return acc + item.unitPrice * item.qty;
      }, 0);

      let total = subTotal;

      // @ts-ignore
      if (this.invoice.discount > 0) {
        // @ts-ignore
        total = total - this.invoice.discount;
      }

      // @ts-ignore
      if (this.invoice.tax > 0) {
        // @ts-ignore
        total = total * (1 + this.invoice.tax / 100);
      }

      return total;
    },

    taxAmount() {
      const total = this.computeTotal;

      // @ts-ignore
      return total - total / (1 + this.invoice.tax / 100);
    },
  },
};
