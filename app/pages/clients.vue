<template>
  <div>
    <AppCard title="Clients">
      <ul class="divide-y">
        <li v-for="client in store.clients" :key="client.id" class="py-2">
          <ClientForm
            v-if="editingId === client.id"
            :client="client"
            submit-label="Save"
            cancellable
            :save="input => update(client.id, input)"
            @cancel="editingId = null"
          />
          <div v-else class="flex items-center gap-2">
            <div class="flex-1">
              <p class="font-semibold">{{ client.name }}</p>
              <p v-if="client.address" class="text-sm text-gray-600">
                {{ client.address.street }}, {{ client.address.postcode }}
                {{ client.address.city }}, {{ client.address.country }}
              </p>
            </div>
            <button
              type="button"
              class="btn-icon"
              title="Edit"
              @click="editingId = client.id"
            >
              <Icon name="fa6-solid:pen" />
            </button>
            <button
              type="button"
              class="btn-icon"
              title="Delete"
              @click="remove(client)"
            >
              <Icon name="fa6-solid:trash-can" />
            </button>
          </div>
        </li>
      </ul>
      <p v-if="!store.clients.length" class="text-gray-600">No clients yet.</p>
    </AppCard>

    <AppCard title="Add client">
      <ClientForm submit-label="Add" :save="store.createClient" />
    </AppCard>
  </div>
</template>

<script setup lang="ts">
const store = useClientsStore();
await store.fetchClients();

const editingId = ref<number | null>(null);

async function update(id: number, input: ClientInput) {
  await store.updateClient(id, input);
  editingId.value = null;
}

async function remove(client: ClientInfo) {
  if (!window.confirm(`Delete the client "${client.name}"?`)) return;
  try {
    await store.removeClient(client.id);
  } catch (error) {
    window.alert(errorMessages(error).join('\n'));
  }
}
</script>
