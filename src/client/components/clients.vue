<template>
  <fieldset>
    <legend>Clients</legend>
    <ul>
      <li v-for="client in clients" :key="client.id">
        <span>{{client.name}}</span>
        <span>{{client.street}}</span>
        <button v-on:click="remove(client.id)">&#x2718;</button>
      </li>
    </ul>
    <add-client :get-clients="getClients"></add-client>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import AddClient from './add-client.vue';

@Component({ components: { AddClient } })
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

  async remove(id) {
    const response = await http(`/api/clients/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      this.getClients();
    }
  }
}
</script>
