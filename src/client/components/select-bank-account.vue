<template>
  <p>
    <select
      v-bind:value="iban"
      @change="onChange($event)"
    >
      <option value="" disabled selected>Select a bank account</option>
      <option
        v-for="account in bankAccounts" 
        :key="account.iban"
        :value="account.iban">
          {{account.name}} {{account.owner}} {{account.iban}} {{account.bic}}
      </option>
    </select>
  </p>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import http from '../http';

const Props = Vue.extend({
  props: ['iban']
});

@Component({})
export default class SelectBankAccount extends Props {
  bankAccounts: Array<Object> = [];

  created() {
    this.getBankAccounts();
  }

  @Emit('iban')
  onChange(e) {
    return e.target.value;
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
}
</script>
