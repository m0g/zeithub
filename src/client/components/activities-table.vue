<template>
  <table class="activities" style="border-collapse: collapse; border: none">
    <tr style="border-bottom: 1px solid black">
      <th>Project</th>
      <th>Task</th>
      <th>{{ invoice.dailyRate ? 'Days' : 'Hours' }}</th>
      <th width="16%">Amount ({{ invoice.currencyCode }})</th>
    </tr>
    <tr v-for="activity in activities" :key="activity.id">
      <td style="text-align: center">{{ activity.projectName }}</td>
      <td style="text-align: center">{{ activity.name }}</td>
      <td v-if="!invoice.dailyRate" class="duration" style="text-align: center">
        {{ activity.durationMinutes | formatHours }}
      </td>
      <td v-if="invoice.dailyRate" class="duration" style="text-align: center">
        {{ activity.durationMinutes / (8 * 60) }}
      </td>
      <td v-if="!invoice.dailyRate" class="amount" style="text-align: right">
        {{
          ((activity.durationMinutes / 60) * invoice.rate) | currency(invoice)
        }}
      </td>
      <td v-if="invoice.dailyRate" class="amount" style="text-align: right">
        {{
          ((activity.durationMinutes / (8 * 60)) * invoice.rate)
            | currency(invoice)
        }}
      </td>
    </tr>
    <tr style="border-top: 1px solid black">
      <th></th>
      <th></th>
      <td>
        <b>Total {{ invoice.dailyRate ? 'days' : 'time' }}</b>
      </td>
      <td v-if="!invoice.dailyRate" colspan="2" style="text-align: right">
        {{ totalMinutes | formatHours }}&nbsp;
      </td>
      <td v-if="invoice.dailyRate" colspan="2" style="text-align: right">
        {{ totalMinutes / (8 * 60) }}&nbsp;
      </td>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <td><b>Sub total</b></td>
      <td v-if="!invoice.dailyRate" colspan="2" style="text-align: right">
        {{ ((totalMinutes / 60) * invoice.rate) | currency(invoice) }}
      </td>
      <td v-if="invoice.dailyRate" colspan="2" style="text-align: right">
        {{ ((totalMinutes / (8 * 60)) * invoice.rate) | currency(invoice) }}
      </td>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <td><b>Discount</b></td>
      <td colspan="2" style="text-align: right">
        {{ invoice.discount | currency(invoice) }}
      </td>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <td><b>Tax (VAT)</b></td>
      <td colspan="2" style="text-align: right">
        {{ invoice.tax | percentage }}
      </td>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <td>
        <b>Total ({{ invoice.currencyCode }})</b>
      </td>
      <td colspan="2" style="text-align: right">
        {{ computeTotal() | currency(invoice) }}
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

const Props = Vue.extend({
  props: ['invoice', 'me', 'activities', 'totalMinutes']
});

@Component({})
export default class ActivitiesTable extends Props {
  computeTotal() {
    const subTotal = this.activities.reduce((acc, activity) => {
      if (this.invoice.dailyRate) {
        return acc + (activity.durationMinutes / (8 * 60)) * this.invoice.rate;
      }
      return acc + (activity.durationMinutes / 60) * this.invoice.rate;
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
