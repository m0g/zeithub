<template>
<fieldset>
  <legend>Create project</legend>
  <form @submit="sendForm" method="post">
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>
    <p>
      <input
        type="text"
        placeholder="Name"
        v-model="name" />
    </p>
    <p><input type="submit" value="Send" /></p>
  </form>
</fieldset>
</template>

<script>
import http from './../http';

export default {
  data() {
    return {
      name: '',
      errors: [],
    }
  },

  methods: {
    sendForm(e) {
      this.errors = [];
      e.preventDefault();

      if (!this.name) {
        this.errors.push('Name is required');
      }

      if (this.errors.length === 0) {
        http('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.name })
        })
          .then(response => response.json())
          .then(response => {
            console.log(response);
            if (response.success === true) {
              this.$router.push(`/projects`);
            }
          });
      }
    }
  }
}
</script>
