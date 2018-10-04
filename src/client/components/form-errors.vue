<template>
  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </p>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: ['errors']
});
</script>


<style scoped>
li {
  color: red;
}
</style>
