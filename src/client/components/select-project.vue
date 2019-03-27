<template>
  <span>
    <select
      name="project"
      @change="onChange($event)"
      :disabled="projects.length === 0"
    >
      <option value="0">Select a project</option>
      <option
        v-for="project in projects"
        :key="project.id"
        :value="project.id"
        :selected="project.id === projectId"
        >{{ project.name }}</option
      >
    </select>
  </span>
</template>

<script lang="ts">
import http from './../http';
import { Component, Prop, Watch, Vue, Emit } from 'vue-property-decorator';
import { Project } from '../../models';

const Props = Vue.extend({
  props: ['projectId']
});

@Component({})
export default class SelectProject extends Props {
  projects: Project[] = [];

  created() {
    this.getProjects();
  }

  @Emit('projectId')
  onChange(e) {
    return e.target.value;
  }

  async getProjects() {
    const response = await http('/api/projects');
    const data = await response.json();

    this.projects = data;
  }
}
</script>
