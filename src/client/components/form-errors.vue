<template>
  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </p>
</template>

<script lang="ts" setup>
const props = defineProps(['erros']);
</script>


<style scoped>
li {
  color: red;
}
</style>
