<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Login form</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form @submit="signIn" method="post">
        <v-text-field
          label="Login"
          name="login"
          prepend-icon="mdi-account"
          type="text"
          v-model="username"
        />

        <v-text-field
          id="password"
          label="Password"
          name="password"
          prepend-icon="mdi-lock"
          type="password"
          v-model="password"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="signIn">Login</v-btn>
    </v-card-actions>
  </v-card>
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

<style>
a {
  text-decoration: none;
}
</style>
