<template>
  <table class="activities">
    <tr>
      <th>Project</th>
      <th>Task</th>
      <th>Time (in minutes)</th>
      <th width="12%">Amount</th>
    </tr>
    <tr v-for="activity in activities" :key="activity.id">
      <td>{{activity.projectName}}</td>
      <td>{{activity.name}}</td>
      <td>{{activity.durationMinutes | formatHours}}</td>
      <td class="amount">
        {{activity.durationMinutes / 60 * invoice.amount | currencyPDF}}
        <img src="/euro.svg" width="6px" />
      </td>
    </tr>
    <tr>
      <th></th>
      <td>Total time</td>
      <td colspan="2">{{totalMinutes | totalHours}}</td>
    </tr>
    <tr>
      <th></th>
      <td>Sub total</td>
      <td colspan="2">
        {{totalMinutes / 60 * invoice.amount | currencyPDF}}
        <img src="/euro.svg" width="6px" />
      </td>
    </tr>
    <tr>
      <th></th>
      <td>Discount</td>
      <td colspan="2">
        {{invoice.discount | currencyPDF}}
        <img src="/euro.svg" width="6px" />
      </td>
    </tr>
    <tr>
      <th></th>
      <td>Tax (VAT)</td>
      <td colspan="2">
        {{invoice.tax | currencyPDF}}%
      </td>
    </tr>
    <tr>
      <th></th>
      <td>Total</td>
      <td colspan="2">
        {{computeTotal() | currencyPDF}}
        <img src="/euro.svg" width="6px" />
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Inject,
  Model,
  Prop,
  Provide,
  Vue,
  Watch
} from "vue-property-decorator";

import { Activity, Invoice } from './../../types';

@Component
export default class ActivitiesTable extends Vue {
  totalMinutes: number = 0;

  @Prop({ type: Array, default: [] }) activities: Array<Activity>;
  @Prop({ type: Object, default: {} }) invoice: Invoice;

  @Watch('activities')
  onActivitiesChanged(activities: Array<Activity>) {
    this.totalMinutes = activities
      .reduce((acc: number, next: Activity) => acc + parseInt(next.durationMinutes), 0);
  }

  computeTotal() {
    const subTotal = this.activities.reduce((acc:number, activity:Activity) => {
      return acc + activity.durationMinutes / 60 * this.invoice.rate
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
