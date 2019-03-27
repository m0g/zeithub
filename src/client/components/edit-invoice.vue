<template>
  <form method="PUT" @submit="updateInvoice">
    <form-errors :errors="errors"></form-errors>
    <select-client
      v-bind:clientId="invoice.clientId"
      v-on:clientId="invoice.clientId = $event"
    ></select-client>
    <billing v-bind:invoice="invoice" v-on:invoice="invoice = $event"></billing>
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
              v-bind:value="item.projectId"
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
              min="1"
              max="999"
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
      <input type="submit" value="Create invoice" />
    </fieldset>
  </form>
</template>

<script lang="ts">
import http from './../http';
import FormErrors from './form-errors.vue';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import { Item, Project, Invoice } from './../../models';
import SelectBankAccount from './select-bank-account.vue';
import SelectAddress from './select-address.vue';
import SelectCurrency from './select-currency.vue';
import SelectClient from './select-client.vue';
import SelectProject from './select-project.vue';
import Billing from './billing.vue';

@Component({
  components: {
    FormErrors,
    SelectBankAccount,
    SelectAddress,
    SelectCurrency,
    SelectClient,
    SelectProject,
    Billing
  }
})
export default class EditInvoice extends Vue {
  items: Item[] = [];
  invoice: Invoice = new Invoice();
  subTotal: number = 0;
  total: number = 0;
  errors: Array<string> = [];
  currency: string = '';

  created() {
    this.getInvoice();
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

  async getInvoice() {
    const response = await http(`/api/invoices/${this.$route.params.id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (data.success) {
      this.invoice = data.invoice;
      this.items = data.items;
      this.invoice.date = data.invoice.date.match(/\d{4}-\d{2}-\d{2}/)[0];
      this.invoice.dueDate = data.invoice.dueDate.match(/\d{4}-\d{2}-\d{2}/)[0];
    }
  }

  async updateInvoice(e) {
    e.preventDefault();
    this.errors = [];

    if (!this.clientId) {
      this.errors.push('Client is missing');
    }

    if (!this.name) {
      this.errors.push('Title is missing');
    }

    if (!this.date) {
      this.errors.push('Date is missing');
    }

    if (!this.dueDate) {
      this.errors.push('Due date is missing');
    }

    if (!this.iban) {
      this.errors.push('Bank account is missing');
    }

    if (!this.userAddressId) {
      this.errors.push('Address is missing');
    }

    if (this.items.length === 0) {
      this.errors.push('You should at least add one item');
    }

    if (!this.currency) {
      this.errors.push('Currency is missing');
    }

    if (this.errors.length === 0) {
      const body = {
        clientId: this.clientId,
        projectId: this.projectId,
        name: this.name,
        number: this.invoiceNumber,
        date: this.date,
        dueDate: this.dueDate,
        discount: this.discount,
        vat: this.vat,
        iban: this.iban,
        userAddressId: this.userAddressId,
        memo: this.memo,
        currency: this.currency,
        items: this.items
      };

      const response = await http('/api/invoices/with-items', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success && data.invoiceId) {
        this.$router.push({
          name: 'Invoice',
          params: { id: data.invoiceId }
        });
      }
    }
  }
}
</script>
