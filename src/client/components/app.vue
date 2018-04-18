<template>
  <div id="app">
    <header>
      <router-link id="app-name" to="/">Konta</router-link>
      <router-link to="/projects" v-if="isLoggedIn">Projects</router-link>
      <router-link to="/users/new">Create user</router-link>
      <router-link to="/signin" v-if="!isLoggedIn">Sign-in</router-link>
      <router-link to="/signup" v-if="!isLoggedIn">Sign-up</router-link>
      <router-link to="/signout" v-if="isLoggedIn">Sign-out</router-link>
    </header>
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

  #app-name {
    color: red;
  }

  header {
    margin-bottom: 10px;
  }

  header a {
    color: #333;
    text-decoration: none;
    margin: 0 5px;
  }
</style>
