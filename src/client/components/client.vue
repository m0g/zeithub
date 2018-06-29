<template>
  <fieldset>
    <legend>Client</legend>
    <p v-if="exists">{{name}}</p>
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
  name: string = '';

  created() {
    this.getClient();
  }

  getClient() {
    const slug: string = this.$route.params.slug;

    http(`/api/projects/${slug}/clients`)
      .then(data => data.json())
      .then(data => {
        if (data.success && data.clients.length > 0) {
          this.exists = true;
          this.name = data.clients[0].name;
        }
      });
  }

  createClient(e) {
    const slug: string = this.$route.params.slug;

    e.preventDefault();
    this.errors = [];

    if (!this.name) {
      this.errors.push('Name is required');
    }

    if (this.errors.length === 0) {
      http(`/api/projects/${slug}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name
        })
      })
        .then(response => response.json())
        .then(response => {
          if (response.success === true) {
            this.name = '';
          }
        });
    }
  }
}
</script>
