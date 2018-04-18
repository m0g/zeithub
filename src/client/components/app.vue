<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/projects" v-if="isLoggedIn">Projects</router-link>
    <router-link to="/users/new">Create user</router-link>
    <router-link to="/signin" v-if="!isLoggedIn">Sign-in</router-link>
    <router-link to="/signout" v-if="isLoggedIn">Sign-out</router-link>
    <router-view></router-view>
  </div>
</template>
<script>
  import { isLoggedIn } from './../auth';

  export default {
    data() {
      return { isLoggedIn: isLoggedIn()}
    }
  };
</script>
<style>
  html, body {
    font-family: arial;
  }
</style>
