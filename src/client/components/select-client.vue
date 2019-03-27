<template>
  <fieldset>
    <legend>Client</legend>
    <select
      name="client"
      id=""
      @change="onChange($event)"
      :disabled="clients.length === 0"
    >
      <option value="0" disabled selected>Select a client</option>
      <option
        v-for="client in clients"
        :key="client.id"
        :value="client.id"
        :selected="client.id === clientId"
        >{{ client.name }}</option
      >
    </select>
  </fieldset>
</template>

<script lang="ts">
import http from './../http';
import { Component, Prop, Watch, Vue, Emit } from 'vue-property-decorator';
import { Client } from '../../models';

const Props = Vue.extend({
  props: ['clientId', 'value']
});

@Component({})
export default class SelectClient extends Props {
  clients: Client[] = [];

  created() {
    this.getClients();
  }

  @Emit('clientId')
  onChange(e) {
    return e.target.value;
  }

  async getClients() {
    const response = await http('/api/clients');
    const data = await response.json();

    this.clients = data.clients;
  }
}
</script>
