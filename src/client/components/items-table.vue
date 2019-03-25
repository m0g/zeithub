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
      <td>{{ item.unitPrice | currency(invoice) }}</td>
      <td>{{ item.qty }}</td>
      <td>{{ (item.qty * item.unitPrice) | currency(invoice) }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Item } from '../../models';

const Props = Vue.extend({
  props: ['invoice', 'me', 'items']
});

@Component({})
export default class ItemsTable extends Props {
  // computeTotal() {
  //   this.subTotal = this.items.reduce((acc: number, item: Item) => {
  //     return acc + item.unitPrice * item.qty;
  //   }, 0);
  //   this.total = this.subTotal;
  //   if (this.discount > 0) {
  //     this.total = this.total - this.discount;
  //   }
  //   if (this.vat > 0) {
  //     this.total = this.total * (1 + this.vat / 100);
  //   }
  // }
}
</script>
