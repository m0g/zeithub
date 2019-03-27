<template>
  <p>
    <select @change="onChange($event)">
      <option value="" disabled selected>Select a currency</option>
      <option
        v-for="currency in currencies"
        :key="currency.code"
        :value="currency.code"
        :selected="currency.code === currencyCode"
      >
        {{ currency.name }} ({{ currency.sign }})
      </option>
    </select>
  </p>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import http from '../http';

const Props = Vue.extend({
  props: ['currencyCode']
});

@Component({})
export default class SelectBankAccount extends Props {
  currencies: Array<Object> = [];

  @Emit('currencyCode')
  onChange(e) {
    return e.target.value;
  }

  created() {
    this.getAddresses();
  }

  async getAddresses() {
    const response = await http('/api/currencies', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    });

    const data = await response.json();

    if (data.success) {
      this.currencies = data.currencies;
    }
  }
}
</script>
