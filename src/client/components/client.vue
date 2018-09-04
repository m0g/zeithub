<template>
  <fieldset>
    <legend>Client</legend>
    <select 
      @change="updateClient(client)" 
      name="client" 
      v-model="client.id" 
      :disabled="clients.length === 0">
      <option value="">Select a client</option>
      <option 
        v-for="client in clients" 
        :key="client.id" 
        :value="client.id">{{client.name}}</option>
    </select>
    <p v-if="exists">{{client.name}}</p>
    <p v-if="!exists">Client does not exists</p>
    <p v-if="!exists"><button v-on:click="showForm = true">Create one</button></p>
    <form action="" v-if="showForm" @submit="createClient">
      <form-errors :errors="errors"></form-errors>
      <input type="text" name="name" v-model="name" />
      <input type="submit" value="Add" />
    </form>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue';
import http from '../http';
import Component from 'vue-class-component';
import FormErrors from './form-errors.vue';

@Component({ components: { FormErrors } })
export default class Client extends Vue {
  exists: boolean = false;
  showForm: boolean = false;
  errors: Array<string> = [];
  client: { id: number; name: string } = { id: 0, name: '' };
  clients: {}[] = [];

  created() {
    this.getClient();
    this.getClients();
  }

  getClient() {
    const slug: string = this.$route.params.slug;

    http(`/api/projects/${slug}/clients`)
      .then(data => data.json())
      .then(data => {
        if (data.success && data.clients.length > 0) {
          this.exists = true;
          this.client = data.clients[0];
        }
      });
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

  updateClient(client) {
    const slug: string = this.$route.params.slug;

    http(`/api/projects/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: this.client.id
      })
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
      });
  }

  createClient(e) {
    const slug: string = this.$route.params.slug;

    e.preventDefault();
    this.errors = [];

    if (!this.client) {
      this.errors.push('Name is required');
    }

    if (this.errors.length === 0) {
      http(`/api/projects/${slug}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.client.name
        })
      })
        .then(response => response.json())
        .then(response => {
          if (response.success === true) {
            this.client = { id: 0, name: '' };
          }
        });
    }
  }
}
</script>
