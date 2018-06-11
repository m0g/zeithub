<template>
  <fieldset>
    <legend>Addresses</legend>
    <add-address :get-addresses="getAddresses"></add-address>
    <ul>
      <li v-for="ad in addresses" :key="ad.id">
        <b>{{ad.name}}</b> {{ad.street}}, {{ad.postcode}} {{ad.city}}, {{ad.country}}
      </li>
    </ul>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue'
import http from '../http';
import Component from 'vue-class-component';
import AddAddress from './add-address.vue';

@Component({ 
  components: { AddAddress },
})
export default class Addresses extends Vue {
  addresses:{}[] = [];

  created() {
    this.getAddresses();
  }

  getAddresses() {
    http('/api/addresses', { 
      headers: { 'Content-Type': 'application/json' },
      method: 'GET', 
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.addresses = response.addresses;
        }
      });
  }
}
</script>
