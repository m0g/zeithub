<template>
  <AppCard title="Projects">
    <template #actions>
      <NuxtLink to="/projects/new" class="btn-primary">
        <Icon name="fa6-solid:plus" /> New project
      </NuxtLink>
    </template>
    <ul class="divide-y">
      <li v-for="project in store.projects" :key="project.id" class="py-2">
        <NuxtLink :to="`/projects/${project.slug}`" class="link">
          {{ project.name }}
        </NuxtLink>
        <span v-if="project.clientId" class="ml-2 text-sm text-gray-600">
          {{ clientName(project.clientId) }}
        </span>
      </li>
    </ul>
    <p v-if="!store.projects.length" class="text-gray-600">No projects yet.</p>
  </AppCard>
</template>

<script setup lang="ts">
const store = useProjectsStore();
const clientsStore = useClientsStore();
await Promise.all([store.fetchProjects(), clientsStore.fetchClients()]);

function clientName(id: number) {
  return clientsStore.clients.find(client => client.id === id)?.name;
}
</script>
