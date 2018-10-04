<template>
  <div>
    <router-link to="/projects/new">Create project</router-link>
    <ul>
      <li v-for="project in projects" :key="project.slug">
        <router-link :to="{ name: 'Project', params: { slug: project.slug } }">
          {{project.name}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';

Component({});
export default class Projects extends Vue {
  projects: [] = [];

  created() {
    http('/api/projects')
      .then(data => data.json())
      .then(projects => {
        this.projects = projects;
      });
  }
}
</script>
