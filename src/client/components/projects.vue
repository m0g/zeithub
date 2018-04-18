<template>
  <ul>
    <li v-for="project in projects">{{project.name}}</li>
  </ul>
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
