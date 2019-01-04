<template>
  <fieldset>
    <legend>Project & Client</legend>
    <select name="project" id="" v-model="value.project" @change="getClients">
      <option value="">Select a project</option>
      <option
        v-for="project in projects"
        :key="project.slug"
        :value="project.slug"
        >{{ project.name }}</option
      >
    </select>
    <select
      name="client"
      id=""
      v-model="value.client"
      :disabled="clients.length === 0"
    >
      <option value="">Select a client</option>
      <option v-for="client in clients" :key="client.id" :value="client.id">{{
        client.name
      }}</option>
    </select>
  </fieldset>
</template>

<script lang="ts">
import http from './../http';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

const Props = Vue.extend({
  props: ['value']
});

@Component({})
export default class ProjectAndClient extends Props {
  projects: {}[] = [];
  clients: Array<Object> = [];

  created() {
    this.getProjects();
  }

  async getProjects() {
    const response = await http('/api/projects');
    const data = await response.json();

    this.projects = data;
  }

  async getClients(e) {
    const slug = e.target.value;

    if (slug) {
      const response = await http(`/api/projects/${slug}/clients`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success && data.clients.length > 0) {
        this.clients = data.clients;
      }
    }
  }
}
</script>
