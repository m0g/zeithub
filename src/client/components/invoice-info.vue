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
import { defineComponent } from 'vue';
import { formatDate } from '../../lib/filters';

export default defineComponent({
  props: ['invoice', 'me'],
  methods: { formatDate },
});
</script>
