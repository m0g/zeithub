// import * as Vue from "vue/dist/vue.common.js";
const Vue = require("vue/dist/vue.common");

require("./../filters");

module.exports = Vue.component("activities-table", {
  template: `
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
          {{activity.durationMinutes / 60 * invoice.rate | currencyPDF}}
          <img src="/euro.svg" width="6px" />
        </td>
      </tr>
      <tr>
        <th></th>
        <td>Total time</td>
        <td colspan="2">{{totalMinutes | formatHours}}</td>
      </tr>
      <tr>
        <th></th>
        <td>Sub total</td>
        <td colspan="2">
          {{totalMinutes / 60 * invoice.rate | currencyPDF}}
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
