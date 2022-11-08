<template>
  <p>Signing you out...</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { signOut } from './../auth';

export default defineComponent({
  created() {
    signOut();
    setTimeout(() => (window.location.href = '/'), 1000);
  },
});
</script>
