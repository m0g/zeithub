<template>
  <form method="PUT" @submit="updateInvoice">
    <fieldset>
      <legend>Billing</legend>
      <p><input type="text" placeholder="Title" v-model="invoice.name"></p>
      <p><input 
        type="number" 
        placeholder="Invoice number" 
        v-model="invoice.number"></p>
      <p>
        <select v-model="bankAccount.iban">
          <option value="" disabled selected>Select a bank account</option>
          <option
            v-for="account in bankAccounts" 
            :key="account.iban"
            :value="account.iban">
              {{account.name}} {{account.owner}} {{account.iban}} {{account.bic}}
          </option>
        </select>
      </p>
      <p>
        <label for="rate">Rate</label>
        <input type="number" name="rate" id="rate" v-model="invoice.rate">&euro;
      </p>
    </fieldset>
    <fieldset>
      <legend>Actions</legend>
      <input type="submit" value="Update invoice" />
    </fieldset>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import http from './../http';
import * as M from './../../models';

@Component({})
export default class EditInvoice extends Vue {
  iban: string = '';
  bankAccounts: Array<Object> = [];
  bankAccount: M.BankAccount = new M.BankAccount();
  addresses: Array<Object> = [];
  address: string = '';
  invoiceNumber: number = 0;
  invoice: M.Invoice = new M.Invoice();

  created() {
    this.getBankAccounts();
    this.getAddresses();
    this.getInvoice();
  }

  getInvoice() {
    http(`/api/invoices/${this.$route.params.id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.invoice = response.invoice;
          this.bankAccount = response.bankAccount;
        }
      });
  }

  getBankAccounts() {
    http('/api/bank-accounts', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.bankAccounts = response.bankAccounts;
        }
      });
  }

  getAddresses() {
    http('/api/addresses', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.addresses = response.addresses;
        }
      });
  }

  updateInvoice(e) {
    e.preventDefault();

    http(`/api/invoices/${this.$route.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.invoice)
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.invoice = response.invoice;
        }
      });
  }
}
</script>
