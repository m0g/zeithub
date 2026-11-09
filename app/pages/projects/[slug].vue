<template>
  <AppCard :title="project.name" class="max-w-xl">
    <template #actions>
      <button type="button" class="btn-danger bg-white" @click="remove">
        <Icon name="fa6-solid:trash-can" /> Delete
      </button>
    </template>
    <form class="space-y-4" @submit.prevent="save">
      <FormErrors :errors="errors" />
      <p v-if="saved" class="rounded bg-green-50 p-3 text-sm text-green-800">
        Saved.
      </p>
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
      <button type="submit" class="btn-primary">Save</button>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
const route = useRoute();
const store = useProjectsStore();
const clientsStore = useClientsStore();

const [loaded] = await Promise.all([
  store.fetchProject(String(route.params.slug)).catch(error => {
    throw createError({ statusCode: error?.statusCode ?? 404, fatal: true });
  }),
  clientsStore.fetchClients(),
]);
const project = reactive(loaded);

const form = reactive({ name: project.name, clientId: project.clientId });
const errors = ref<string[]>([]);
const saved = ref(false);

async function save() {
  saved.value = false;
  errors.value = validationMessages(projectSchema, form);
  if (errors.value.length) return;
  try {
    Object.assign(project, await store.updateProject(project.slug, form));
    saved.value = true;
  } catch (error) {
    errors.value = errorMessages(error);
  }
}

async function remove() {
  if (!window.confirm(`Delete the project "${project.name}"?`)) return;
  await store.removeProject(project.slug);
  await navigateTo('/projects');
}
</script>
