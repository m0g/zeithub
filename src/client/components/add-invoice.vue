<template>
  <form method="POST" @submit="createInvoice">
    <form-errors :errors="errors"></form-errors>
    <project-and-client v-model="projectAndClient"></project-and-client>
    <fieldset>
      <legend>Billing</legend>
      <p><input type="text" placeholder="Title" v-model="name" /></p>
      <p>
        <input
          type="number"
          placeholder="Invoice number"
          :min="lastInvoiceNumber + 1"
          v-model="invoiceNumber"
        />
      </p>
      <select-address
        v-bind:value="userAddressId"
        v-on:userAddressId="userAddressId = $event"
      ></select-address>
      <select-bank-account
        v-bind:value="iban"
        v-on:iban="iban = $event"
      ></select-bank-account>
      <select-currency
        v-bind:value="currency"
        v-on:currency="currency = $event"
      ></select-currency>
      <p>
        <label for="date">Date</label>
        <input type="date" name="date" id="date" v-model="date" />
      </p>
      <p>
        <label for="due-date">Due date</label>
        <input type="date" name="due-date" id="due-date" v-model="dueDate" />
      </p>
    </fieldset>
    <fieldset>
      <legend>Invoice Items</legend>
      <table>
        <tr>
          <th>Description</th>
          <th>Unit price</th>
          <th>Qty</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
        <tr v-for="(item, index) in items" :key="index">
          <td>
            <input type="text" placeholder="Description" v-model="item.name" />
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
            <input type="number" v-model="item.qty" @keyup="computeTotal" />
          </td>
          <td>{{ (item.qty * item.unitPrice) | currency }}</td>
          <td>
            <button @click="activities.splice(index, 1)">&#x2718;</button>
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
              v-model="discount"
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
              v-model="vat"
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
      <textarea name="memo" id="" cols="40" rows="10" v-model="memo"></textarea>
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

import { Item } from './../../types';
import SelectBankAccount from './select-bank-account.vue';
import SelectAddress from './select-address.vue';
import ProjectAndClient from './project-and-client.vue';
import SelectCurrency from './select-currency.vue';

@Component({
  components: {
    FormErrors,
    SelectBankAccount,
    SelectAddress,
    ProjectAndClient,
    SelectCurrency
  }
})
export default class AddInvoice extends Vue {
  projectAndClient: { project: string; client: number } = {
    project: '',
    client: 0
  };
  items: Item[] = [];
  invoice: Object = {};
  discount: number = 0;
  vat: number = 0;
  subTotal: number = 0;
  total: number = 0;
  errors: Array<string> = [];
  date: string = '';
  dueDate: string = '';
  memo: string = '';
  name: string = '';
  iban: string = '';
  userAddressId: string = '';
  invoiceNumber: number = 0;
  lastInvoiceNumber: number = 0;
  currency: string = '';

  created() {
    this.getLastInvoiceNumber();
  }

  getLastInvoiceNumber() {
    http('/api/invoices', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          response.invoices.forEach(invoice => {
            if (invoice.number > this.lastInvoiceNumber) {
              this.lastInvoiceNumber = invoice.number;
            }
          });

          this.invoiceNumber = this.lastInvoiceNumber + 1;
        }
      });
  }

  appendItem(e) {
    e.preventDefault();

    this.items.push({
      title: '',
      qty: 0,
      unitPrice: 0
    });
  }

  computeTotal() {
    this.subTotal = this.items.reduce((acc: number, item: Item) => {
      return acc + item.unitPrice * item.qty;
    }, 0);

    this.total = this.subTotal;

    if (this.discount > 0) {
      this.total = this.total - this.discount;
    }

    if (this.vat > 0) {
      this.total = this.total * (1 + this.vat / 100);
    }
  }

  async createInvoice(e) {
    e.preventDefault();
    this.errors = [];

    if (!this.projectAndClient.client) {
      this.errors.push('Client is missing');
    }

    if (!this.projectAndClient.project) {
      this.errors.push('Project is missing');
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
        client: this.projectAndClient.client,
        projectSlug: this.projectAndClient.project,
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
