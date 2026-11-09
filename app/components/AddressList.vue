<template>
  <AppCard title="Addresses">
    <ul class="divide-y">
      <li v-for="address in store.addresses" :key="address.id" class="py-2">
        <form
          v-if="editingId === address.id"
          class="space-y-2"
          @submit.prevent="save(address.id)"
        >
          <FormErrors :errors="errors" />
          <AddressFields v-model="edit" with-name />
          <div class="flex gap-2">
            <button type="submit" class="btn-primary">Save</button>
            <button type="button" class="btn" @click="editingId = null">
              Cancel
            </button>
          </div>
        </form>
        <div v-else class="flex items-center gap-2">
          <p class="flex-1">
            <b>{{ address.name }}</b>
            <span v-if="address.extra">{{ address.extra }}, </span>
            {{ address.street }}, {{ address.postcode }} {{ address.city }},
            {{ address.country }}
          </p>
          <button
            type="button"
            class="btn-icon"
            title="Edit"
            @click="startEdit(address)"
          >
            <Icon name="fa6-solid:pen" />
          </button>
          <button
            type="button"
            class="btn-icon"
            title="Delete"
            @click="remove(address)"
          >
            <Icon name="fa6-solid:trash-can" />
          </button>
        </div>
      </li>
    </ul>
    <p v-if="!store.addresses.length" class="text-gray-600">
      Add the address you want printed on your invoices.
    </p>

    <form class="mt-4 space-y-2 border-t pt-4" @submit.prevent="create">
      <h3 class="font-semibold">Add an address</h3>
      <FormErrors :errors="createErrors" />
      <AddressFields v-model="draft" with-name />
      <button type="submit" class="btn-primary">Add</button>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
const store = useAddressesStore();
await store.fetchAddresses();

const emptyAddress = () => ({
  name: '',
  extra: null,
  street: '',
  postcode: '',
  city: '',
  country: '',
});

const draft = ref<AddressInput>(emptyAddress());
const createErrors = ref<string[]>([]);
const edit = ref<AddressInput>(emptyAddress());
const editingId = ref<number | null>(null);
const errors = ref<string[]>([]);

async function create() {
  createErrors.value = validationMessages(addressSchema, draft.value);
  if (createErrors.value.length) return;
  try {
    await store.createAddress(draft.value);
    draft.value = emptyAddress();
  } catch (error) {
    createErrors.value = errorMessages(error);
  }
}

function startEdit(address: Address) {
  const { id: _id, ...fields } = address;
  edit.value = { ...fields };
  errors.value = [];
  editingId.value = address.id;
}

async function save(id: number) {
  errors.value = validationMessages(addressSchema, edit.value);
  if (errors.value.length) return;
  try {
    await store.updateAddress(id, edit.value);
    editingId.value = null;
  } catch (error) {
    errors.value = errorMessages(error);
  }
}

async function remove(address: Address) {
  if (!window.confirm(`Delete the address "${address.name}"?`)) return;
  try {
    await store.removeAddress(address.id);
  } catch (error) {
    window.alert(errorMessages(error).join('\n'));
  }
}
</script>
