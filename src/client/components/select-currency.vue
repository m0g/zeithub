<template>
  <div class="mt-4">
    <select @change="onChange($event)" class="select">
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import http from '../http';

export default defineComponent({
  props: ['currencyCode'],
  data(): {
    currencies: Array<Object>;
  } {
    return { currencies: [] };
  },

  created() {
    this.getAddresses();
  },

  methods: {
    // @Emit('currencyCode')
    onChange(e) {
      return e.target.value;
    },
    async getAddresses() {
      const response = await http('/api/currencies', {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });

      const data = await response.json();

      if (data.success) {
        this.currencies = data.currencies;
      }
    },
  },
});
</script>
