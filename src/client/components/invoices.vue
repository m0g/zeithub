<template>
  <section>
    <router-link to="/invoices/new">Create new invoice</router-link>
    <ul>
      <li v-for="invoice in invoices" :key="invoice.number">
        <router-link :to="{ name: 'Invoice', params: { id: invoice.id } }">
          {{ invoice.name }}
        </router-link>
        <span>{{ getTotal(invoice) | currency(invoice) }}</span>
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

  getTotal(invoice) {
    let total: number = 0;

    if (invoice.dailyRate) {
      total = (invoice.totalDurationMinutes / (8 * 60)) * invoice.rate;
    } else {
      total = (invoice.totalDurationMinutes / 60) * invoice.rate;
    }

    if (invoice.discount > 0) {
      total = total - invoice.discount;
    }

    if (invoice.tax > 0) {
      total = total * (1 + invoice.tax / 100);
    }

    return total;
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
