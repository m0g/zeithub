<template>
  <fieldset>
    <legend>Invoices</legend>
    <ul>
      <li v-for="invoice in invoices" :key="invoice.number">
        <router-link :to="{ name: 'Invoice', params: { id: invoice.id } }">
          {{invoice.name}}
        </router-link>
      </li>
    </ul>
  </fieldset>
</template>

<script>
import http from '../http';

export default {
  data() {
    return { invoices: [] };
  },

  created() {
    http('/api/invoices', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(response => {
        if (response.success === true) {
          this.invoices = response.invoices;
        }
      });
  }
}
</script>
