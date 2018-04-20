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

<script>
  import http from './../http';

  export default {
    data() {
      return { projects: [] };
    },

    created() {
      http('/api/projects')
        .then(data => data.json())
        .then(projects => {
          this.projects = projects;
        });
    }
  }
</script>
