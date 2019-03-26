<template>
  <fieldset>
    <legend>Client</legend>
    <select
      name="client"
      id=""
      v-model="value"
      :disabled="clients.length === 0"
    >
      <option value="">Select a client</option>
      <option v-for="client in clients" :key="client.id" :value="client.id">
        {{ client.name }}
      </option>
    </select>
  </fieldset>
</template>

<script lang="ts">
import http from './../http';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { Client } from '../../models';

const Props = Vue.extend({
  props: ['value']
});

@Component({})
export default class SelectClient extends Props {
  clients: Client[] = [];

  created() {
    this.getClients();
  }

  async getClients() {
    const response = await http('/api/clients');
    const data = await response.json();

    this.clients = data.clients;
  }
}
</script>
