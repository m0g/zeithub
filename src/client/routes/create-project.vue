<template>
  <fieldset>
    <legend>Create project</legend>
    <form @submit="sendForm" method="post">
      <FormErrors :errors="errors" />
      <p>
        <input type="text" placeholder="Name" v-model="name" />
      </p>
      <p><input type="submit" value="Send" /></p>
    </form>
  </fieldset>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { Route, useRoute, useRouter } from 'vue-router';
import http from '../http';
import FormErrors from '../components/form-errors.vue';

export default defineComponent({
  data() {
    const val: {
      errors: string[];
      name: string;
    } = {
      errors: [],
      name: '',
    };
    return val;
  },
  methods: {
    sendForm(e) {
      const router = useRouter();
      this.errors = [];
      e.preventDefault();
      if (!this.name) {
        this.errors.push('Name is required');
      }
      if (this.errors.length === 0) {
        http('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.name }),
        })
          .then(response => response.json())
          .then(response => {
            console.log(response);
            if (response.success === true) {
              router.push(`/projects`);
            }
          });
      }
    },
  },
  components: { FormErrors },
});
</script>
