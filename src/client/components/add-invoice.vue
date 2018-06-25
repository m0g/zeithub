<template>
  <fieldset>
    <legend>Create invoice</legend>
    <select name="client" id="" v-model="client">
      <option value="">Select a client</option>
      <option 
        v-for="client in clients" 
        :key="client.id" 
        :value="client.id">{{client.name}}</option>
    </select>
  </fieldset>
</template>

<script lang="ts">
import http from './../http';

import {
  Component,
  Prop,
  Vue,
} from "vue-property-decorator";

@Component
export default class AddInvoice extends Vue {
  client:Object = {};
  clients:Array<Object> = [];

  created() {
    console.log('on created')
    this.getClients();
  }

  getClients() {
    http('/api/clients', {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(response => {
        if (response.success && response.clients.length > 0) {
          this.clients = response.clients;
        }
      });
  }
}
</script>
