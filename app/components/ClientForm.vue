<template>
  <form class="space-y-2" @submit.prevent="submit">
    <FormErrors :errors="errors" />
    <div class="grid gap-2 sm:grid-cols-3">
      <input v-model="form.name" type="text" class="input" placeholder="Name" />
      <input
        v-model="form.taxNumber"
        type="text"
        class="input"
        placeholder="Tax number"
      />
      <input
        v-model="form.vatNumber"
        type="text"
        class="input"
        placeholder="VAT number"
      />
    </div>
    <AddressFields v-model="form" />
    <div class="flex gap-2">
      <button type="submit" class="btn-primary">{{ submitLabel }}</button>
      <button
        v-if="cancellable"
        type="button"
        class="btn"
        @click="emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  client?: ClientInfo;
  submitLabel: string;
  cancellable?: boolean;
  save: (input: ClientInput) => Promise<unknown>;
}>();
const emit = defineEmits<{ cancel: [] }>();

const initial = (): ClientInput & { extra: string | null } => ({
  name: props.client?.name ?? '',
  taxNumber: props.client?.taxNumber ?? null,
  vatNumber: props.client?.vatNumber ?? null,
  extra: props.client?.address?.extra ?? null,
  street: props.client?.address?.street ?? '',
  postcode: props.client?.address?.postcode ?? '',
  city: props.client?.address?.city ?? '',
  country: props.client?.address?.country ?? '',
});

const form = ref(initial());
const errors = ref<string[]>([]);

async function submit() {
  errors.value = validationMessages(clientSchema, form.value);
  if (errors.value.length) return;
  try {
    await props.save(form.value);
    if (!props.client) form.value = initial();
  } catch (error) {
    errors.value = errorMessages(error);
  }
}
</script>
