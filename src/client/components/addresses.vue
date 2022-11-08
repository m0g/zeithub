<template>
  <div class="bg-white shadow m-4 ml-0 rounded-lg">
    <div class="border-b p-4">
      <h2 class="text-lg font-semibold">Addresses</h2>
    </div>
    <add-address class="p-4" :get-addresses="getAddresses"></add-address>
    <ul class="border-t p-4">
      <address-info
        :address="address"
        :get-addresses="getAddresses"
        v-for="address in addresses"
        :key="address.id"
      ></address-info>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import http from '../http';
import AddAddress from './add-address.vue';
import AddressInfo from './address-info.vue';

export default defineComponent({
  components: { AddAddress, AddressInfo },
  data(): {
    addresses: {}[];
  } {
    return { addresses: [] };
  },

  created() {
    this.getAddresses();
  },

  methods: {
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
