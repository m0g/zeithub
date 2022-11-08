<template>
  <header class="md:flex-none md:w-48 fixed bg-gray-200">
    <div class="pt-4 pl-4 pr-4">
      <div class="flex flex-row">
        <button
          type="button"
          id="sidebar-open"
          aria-label="Open the sidebar"
          class="flex mr-2 px-2 items-center lg:hidden text-black focus:outline-none focus:text-gray-700"
        >
          <svg
            class="fill-current w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </button>
        <div>
          <h1 class="font-semibold text-lg">
            <router-link id="app-name" to="/" class="flex">
              {{ name }}
            </router-link>
          </h1>
          <p class="text-gray-600 text-xs">{{ version }}</p>
        </div>
      </div>
    </div>
    <ul class="hidden list-reset m-4 md:block">
      <li>
        <router-link to="/projects" v-if="isLoggedIn">
          <font-awesome-icon icon="folder" />
          <span>Projects</span>
        </router-link>
      </li>
      <li>
        <router-link to="/clients" v-if="isLoggedIn">
          <font-awesome-icon icon="users" />
          <span>Clients</span>
        </router-link>
      </li>
      <li>
        <router-link to="/invoices" v-if="isLoggedIn">
          <font-awesome-icon icon="file-invoice" />
          <span>Invoices</span>
        </router-link>
      </li>
      <li>
        <router-link to="/me" v-if="isLoggedIn">
          <font-awesome-icon icon="user-circle" />
          <span>Profile</span>
        </router-link>
      </li>
      <li>
        <router-link to="/signin" v-if="!isLoggedIn">
          <font-awesome-icon icon="sign-in-alt" />
          <span>Sign-in</span>
        </router-link>
      </li>
      <li>
        <router-link to="/signup" v-if="!isLoggedIn">Sign-up</router-link>
      </li>
      <li>
        <router-link to="/signout" v-if="isLoggedIn">
          <font-awesome-icon icon="sign-out-alt" />
          <span>Sign-out</span>
        </router-link>
      </li>
    </ul>
  </header>
</template>

<script lang="ts">
import { isLoggedIn, signOut } from './../auth';
import http from './../http';
import pkg from './../../../package.json';

const name: string = pkg.name;
const version: string = pkg.version;

export default {
  created() {
    http('/api/me')
      .then(data => data.json())
      .then(data => {
        if (data.auth === false && isLoggedIn()) {
          signOut();
          setTimeout(() => (window.location.href = '/'), 1000);
        }
      });
  },
};
</script>
