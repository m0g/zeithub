import { defineComponent } from 'vue';
import { formatDate, invoiceNum } from '../filters';

export default defineComponent({
  props: ['invoice', 'me'],
  computed: {
    invoiceNumber() {
      return invoiceNum(this.invoice.number);
    },
    invoiceDate() {
      return formatDate(this.invoice.date, 'dd/MM/yyyy');
    },
    invoiceDueDate() {
      return formatDate(this.invoice.dueDate, 'dd/MM/yyyy');
    },
  },
  template: `
    <table class="info">
      <tr>
        <td>Invoice number</td>
        <td>{{ invoiceNumber }}</td>
      </tr>
      <tr>
        <td>Date</td>
        <td>{{invoiceDate}}</td>
      </tr>
      <tr>
        <td>Due date</td>
        <td>{{invoiceDueDate}}</td>
      </tr>
    </table>
  `,
});
