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
      <td style="text-align: center; font-family: monospace;">
        {{ item.unitPrice | currency(invoice) }}
      </td>
      <td style="text-align: center; font-family: monospace;">
        {{ item.qty }}
      </td>
      <td style="text-align: right; font-family: monospace;">
        {{ (item.qty * item.unitPrice) | currency(invoice) }}
      </td>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <td><b>Discount</b></td>
      <td colspan="2" style="text-align: right; font-family: monospace;">
        {{ invoice.discount | currency(invoice) }}
      </td>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <td><b>Tax (VAT)</b></td>
      <td colspan="2" style="text-align: right; font-family: monospace;">
        {{ invoice.tax | percentage }}
      </td>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <td>
        <b>Total ({{ invoice.currencyCode }})</b>
      </td>
      <td colspan="2" style="text-align: right; font-family: monospace;">
        {{ computeTotal() | currency(invoice) }}
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Item } from '../../models';

const Props = Vue.extend({
  props: ['invoice', 'items']
});

@Component({})
export default class ItemsTable extends Props {
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
  }
}
</script>
