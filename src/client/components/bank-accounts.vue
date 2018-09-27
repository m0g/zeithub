<template>
  <fieldset>
    <legend>Bank accounts</legend>
    <add-bank-account :get-bank-accounts="getBankAccounts"></add-bank-account>
    <ul>
      <li v-for="account in bankAccounts" :key="account.iban">
        <b>{{account.name}}</b> {{account.owner}} {{account.iban | iban}} {{account.bic}}
        <button v-on:click="deleteAccount(account.iban)">&#x2718;</button>
      </li>
    </ul>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import http from '../http';
import AddBankAccount from './add-bank-account.vue';

@Component({
  components: { AddBankAccount }
})
export default class BankAccounts extends Vue {
  bankAccounts: {}[] = [];

  created() {
    this.getBankAccounts();
  }

  async getBankAccounts() {
    const response = await http('/api/bank-accounts', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    });

    const data = await response.json();

    if (data.success) {
      this.bankAccounts = data.bankAccounts;
    }
  }

  async deleteAccount(iban) {
    const response = await http(`/api/bank-accounts/${iban}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      this.getBankAccounts();
    }
  }
}
</script>
