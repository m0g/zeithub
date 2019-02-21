import * as Vue from "vue/dist/vue.common.js";

import "./../filters";

export default Vue.component("invoice-info", {
  props: ["invoice", "me"],
  template: `
    <table class="info">
      <tr>
        <td>Invoice number</td>
        <td>{{invoice.number | invoiceNum}}</td>
      </tr>
      <tr>
        <td>Date</td>
        <td>{{invoice.date | formatDate('DD/MM/YYYY')}}</td>
      </tr>
      <tr>
        <td>Due date</td>
        <td>{{invoice.dueDate | formatDate('DD/MM/YYYY')}}</td>
      </tr>
      <tr>
        <td>Tax number</td>
        <td>{{me.taxNumber}}</td>
      </tr>
      <tr>
        <td>VAT number</td>
        <td>{{me.vatNumber}}</td>
      </tr>
    </table>
  `
});
