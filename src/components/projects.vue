<template>
  <ul>
    <li v-for="project in projects">{{project.name}}</li>
  </ul>
</template>

<script>
  export default {
    data() {
      return { projects: [] };
    },

    created() {
      fetch('/api/projects')
        .then(data => data.json())
        .then(projects => {
          this.projects = projects;
        });
    }
  }
</script>
