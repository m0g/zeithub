<template>
  <div class="bg-white shadow m-4 ml-0 rounded-lg overflow-hidden">
    <div class="border-b p-4 flex bg-gray-700 text-white">
      <h2>Projects</h2>
    </div>
    <div class="p-4">
      <router-link to="/projects/new">Create project</router-link>
      <ul>
        <li v-for="project in projects" :key="project.slug">
          <router-link
            :to="{ name: 'Project', params: { slug: project.slug } }"
          >
            {{ project.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';

let projects: {}[] = [];

export default {
  created() {
    http('/api/projects')
      .then(data => data.json())
      .then(projects => {
        projects = projects;
      });
  },
};
</script>
