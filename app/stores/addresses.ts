export const useAddressesStore = defineStore('addresses', () => {
  const addresses = ref<Address[]>([]);

  async function fetchAddresses() {
    addresses.value = await $fetch<Address[]>('/api/addresses');
    return addresses.value;
  }

  async function createAddress(input: AddressInput) {
    await $fetch('/api/addresses', { method: 'POST', body: input });
    await fetchAddresses();
  }

  async function updateAddress(id: number, input: AddressInput) {
    await $fetch(`/api/addresses/${id}`, { method: 'PUT', body: input });
    await fetchAddresses();
  }

  async function removeAddress(id: number) {
    await $fetch(`/api/addresses/${id}`, { method: 'DELETE' });
    await fetchAddresses();
  }

  return {
    addresses,
    fetchAddresses,
    createAddress,
    updateAddress,
    removeAddress,
  };
});
