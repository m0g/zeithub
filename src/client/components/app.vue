<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    <router-link to="/projects">Projects</router-link>
    <router-link to="/users/new">Create user</router-link>
    <router-link to="/signin">Sign-in</router-link>
    <router-view></router-view>
  </div>
</template>
<style>
  html, body {
    font-family: arial;
  }
</style>
