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

<script lang="ts" setup>
import { onMounted, ref } from '@vue/runtime-core';
import http from '../http';

let projects = ref([]);

onMounted(() => {
  http('/api/projects')
    .then(data => data.json())
    .then(data => {
      projects.value = data;
    });
});
</script>
