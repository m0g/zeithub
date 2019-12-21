<template>
  <v-card>
    <v-toolbar color="primary" dark flat class="mt-5">
      <v-toolbar-title>Bank accounts</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <add-bank-account :get-bank-accounts="getBankAccounts"></add-bank-account>
      <ul>
        <li v-for="account in bankAccounts" :key="account.iban">
          <b>{{ account.name }}</b> {{ account.owner }}
          {{ account.iban | iban }} {{ account.bic }}
          <v-btn text icon color="red" @click="deleteAccount(account.iban)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </li>
      </ul>
    </v-card-text>
  </v-card>
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
