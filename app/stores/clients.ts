export const useClientsStore = defineStore('clients', () => {
  const clients = ref<ClientInfo[]>([]);

  async function fetchClients() {
    clients.value = await $fetch<ClientInfo[]>('/api/clients');
    return clients.value;
  }

  async function createClient(input: ClientInput) {
    await $fetch('/api/clients', { method: 'POST', body: input });
    await fetchClients();
  }

  async function updateClient(id: number, input: ClientInput) {
    await $fetch(`/api/clients/${id}`, { method: 'PUT', body: input });
    await fetchClients();
  }

  async function removeClient(id: number) {
    await $fetch(`/api/clients/${id}`, { method: 'DELETE' });
    await fetchClients();
  }

  return { clients, fetchClients, createClient, updateClient, removeClient };
});
