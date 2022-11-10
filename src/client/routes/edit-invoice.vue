<template>
  <form method="PUT" @submit="updateInvoice">
    <form-errors :errors="errors"></form-errors>
    <select-client
      v-bind:clientId="invoice.clientId"
      v-on:clientId="invoice.clientId = $event"
    ></select-client>
    <billing
      :editMode="true"
      v-bind:invoice="invoice"
      v-on:invoice="invoice = $event"
    ></billing>
    <fieldset>
      <legend>Invoice Items</legend>
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
          <td>
            <select-project
              v-bind:projectId="item.projectId"
              v-on:projectId="item.projectId = $event"
            ></select-project>
          </td>
          <td>
            <input type="text" placeholder="Description" v-model="item.title" />
          </td>
          <td>
            <input
              type="number"
              step="0.01"
              v-model="item.unitPrice"
              @keyup="computeTotal"
            />
          </td>
          <td>
            <input
              type="number"
              min="0.1"
              max="999"
              step="0.1"
              v-model="item.qty"
              @keyup="computeTotal"
            />
          </td>
          <td>{{ (item.qty * item.unitPrice) | currency }}</td>
          <td>
            <button @click="items.splice(index, 1)">&#x2718;</button>
          </td>
        </tr>
        <tr>
          <td><button @click="appendItem">Add another item</button></td>
        </tr>
        <tr>
          <th colspan="3">Sub total</th>
          <td>{{ subTotal | currency }}</td>
        </tr>
        <tr>
          <th colspan="3">Discount</th>
          <td>
            <input
              type="number"
              name="discount"
              v-model="invoice.discount"
              step="0.01"
              @keyup="computeTotal"
            />
            &euro;
          </td>
        </tr>
        <tr>
          <th colspan="3">Tax</th>
          <td>
            <input
              type="number"
              name="tax"
              v-model="invoice.tax"
              step="0.01"
              @keyup="computeTotal"
            />%
          </td>
        </tr>
        <tr>
          <th colspan="3">Total</th>
          <td>{{ total | currency }}</td>
        </tr>
      </table>
    </fieldset>
    <fieldset>
      <legend>Memo</legend>
      <textarea
        name="memo"
        id=""
        cols="40"
        rows="10"
        v-model="invoice.memo"
      ></textarea>
    </fieldset>
    <fieldset>
      <legend>Actions</legend>
      <input type="submit" value="Update invoice" />
    </fieldset>
  </form>
</template>

<script lang="ts">
import http from './../http';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import { Item, Project, Invoice } from './../../models';
import FormErrors from './../components/form-errors.vue';
import SelectClient from './../components/select-client.vue';
import SelectProject from './../components/select-project.vue';
import Billing from './../components/billing.vue';
import { defineComponent } from '@vue/runtime-core';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  components: {
    FormErrors,
    SelectClient,
    SelectProject,
    Billing,
  },

  data(): {
    items: Item[];
    invoice: Invoice;
    subTotal: number;
    total: number;
    errors: Array<string>;
  } {
    return {
      items: [],
      invoice: new Invoice(),
      subTotal: 0,
      total: 0,
      errors: [],
    };
  },

  created() {
    this.getInvoice();
  },

  methods: {
    appendItem(e) {
      e.preventDefault();
      this.items.push(new Item());
    },

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
    },

    async getInvoice() {
      const route = useRoute();
      const response = await http(`/api/invoices/${route.params.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.success) {
        this.invoice = data.invoice;
        this.items = data.items;
        this.invoice.date = data.invoice.date.match(/\d{4}-\d{2}-\d{2}/)[0];
        this.invoice.dueDate =
          data.invoice.dueDate.match(/\d{4}-\d{2}-\d{2}/)[0];
      }
    },

    async updateInvoice(e) {
      const router = useRouter();
      e.preventDefault();
      this.errors = [];

      if (this.items.length === 0) {
        this.errors.push('You should at least add one item');
      }

      if (this.errors.length === 0) {
        const body = {
          invoice: this.invoice,
          items: this.items,
        };

        const response = await http(`/api/invoices/${this.invoice.id}`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT',
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (data.success) {
          router.push({
            name: 'Invoice',
            params: { id: this.invoice.id },
          });
        }
      }
    },
  },
});
</script>
