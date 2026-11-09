<template>
  <AppCard title="New project" class="max-w-xl">
    <form class="space-y-4" @submit.prevent="create">
      <FormErrors :errors="errors" />
      <div>
        <label class="label" for="project-name">Name</label>
        <input
          id="project-name"
          v-model="form.name"
          type="text"
          class="input w-full"
        />
      </div>
      <div>
        <label class="label" for="project-client">Client</label>
        <select
          id="project-client"
          v-model="form.clientId"
          class="select w-full"
        >
          <option :value="null">No client</option>
          <option
            v-for="client in clientsStore.clients"
            :key="client.id"
            :value="client.id"
          >
            {{ client.name }}
          </option>
        </select>
      </div>
      <button type="submit" class="btn-primary">Create project</button>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
const store = useProjectsStore();
const clientsStore = useClientsStore();
await clientsStore.fetchClients();

const form = reactive<ProjectInput>({ name: '', clientId: null });
const errors = ref<string[]>([]);

async function create() {
  errors.value = validationMessages(projectSchema, form);
  if (errors.value.length) return;
  try {
    const project = await store.createProject(form);
    await navigateTo(`/projects/${project.slug}`);
  } catch (error) {
    errors.value = errorMessages(error);
  }
}
</script>
