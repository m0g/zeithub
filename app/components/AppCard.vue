<template>
  <section class="mb-4 overflow-hidden rounded-lg bg-white shadow">
    <header
      v-if="title || $slots.actions"
      class="flex items-center gap-2 border-b bg-gray-700 p-4 text-white"
    >
      <h2 class="flex-1 text-lg font-semibold">{{ title }}</h2>
      <slot name="actions" />
    </header>
    <div :class="{ 'p-4': padded }">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string; padded?: boolean }>(), {
  title: undefined,
  padded: true,
});
</script>
