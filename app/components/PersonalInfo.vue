<template>
  <AppCard title="Personal information">
    <template #actions>
      <button
        v-if="!editing"
        type="button"
        class="btn-icon text-white hover:text-gray-900"
        title="Edit"
        @click="startEdit"
      >
        <Icon name="fa6-solid:pen" />
      </button>
    </template>

    <dl v-if="!editing && me" class="grid grid-cols-[10rem_1fr] gap-y-1">
      <dt class="font-semibold">Username</dt>
      <dd>{{ me.name }}</dd>
      <template v-for="field in fields" :key="field.key">
        <dt class="font-semibold">{{ field.label }}</dt>
        <dd>
          <a
            v-if="field.key === 'website' && me.website"
            :href="me.website"
            target="_blank"
            rel="noopener"
            class="link"
            >{{ me.website }}</a
          >
          <span v-else>{{ me[field.key] }}</span>
        </dd>
      </template>
    </dl>

    <form v-if="editing" class="space-y-2" @submit.prevent="save">
      <FormErrors :errors="errors" />
      <div
        v-for="field in fields"
        :key="field.key"
        class="grid items-center gap-2 sm:grid-cols-[10rem_1fr]"
      >
        <label class="font-semibold" :for="`me-${field.key}`">
          {{ field.label }}
        </label>
        <input
          :id="`me-${field.key}`"
          v-model="form[field.key]"
          :type="field.key === 'email' ? 'email' : 'text'"
          class="input"
        />
      </div>
      <div class="flex gap-2">
        <button type="submit" class="btn-primary">Save</button>
        <button type="button" class="btn" @click="editing = false">
          Cancel
        </button>
      </div>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
const store = useMeStore();
const me = computed(() => store.me);

const fields = [
  { key: 'email', label: 'Email' },
  { key: 'firstName', label: 'First name' },
  { key: 'lastName', label: 'Last name' },
  { key: 'tel', label: 'Telephone' },
  { key: 'website', label: 'Website' },
  { key: 'taxNumber', label: 'Tax number' },
  { key: 'vatNumber', label: 'VAT number' },
] as const;

type Field = (typeof fields)[number]['key'];

const editing = ref(false);
const errors = ref<string[]>([]);
const form = reactive({} as Record<Field, string | null>);

function startEdit() {
  for (const { key } of fields) {
    form[key] = me.value?.[key] ?? '';
  }
  errors.value = [];
  editing.value = true;
}

async function save() {
  errors.value = validationMessages(meSchema, form);
  if (errors.value.length) return;
  try {
    await store.updateMe(form as MeInput);
    editing.value = false;
  } catch (error) {
    errors.value = errorMessages(error);
  }
}
</script>
