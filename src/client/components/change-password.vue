<template>
  <div class="bg-white shadow m-4 ml-0 p-4 rounded-lg">
    <h2>Change password</h2>
    <form method="POST" @submit="changePassword">
      <FormErrors :errors="errors" />
      <p>
        <b>Current password:</b>
        <input type="password" v-model="currentPassword" />
      </p>
      <p><b>New password:</b> <input type="password" v-model="password" /></p>
      <p>
        <b>New password repeat:</b>&nbsp;
        <input type="password" v-model="passwordRepeat" />
      </p>
      <p><input type="submit" value="Change" /></p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import FormErrors from './form-errors.vue';

export default defineComponent({
  data(): {
    errors: string[];
    currentPassword: string;
    password: string;
    passwordRepeat: string;
  } {
    return {
      errors: [],
      currentPassword: '',
      password: '',
      passwordRepeat: '',
    };
  },
  methods: {
    changePassword(e) {
      this.errors = [];
      e.preventDefault();

      if (!this.currentPassword) {
        this.errors.push('Current password is missing');
      }

      if (!this.password || !this.passwordRepeat) {
        this.errors.push('New password is required');
      } else if (this.password !== this.passwordRepeat) {
        this.errors.push("New Passwords don't match");
      }

      if (this.errors.length === 0) {
        const body = {
          currentPassword: this.currentPassword,
          password: this.password,
        };

        http('/api/me/passwd', {
          method: 'PUT',
          body: JSON.stringify(body),
        })
          .then(response => response.json())
          .then(response => {
            if (response.success) {
              this.currentPassword = '';
              this.password = '';
              this.passwordRepeat = '';
            }
          });
      }
    },
  },
});
</script>
