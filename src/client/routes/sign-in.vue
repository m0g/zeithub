<template>
  <div class="bg-white shadow m-4 ml-0 p-4 rounded-lg">
    <h2>Sign-in</h2>
    <form @submit="signIn" method="post">
      <FormErrors :errors="errors" />
      <div class="mt-4">
        <input
          type="text"
          class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
          placeholder="User name"
          v-model="username"
        />
      </div>
      <div class="mt-4">
        <input
          type="password"
          class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
          placeholder="Password"
          v-model="password"
        />
      </div>
      <div class="mt-4">
        <input
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring"
          value="Send"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import FormErrors from './../components/form-errors.vue';

export default defineComponent({
  data(): {
    errors: string[];
    username: string;
    password: string;
  } {
    return { errors: [], username: '', password: '' };
  },

  methods: {
    signIn(e) {
      e.preventDefault();

      this.errors = [];

      if (!this.username) {
        this.errors.push('Username is required');
      }

      if (!this.password) {
        this.errors.push('Password is required');
      }

      if (this.errors.length === 0) {
        const user = {
          username: this.username,
          password: this.password,
        };

        fetch('/api/sign/in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        })
          .then(response => response.json())
          .then(response => {
            if (response.success === true) {
              localStorage.setItem('token', response.token);
              window.location.href = '/';
            } else {
              this.errors.push(response.message);
            }
          });
      }
    },
  },
});
</script>
