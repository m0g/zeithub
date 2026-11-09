<template>
  <AppCard title="Zeithub">
    <p class="mb-4">Time tracking, invoicing and expenses for freelancers.</p>
    <div v-if="loggedIn" class="flex flex-wrap gap-2">
      <NuxtLink to="/invoices/new" class="btn-primary">
        <Icon name="fa6-solid:plus" /> New invoice
      </NuxtLink>
      <NuxtLink to="/invoices" class="btn">Invoices</NuxtLink>
      <NuxtLink to="/clients" class="btn">Clients</NuxtLink>
    </div>
    <div v-else class="flex flex-wrap gap-2">
      <NuxtLink to="/signin" class="btn-primary">Sign in</NuxtLink>
      <NuxtLink to="/signup" class="btn">Create an account</NuxtLink>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession();
</script>
