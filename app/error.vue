<template>
  <NuxtLayout>
    <AppCard
      :title="error.statusCode === 404 ? 'Not found' : 'Something went wrong'"
    >
      <p class="mb-4">
        {{
          error.statusCode === 404
            ? "This page doesn't exist, or you don't have access to it."
            : error.message
        }}
      </p>
      <button
        type="button"
        class="btn-primary"
        @click="clearError({ redirect: '/' })"
      >
        Back to home
      </button>
    </AppCard>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{ error: NuxtError }>();
</script>
