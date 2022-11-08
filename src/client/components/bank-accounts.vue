<template>
  <div class="bg-white shadow m-4 ml-0 p-4 rounded-lg">
    <h2>Bank accounts</h2>
    <add-bank-account :get-bank-accounts="getBankAccounts"></add-bank-account>
    <ul>
      <li v-for="account in bankAccounts" :key="account.iban">
        <b>{{ account.name }}</b> {{ account.owner }} {{ account.iban | iban }}
        {{ account.bic }}
        <button v-on:click="deleteAccount(account.iban)">&#x2718;</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import Component from 'vue-class-component';

import http from '../http';
import AddBankAccount from './add-bank-account.vue';

export default defineComponent({
  components: { AddBankAccount },
  data(): {
    bankAccounts: {}[];
  } {
    return { bankAccounts: [] };
  },

  created() {
    this.getBankAccounts();
  },

  methods: {
    async getBankAccounts() {
      const response = await http('/api/bank-accounts', {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });

      const data = await response.json();

      if (data.success) {
        this.bankAccounts = data.bankAccounts;
      }
    },

    async deleteAccount(iban) {
      const response = await http(`/api/bank-accounts/${iban}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        this.getBankAccounts();
      }
    },
  },
});
</script>
