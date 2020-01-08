<template>
  <p>Signing you out...</p>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { signOut } from './../auth';

@Component({})
export default class SignOut extends Vue {
  created() {
    signOut();
    setTimeout(() => (window.location.href = '/'), 1000);
  }
}
</script>
