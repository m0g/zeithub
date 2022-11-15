<template>
  <div class="mt-4">
    <select @change="onChange($event)" class="select">
      <option value="" disabled selected>Select a bank account</option>
      <option
        v-for="account in bankAccounts"
        :key="account.id"
        :value="account.id"
        :selected="account.id === bankAccountId"
      >
        {{ account.name }} {{ account.owner }} {{ account.iban }}
        {{ account.bic }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import http from '../http';

export default defineComponent({
  props: ['bankAccountId'],
  data(): {
    bankAccounts: Array<Object>;
  } {
    return { bankAccounts: [] };
  },
  created() {
    this.getBankAccounts();
  },

  methods: {
    onChange(e) {
      this.$emit('bankAccountId', parseInt(e.target.value));
    },

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
  },
});
</script>
