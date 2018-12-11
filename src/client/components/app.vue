<template>
  <div id="app">
    <header>
      <router-link id="app-name" to="/">Konta</router-link>
      <router-link to="/time" v-if="isLoggedIn">Time Tracking</router-link>
      <router-link to="/projects" v-if="isLoggedIn">Projects</router-link>
      <router-link to="/clients" v-if="isLoggedIn">Clients</router-link>
      <router-link to="/expenses" v-if="isLoggedIn">Expenses</router-link>
      <router-link to="/invoices" v-if="isLoggedIn">Invoices</router-link>
      <router-link to="/me" v-if="isLoggedIn">Profile</router-link>
      <router-link to="/signin" v-if="!isLoggedIn">Sign-in</router-link>
      <router-link to="/signup" v-if="!isLoggedIn">Sign-up</router-link>
      <router-link to="/signout" v-if="isLoggedIn">Sign-out</router-link>
    </header>
    <router-view id="router-view"></router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { isLoggedIn, signOut } from './../auth';
import http from './../http';

@Component({})
export default class App extends Vue {
  isLoggedIn: Boolean = isLoggedIn();

  created() {
    http('/api/me')
      .then(data => data.json())
      .then(data => {
        if (data.auth === false && isLoggedIn()) {
          signOut();
          setTimeout(() => (window.location.href = '/'), 1000);
        }
      });
  }
}
</script>

<style>
html,
body,
#app {
  font-family: arial;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app-name {
  color: #ff7979;
}

header {
  margin-bottom: 0;
  padding: 10px 15px;
  border-bottom: 1px dotted black;
}

header a {
  color: black;
  margin: 0 5px;
}

.router-link-exact-active {
  color: white;
  background: black;
}

#router-view {
  margin: 0;
  padding: 0;
}

h3 {
  margin-top: 0;
}

a {
  color: black;
}

@media only screen and (max-width: 480px) {
  /* header a:not(#app-name) {
    display: none;
  } */
}
</style>
