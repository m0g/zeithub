<template>
  <section>
    <router-link to="/invoices/new">Create new invoice</router-link>
    <table>
      <tr class="title">
        <th>Name</th>
        <th>Total</th>
        <th>Actions</th>
      </tr>
      <tr v-for="invoice in invoices" :key="invoice.number">
        <td>
          <router-link :to="{ name: 'Invoice', params: { id: invoice.id } }">
            {{ invoice.name }}
          </router-link>
        </td>
        <td class="align-center">
          {{ getTotal(invoice) | currency(invoice) }}
        </td>
        <td class="align-center">
          <button v-on:click="remove(invoice)">&#x2718;</button>
        </td>
      </tr>
    </table>
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
    let total: number = invoice.subTotal;

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
    if (window.confirm('Do you really want to delete this invoice?')) {
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
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

tr.title {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

td.align-center {
  text-align: center;
}
</style>
