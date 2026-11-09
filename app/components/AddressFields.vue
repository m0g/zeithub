<template>
  <div class="grid gap-2 sm:grid-cols-2">
    <input
      v-if="withName"
      v-model="model.name"
      type="text"
      class="input"
      placeholder="Name (e.g. Home, Office)"
    />
    <input
      v-model="model.extra"
      type="text"
      class="input"
      placeholder="Extra (c/o...)"
    />
    <input
      v-model="model.street"
      type="text"
      class="input"
      placeholder="Street"
    />
    <input
      v-model="model.postcode"
      type="text"
      class="input"
      placeholder="Postcode"
    />
    <input v-model="model.city" type="text" class="input" placeholder="City" />
    <input
      v-model="model.country"
      type="text"
      class="input"
      placeholder="Country"
    />
  </div>
</template>

<script setup lang="ts">
export interface AddressFormValue {
  name?: string;
  extra?: string | null;
  street: string;
  postcode: string;
  city: string;
  country: string;
}

defineProps<{ withName?: boolean }>();
const model = defineModel<AddressFormValue>({ required: true });
</script>
