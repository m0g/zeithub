// import * as Vue from "vue/dist/vue.common.js";
const Vue = require("vue/dist/vue.common");

require("./../filters");

module.exports = Vue.component("activities-table", {
  template: `
    <table class="activities" style="border-collapse: collapse; border: none">
      <tr style="border-bottom: 1px solid black">
        <th>Project</th>
        <th>Task</th>
        <th>Time</th>
        <th width="12%">Amount</th>
      </tr>
      <tr v-for="activity in activities" :key="activity.id">
        <td style="text-align: center">{{activity.projectName}}</td>
        <td style="text-align: center">{{activity.name}}</td>
        <td class="duration" style="text-align: center">
          {{activity.durationMinutes | formatHours}}
        </td>
        <td class="amount">
          {{activity.durationMinutes / 60 * invoice.rate | currency}}
        </td>
      </tr>
      <tr style="border-top: 1px solid black">
        <th></th>
        <th></th>
        <td><b>Total time</b></td>
        <td colspan="2" style="text-align: right">
          {{totalMinutes | formatHours}}&nbsp;
        </td>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <td><b>Sub total</b></td>
        <td colspan="2" style="text-align: right">
          {{totalMinutes / 60 * invoice.rate | currency}}
        </td>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <td><b>Discount</b></td>
        <td colspan="2" style="text-align: right">
          {{invoice.discount | currency}}
        </td>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <td><b>Tax (VAT)</b></td>
        <td colspan="2" style="text-align: right">
          {{invoice.tax | percentage}}
        </td>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <td><b>Total</b></td>
        <td colspan="2" style="text-align: right">
          {{computeTotal() | currency}}
        </td>
      </tr>
    </table>
  `,
  props: ["invoice", "me", "activities", "totalMinutes"],
  methods: {
    computeTotal() {
      const subTotal = this.activities.reduce((acc, activity) => {
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
});
