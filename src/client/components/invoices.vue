<template>
  <div class="bg-white shadow m-4 ml-0 p-4 rounded-lg">
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
          <button @click="downloadPDF(invoice)">Download</button>
          <button @click="remove(invoice)">&#x2718;</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import slugify from 'slugify';
import Component from 'vue-class-component';

import http from '../http';
import * as M from './../../models';

@Component({})
export default class Invoices extends Vue {
  invoices: {}[] = [];
  me: M.Me = new M.Me();

  created() {
    this.getInvoices();
    this.getMe();
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

  async downloadPDF(invoice) {
    const title = slugify(invoice.name);
    const fullName = `${this.me.firstName}-${this.me.lastName}`;
    const filename = `${invoice.number
      .toString()
      .padStart(3, '0')}-${title}-${fullName}.pdf`.toLowerCase();

    const response = await http(`/api/invoices/${invoice.id}/pdf`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const blob = await response.blob();
    const file = new Blob([blob], { type: 'application/pdf' });
    const link = document.createElement('a');

    link.href = window.URL.createObjectURL(file);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async getMe() {
    const response = await http('/api/me');
    const data = await response.json();

    if (data.success) {
      this.me = data.me;
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
