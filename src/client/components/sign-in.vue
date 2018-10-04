<template>
  <fieldset>
    <legend>Sign-in</legend>
    <form @submit="signIn" method="post">
      <form-errors :errors="errors"></form-errors>
      <p>
        <input
          type="text"
          placeholder="User name"
          v-model="username" />
      </p>
      <p>
        <input
          type="password"
          placeholder="Password"
          v-model="password" />
      </p>
      <p><input type="submit" value="Send" /></p>
    </form>
  </fieldset>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';
import FormErrors from './form-errors.vue';

@Component({
  components: { FormErrors }
})
export default class SignIn extends Vue {
  errors: string[] = [];
  username: string = '';
  password: string = '';

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
        password: this.password
      };

      fetch('/api/sign/in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
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
  }
}
</script>
