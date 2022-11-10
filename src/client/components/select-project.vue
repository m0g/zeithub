<template>
  <span>
    <select
      name="project"
      class="select"
      @change="onChange($event)"
      :disabled="projects.length === 0"
    >
      <option value="0">Select a project</option>
      <option
        v-for="project in projects"
        :key="project.id"
        :value="project.id"
        :selected="project.id === projectId"
      >
        {{ project.name }}
      </option>
    </select>
  </span>
</template>

<script lang="ts">
import http from './../http';
import { Project } from '../../models';
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  props: ['projectId'],
  data(): {
    projects: Project[];
  } {
    return {
      projects: [],
    };
  },

  created() {
    this.getProjects();
  },

  methods: {
    // @Emit('projectId')
    onChange(e) {
      return e.target.value;
    },

    async getProjects() {
      const response = await http('/api/projects');
      const data = await response.json();

      this.projects = data;
    },
  },
});
</script>
