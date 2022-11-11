<template>
  <div class="bg-white shadow m-4 ml-0 rounded-lg overflow-hidden">
    <div class="border-b p-4 flex bg-gray-700 text-white">
      <h2 class="flex-1 text-lg font-semibold">Invoices</h2>
      <router-link to="/invoices/new" class="btn-primary"
        >Create new invoice</router-link
      >
    </div>
    <table class="table-auto w-full">
      <thead>
        <tr class="title bg-gray-100">
          <th class="border py-2">Number</th>
          <th class="border px-4 py-2">Name</th>
          <th class="border px-4 py-2">Total</th>
          <th class="border px-2 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(invoice, index) in invoices"
          :key="invoice.number"
          :class="{ 'bg-gray-100': index % 2 !== 0 }"
        >
          <td class="align-center text-center text-bold border py-2">
            {{ invoice.number }}
          </td>
          <td class="border px-4 py-2">
            <router-link :to="{ name: 'Invoice', params: { id: invoice.id } }">
              {{ invoice.name }}
            </router-link>
          </td>
          <td class="align-center border px-4 py-2">
            {{ getTotal(invoice) | currency(invoice) }}
          </td>
          <td class="align-center border px-2 py-2 text-center">
            <button @click="downloadPDF(invoice)" class="btn">
              <font-awesome-icon :icon="download" />
            </button>
            <button @click="remove(invoice)" class="btn ml-2">
              <font-awesome-icon icon="trash-alt" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import slugify from 'slugify';
import http from '../http';
import * as M from './../../models';

export default defineComponent({
  data(): {
    invoices: {}[];
    me: M.Me;
  } {
    return {
      invoices: [],
      me: new M.Me(),
    };
  },
  created() {
    this.getInvoices();
    this.getMe();
  },
  methods: {
    getTotal(invoice) {
      let total: number = invoice.subTotal;

      if (invoice.discount > 0) {
        total = total - invoice.discount;
      }

      if (invoice.tax > 0) {
        total = total * (1 + invoice.tax / 100);
      }

      return total;
    },

    async getInvoices() {
      const response = await http('/api/invoices', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.success) {
        this.invoices = data.invoices;
      }
    },

    async remove({ id }) {
      if (window.confirm('Do you really want to delete this invoice?')) {
        const response = await http(`/api/invoices/${id}`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          this.getInvoices();
        }
      }
    },

    async downloadPDF(invoice) {
      const title = slugify(invoice.name);
      const fullName = `${this.me.firstName}-${this.me.lastName}`;
      const filename = `${invoice.number
        .toString()
        .padStart(3, '0')}-${title}-${fullName}.pdf`.toLowerCase();

      const response = await http(`/api/invoices/${invoice.id}/pdf`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const blob = await response.blob();
      const file = new Blob([blob], { type: 'application/pdf' });
      const link = document.createElement('a');

      link.href = window.URL.createObjectURL(file);
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    async getMe() {
      const response = await http('/api/me');
      const data = await response.json();

      if (data.success) {
        this.me = data.me;
      }
    },
  },
});
</script>
