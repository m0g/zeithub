<template>
  <table class="activities" style="border-collapse: collapse; border: none">
    <tr style="border-bottom: 1px solid black">
      <th>Description</th>
      <th>Unit price</th>
      <th>Qty</th>
      <th width="16%">Amount ({{ invoice.currencyCode }})</th>
    </tr>
    <tr v-for="item in items" :key="item.id">
      <td style="text-align: center">{{ item.title }}</td>
      <td style="text-align: center; font-family: monospace">
        {{ currency(item.unitPrice, invoice) }}
      </td>
      <td style="text-align: center; font-family: monospace">
        {{ item.qty }}
      </td>
      <td style="text-align: right; font-family: monospace">
        {{ currency(item.qty * item.unitPrice, invoice) }}
      </td>
    </tr>
    <tr>
      <th></th>
      <td colspan="2"><b>Net Amount</b></td>
      <td colspan="2" style="text-align: right; font-family: monospace">
        {{ currency(computeNetAmount(), invoice) }}
      </td>
    </tr>
    <tr>
      <th></th>
      <td colspan="2"><b>Discount</b></td>
      <td colspan="2" style="text-align: right; font-family: monospace">
        {{ currency(invoice.discount, invoice) }}
      </td>
    </tr>
    <tr>
      <th></th>
      <td colspan="2"><b>Tax (VAT)</b></td>
      <td colspan="2" style="text-align: right; font-family: monospace">
        {{ percentage(invoice.tax) }}
      </td>
    </tr>
    <tr>
      <th></th>
      <td colspan="2"><b>Tax Amount</b></td>
      <td colspan="2" style="text-align: right; font-family: monospace">
        {{ currency(taxAmount(), invoice) }}
      </td>
    </tr>
    <tr>
      <th></th>
      <td colspan="2">
        <b>Total ({{ invoice.currencyCode }})</b>
      </td>
      <td colspan="2" style="text-align: right; font-family: monospace">
        {{ currency(computeTotal(), invoice) }}
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Item } from '../../models';
import { currency, percentage } from '../../lib/filters';

export default defineComponent({
  props: ['invoice', 'items'],
  methods: {
    currency,
    percentage,
    computeNetAmount() {
      return this.items.reduce((acc: number, item: Item) => {
        return acc + item.unitPrice * item.qty;
      }, 0);
    },

    computeTotal() {
      const subTotal = this.items.reduce((acc: number, item: Item) => {
        return acc + item.unitPrice * item.qty;
      }, 0);

      let total = subTotal;

      if (this.invoice.discount > 0) {
        total = total - this.invoice.discount;
      }

      if (this.invoice.tax > 0) {
        total = total * (1 + this.invoice.tax / 100);
      }

      return total;
    },

    taxAmount() {
      const total = this.computeTotal();

      return total - total / (1 + this.invoice.tax / 100);
    },
  },
});
</script>
