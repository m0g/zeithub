<template>
  <div class="p-4 border-b">
    <h3 class="text-bg font-semibold">Client</h3>
    <select
      name="client"
      class="select"
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
      >
        {{ client.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import http from './../http';
import { Client } from '../../models';
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  props: ['clientId'],
  data(): {
    clients: Client[];
  } {
    return {
      clients: [],
    };
  },

  created() {
    this.getClients();
  },

  methods: {
    onChange(e) {
      this.$emit('clientId', parseInt(e.target.value));
    },

    async getClients() {
      const response = await http('/api/clients');
      const data = await response.json();

      this.clients = data.clients;
    },
  },
});
</script>
