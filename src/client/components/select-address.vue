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
import { Vue, Component, Emit } from 'vue-property-decorator';
import http from '../http';

const Props = Vue.extend({
  props: ['userAddressId']
});

@Component({})
export default class SelectBankAccount extends Props {
  addresses: Array<Object> = [];

  @Emit('userAddressId')
  onChange(e) {
    return parseInt(e.target.value);
  }

  created() {
    this.getAddresses();
  }

  async getAddresses() {
    const response = await http('/api/addresses', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    });

    const data = await response.json();

    if (data.success) {
      this.addresses = data.addresses;
    }
  }
}
</script>
