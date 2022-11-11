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
        <Invoice
          v-for="(invoice, index) in invoicesStore.invoices"
          :key="invoice.number"
          :invoice="invoice"
          :index="index"
        />
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import slugify from 'slugify';
import http from '../http';
import * as M from './../../models';
import { currency } from '../../lib/filters';
import Invoice from '../components/invoice.vue';
import { useInvoicesStore } from '../stores/invoices';
import { useMeStore } from '../stores/me';
import { mapStores } from 'pinia';

export default defineComponent({
  components: { Invoice },
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
    this.meStore.fetchMe();
    this.invoicesStore.fetchInvoices();
  },
  computed: { currency, ...mapStores(useInvoicesStore, useMeStore) },
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
  },
});
</script>
