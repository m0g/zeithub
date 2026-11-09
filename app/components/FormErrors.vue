<template>
  <div
    v-if="errors.length"
    class="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm"
    role="alert"
  >
    <p class="font-semibold">Please correct the following error(s):</p>
    <ul class="mt-1 list-inside list-disc text-red-700">
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{ errors: string[] }>();
</script>
