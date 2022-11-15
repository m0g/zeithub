<template>
  <table class="info">
    <tr>
      <td>Invoice number</td>
      <td>{{ invoiceNumber }}</td>
    </tr>
    <tr>
      <td>Date</td>
      <td>{{ invoiceDate }}</td>
    </tr>
    <tr>
      <td>Due date</td>
      <td>{{ invoiceDueDate }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { formatDate, invoiceNum } from '../../lib/filters';

export default defineComponent({
  props: ['invoice', 'me'],
  methods: { formatDate },
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
});
</script>
