<template>
  <div id="app" class="flex">
    <sidebar></sidebar>
    <router-view id="router-view" class="flex-1"></router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { isLoggedIn, signOut } from './../auth';
import http from './../http';
import Sidebar from './sidebar.vue';
import pkg from './../../../package.json';

@Component({ components: { Sidebar } })
export default class App extends Vue {}
</script>
