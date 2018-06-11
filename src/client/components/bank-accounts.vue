<template>
  <fieldset>
    <legend>Bank accounts</legend>
    <add-bank-account :get-bank-accounts="getBankAccounts"></add-bank-account>
    <ul>
      <li v-for="account in bankAccounts" :key="account.iban">
        <b>{{account.name}}</b> {{account.owner}} {{account.iban}} {{account.bic}}
        <button v-on:click="deleteAccount(account.iban)">&#x2718;</button>
      </li>
    </ul>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

import http from '../http';
import AddBankAccount from './add-bank-account.vue';

@Component({
  components: { AddBankAccount },
})
export default class BankAccounts extends Vue {
  bankAccounts:{}[] = [];

  created() {
    this.getBankAccounts();
  }

  getBankAccounts() {
    http('/api/bank-accounts', { 
      headers: { 'Content-Type': 'application/json' },
      method: 'GET', 
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          console.log(response);
          this.bankAccounts = response.bankAccounts;
        }
      });
  }

  deleteAccount(iban) {
    http(`/api/bank-accounts/${iban}`, { 
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE', 
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.getBankAccounts();
        }
      });
  }
};
</script>
