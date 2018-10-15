<template>
  <section>
    <router-link to="/invoices/new">Create new invoice</router-link>
    <ul>
      <li v-for="invoice in invoices" :key="invoice.number">
        <router-link :to="{ name: 'Invoice', params: { id: invoice.id } }">
          {{invoice.name}}
        </router-link>
        <button v-on:click="remove(invoice)">&#x2718;</button>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import http from '../http';
import Component from 'vue-class-component';

@Component({})
export default class Invoices extends Vue {
  invoices: {}[] = [];

  created() {
    this.getInvoices();
  }

  async getInvoices() {
    const response = await http('/api/invoices', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (data.success) {
      this.invoices = data.invoices;
    }
  }

  async remove({ id }) {
    const response = await http(`/api/invoices/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      this.getInvoices();
    }
  }
}
</script>
