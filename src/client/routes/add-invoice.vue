<template>
  <div class="bg-white shadow m-4 ml-0 rounded-lg overflow-hidden">
    <div class="border-b p-4 flex bg-gray-700 text-white">
      <h2>Create Invoice</h2>
    </div>
    <form method="POST" @submit="createInvoice">
      <form-errors :errors="errors"></form-errors>
      <select-client
        v-bind:clientId="invoice.clientId"
        v-on:clientId="invoice.clientId = $event"
      ></select-client>
      <billing
        :editMode="false"
        v-bind:invoice="invoice"
        v-on:invoice="invoice = $event"
      ></billing>
      <div class="p-4 border-b">
        <h3 class="text-bg font-semibold">Invoice Items</h3>
        <table>
          <tr>
            <th>Project</th>
            <th>Description</th>
            <th>Unit price</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
          <tr v-for="(item, index) in items" :key="index">
            <td class="px-4 py-2">
              <select-project
                v-bind:value="item.projectId"
                v-on:projectId="item.projectId = $event"
              ></select-project>
            </td>
            <td class="px-4 py-2">
              <input
                type="text"
                class="input"
                placeholder="Description"
                v-model="item.title"
              />
            </td>
            <td class="px-4 py-2">
              <input
                type="number"
                class="input"
                step="0.01"
                v-model="item.unitPrice"
                @keyup="computeTotal"
              />
            </td>
            <td class="px-4 py-2">
              <input
                type="number"
                class="input"
                min="0.1"
                max="999"
                step="0.1"
                v-model="item.qty"
                @keyup="computeTotal"
              />
            </td>
            <td class="px-4 py-2">
              {{ (item.qty * item.unitPrice) | currency }}
            </td>
            <td class="px-4 py-2">
              <button @click="items.splice(index, 1)">&#x2718;</button>
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2">
              <button @click="appendItem" class="btn">Add another item</button>
            </td>
          </tr>
          <tr>
            <th class="px-4 py-2" colspan="3">Sub total</th>
            <td class="px-4 py-2">{{ subTotal | currency }}</td>
          </tr>
          <tr>
            <th colspan="3" class="px-4 py-2">Discount</th>
            <td class="px-4 py-2">
              <input
                type="number"
                class="input"
                name="discount"
                v-model="invoice.discount"
                step="0.01"
                @keyup="computeTotal"
              />
              &euro;
            </td>
          </tr>
          <tr>
            <th colspan="3" class="px-4 py-2">Tax</th>
            <td class="px-4 py-2">
              <input
                type="number"
                class="input"
                name="tax"
                v-model="invoice.tax"
                step="0.01"
                @keyup="computeTotal"
              />%
            </td>
          </tr>
          <tr>
            <th colspan="3" class="px-4 py-2">Total</th>
            <td class="px-4 py-2">{{ total | currency }}</td>
          </tr>
        </table>
      </div>
      <div class="p-4 border-b">
        <h3 class="text-lg font-semibold">Memo</h3>
        <textarea
          name="memo"
          cols="40"
          rows="10"
          v-model="invoice.memo"
        ></textarea>
      </div>
      <div class="p-4 border-b">
        <input type="submit" class="btn-primary" value="Create invoice" />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import http from './../http';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import { Item, Project, Invoice } from './../../models';
import FormErrors from './../components/form-errors.vue';
import SelectClient from './../components/select-client.vue';
import SelectProject from './../components/select-project.vue';
import Billing from './../components/billing.vue';

@Component({
  components: {
    FormErrors,
    SelectProject,
    SelectClient,
    Billing
  }
})
export default class AddInvoice extends Vue {
  items: Item[] = [];
  invoice: Invoice = new Invoice();
  subTotal: number = 0;
  total: number = 0;
  errors: Array<string> = [];

  created() {
    window.addEventListener('beforeunload', this.storeForm);
    this.retrieveForm();
  }

  retrieveForm() {
    const json = localStorage.getItem('newInvoice');

    if (json) {
      const data = JSON.parse(json);

      if (data.invoice) {
        this.invoice = data.invoice;
      }

      if (data.items) {
        this.items = data.items;
        this.computeTotal(); // Otherwise totals will remain at 0
      }
    }
  }

  storeForm() {
    console.log('store form');
    localStorage.setItem(
      'newInvoice',
      JSON.stringify({
        invoice: this.invoice,
        items: this.items
      })
    );
  }

  appendItem(e) {
    e.preventDefault();
    this.items.push(new Item());
  }

  computeTotal() {
    this.subTotal = this.items.reduce((acc: number, item: Item) => {
      return acc + item.unitPrice * item.qty;
    }, 0);

    this.total = this.subTotal;

    if (this.invoice.discount > 0) {
      this.total = this.total - this.invoice.discount;
    }

    if (this.invoice.tax > 0) {
      this.total = this.total * (1 + this.invoice.tax / 100);
    }
  }

  async createInvoice(e) {
    e.preventDefault();
    this.errors = [];

    // TODO: add some invoice check
    if (this.items.length === 0) {
      this.errors.push('You should at least add one item');
    }

    if (this.errors.length === 0) {
      const body = {
        invoice: this.invoice,
        items: this.items
      };

      const response = await http('/api/invoices/with-items', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success && data.invoiceId) {
        this.invoice = new Invoice();
        this.items = [];

        localStorage.setItem('newInvoice', '{}');

        this.$router.push({
          name: 'Invoice',
          params: { id: data.invoiceId }
        });
      }
    }
  }
}
</script>
