<template>
  <header class="flex-none w-48 fixed">
    <div class="pt-4 pl-4 pr-4">
      <h1 class="font-semibold text-lg">
        <router-link id="app-name" to="/">
          {{ name }}
        </router-link>
      </h1>
      <p class="text-gray-600 text-xs">{{ version }}</p>
    </div>
    <ul class="list-reset m-4">
      <li>
        <router-link to="/time" v-if="isLoggedIn">Time Tracking</router-link>
      </li>
      <li>
        <router-link to="/projects" v-if="isLoggedIn">Projects</router-link>
      </li>
      <li>
        <router-link to="/clients" v-if="isLoggedIn">Clients</router-link>
      </li>
      <li>
        <router-link to="/expenses" v-if="isLoggedIn">Expenses</router-link>
      </li>
      <li>
        <router-link to="/invoices" v-if="isLoggedIn">Invoices</router-link>
      </li>
      <li>
        <router-link to="/me" v-if="isLoggedIn">Profile</router-link>
      </li>
      <li>
        <router-link to="/signin" v-if="!isLoggedIn">Sign-in</router-link>
      </li>
      <li>
        <router-link to="/signup" v-if="!isLoggedIn">Sign-up</router-link>
      </li>
      <li>
        <router-link to="/signout" v-if="isLoggedIn">Sign-out</router-link>
      </li>
    </ul>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { isLoggedIn, signOut } from './../auth';
import http from './../http';
import pkg from './../../../package.json';

@Component({})
export default class Sidebar extends Vue {
  isLoggedIn: Boolean = isLoggedIn();
  name: string = pkg.name;
  version: string = pkg.version;

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
