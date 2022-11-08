import { formatDate } from '../filters';

export default {
  props: ['invoice', 'me'],
  computed: { formatDate },
  template: `
    <table class="info">
      <tr>
        <td>Invoice number</td>
        <td>{{invoice.number | invoiceNum}}</td>
      </tr>
      <tr>
        <td>Date</td>
        <td>{{invoice.date | formatDate('dd/MM/yyyy')}}</td>
      </tr>
      <tr>
        <td>Due date</td>
        <td>{{invoice.dueDate | formatDate('dd/MM/yyyy')}}</td>
      </tr>
    </table>
  `,
};
