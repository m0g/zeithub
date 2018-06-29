<template>
  <p>Signing you out...</p>
</template>
<script>
import { signOut } from './../auth';

export default {
  created() {
    signOut();
    setTimeout(() => (window.location.href = '/'), 1000);
  }
};
</script>
