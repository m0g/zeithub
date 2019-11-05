<template>
  <table class="info">
    <tr>
      <td>Invoice number</td>
      <td>{{ invoice.number | invoiceNum }}</td>
    </tr>
    <tr>
      <td>Date</td>
      <td>{{ invoice.date | formatDate('dd/MM/yyyy') }}</td>
    </tr>
    <tr>
      <td>Due date</td>
      <td>{{ invoice.dueDate | formatDate('dd/MM/yyyy') }}</td>
    </tr>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: ['invoice', 'me']
});
</script>
