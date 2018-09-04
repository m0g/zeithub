<template>
  <fieldset>
    <legend>Clients</legend>
    <ul>
      <li v-for="client in clients" :key="client.id">
        <span>{{client.name}}</span>
        <span>{{client.street}}</span>
        <button>Delete</button>
      </li>
    </ul>
    <add-client></add-client>
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

  getClients() {
    http('/api/clients', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.clients = response.clients;
        }
      });
  }
}
</script>
