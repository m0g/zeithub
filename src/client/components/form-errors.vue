<template>
  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </p>
</template>

<script>
export default {
  props: ['errors']
}
</script>
<style scoped>
li { color: red; }
</style>
