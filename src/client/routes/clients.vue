<template>
  <div class="bg-white shadow m-4 ml-0 rounded-lg overflow-hidden">
    <div class="border-b p-4 flex bg-gray-700 text-white">
      <h2 class="text-lg font-semibold">Clients</h2>
    </div>
    <ul class="border-b p-4">
      <client
        :client="client"
        :get-clients="getClients"
        v-for="client in clients"
        :key="client.id"
      ></client>
    </ul>
    <add-client class="p-4" :get-clients="getClients"></add-client>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import http from '../http';
import AddClient from './../components/add-client.vue';
import Client from './../components/client.vue';

export default defineComponent({
  components: {
    AddClient,
    Client,
  },

  data(): {
    clients: {}[];
  } {
    return { clients: [] };
  },

  created() {
    this.getClients();
  },

  methods: {
    async getClients() {
      const response = await http('/api/clients', {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });

      const data = await response.json();

      if (data.success) {
        this.clients = data.clients;
      }
    },
  },
});
</script>
