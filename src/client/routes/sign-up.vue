<template>
  <div class="bg-white shadow m-4 ml-0 p-4 rounded-lg">
    <h2>Sign up</h2>
    <form @submit="signUp" method="post">
      <form-errors :errors="errors"></form-errors>
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
          type="text"
          class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
          placeholder="Email"
          v-model="email"
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
          type="password"
          class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
          placeholder="Repeat password"
          v-model="passwordRepeat"
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
    <p>How to write a password:</p>
    <a href="https://xkcd.com/936/" target="_blank">
      <img src="https://imgs.xkcd.com/comics/password_strength.png" />
    </a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import http from '../http';
import Component from 'vue-class-component';
import FormErrors from './../components/form-errors.vue';

@Component({
  components: { FormErrors },
})
export default class SignUp extends Vue {
  errors: string[] = [];
  email: string = '';
  username: string = '';
  password: string = '';
  passwordRepeat: string = '';

  async signUp(e) {
    this.errors = [];
    e.preventDefault();

    if (!this.username) {
      this.errors.push('Username is required');
    }

    if (!this.email) {
      this.errors.push('Email is required');
    }

    if (!this.password || !this.passwordRepeat) {
      this.errors.push('Password is required');
    } else if (this.password !== this.passwordRepeat) {
      this.errors.push("Passwords don't match");
    }

    if (this.errors.length === 0) {
      const user = {
        username: this.username,
        password: this.password,
        email: this.email,
      };

      const response = await http('/api/sign/up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (data.success === true) {
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      }
    }
  }
}
</script>
