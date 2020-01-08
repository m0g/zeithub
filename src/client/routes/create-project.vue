<template>
  <fieldset>
    <legend>Create project</legend>
    <form @submit="sendForm" method="post">
      <form-errors :errors="errors"></form-errors>
      <p>
        <input type="text" placeholder="Name" v-model="name" />
      </p>
      <p><input type="submit" value="Send" /></p>
    </form>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import FormErrors from './../components/form-errors.vue';

@Component({
  components: { FormErrors }
})
export default class CreateProject extends Vue {
  errors: string[] = [];
  name: string = '';

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
</script>
