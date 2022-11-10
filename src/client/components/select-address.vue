<template>
  <div class="mt-4">
    <select @change="onChange($event)" class="select">
      <option value="" disabled selected>Select an address</option>
      <option
        v-for="ad in addresses"
        :selected="ad.id === userAddressId"
        :key="ad.id"
        :value="ad.id"
      >
        <b>{{ ad.name }}</b> {{ ad.street }}, {{ ad.postcode }} {{ ad.city }},
        {{ ad.country }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import http from '../http';

export default defineComponent({
  props: ['userAddressId'],
  data(): {
    addresses: Array<Object>;
  } {
    return { addresses: [] };
  },

  created() {
    this.getAddresses();
  },

  methods: {
    // @Emit('userAddressId')
    onChange(e) {
      return parseInt(e.target.value);
    },

    async getAddresses() {
      const response = await http('/api/addresses', {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });

      const data = await response.json();

      if (data.success) {
        this.addresses = data.addresses;
      }
    },
  },
});
</script>
