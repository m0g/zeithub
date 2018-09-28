<template>
  <fieldset>
    <legend>Clients</legend>
    <ul>
      <client 
        :client="client" 
        :get-clients="getClients" 
        v-for="client in clients" 
        :key="client.id"></client>
    </ul>
    <add-client :get-clients="getClients"></add-client>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import AddClient from './add-client.vue';
import Client from './client.vue';

@Component({
  components: {
    AddClient,
    Client
  }
})
export default class Clients extends Vue {
  clients: {}[] = [];

  created() {
    this.getClients();
  }

  async getClients() {
    const response = await http('/api/clients', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    });

    const data = await response.json();

    if (data.success) {
      this.clients = data.clients;
    }
  }
}
</script>
