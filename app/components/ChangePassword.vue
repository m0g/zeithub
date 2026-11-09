<template>
  <AppCard title="Change password">
    <form class="max-w-md space-y-2" @submit.prevent="submit">
      <FormErrors :errors="errors" />
      <p v-if="done" class="rounded bg-green-50 p-3 text-sm text-green-800">
        Password changed.
      </p>
      <label class="label" for="current-password">Current password</label>
      <input
        id="current-password"
        v-model="form.currentPassword"
        type="password"
        class="input w-full"
        autocomplete="current-password"
      />
      <label class="label" for="new-password">New password</label>
      <input
        id="new-password"
        v-model="form.password"
        type="password"
        class="input w-full"
        autocomplete="new-password"
      />
      <label class="label" for="new-password-repeat">Repeat new password</label>
      <input
        id="new-password-repeat"
        v-model="passwordRepeat"
        type="password"
        class="input w-full"
        autocomplete="new-password"
      />
      <button type="submit" class="btn-primary">Change password</button>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
const store = useMeStore();

const form = reactive({ currentPassword: '', password: '' });
const passwordRepeat = ref('');
const errors = ref<string[]>([]);
const done = ref(false);

async function submit() {
  done.value = false;
  errors.value = validationMessages(passwordSchema, form);
  if (form.password !== passwordRepeat.value) {
    errors.value.push("New passwords don't match");
  }
  if (errors.value.length) return;

  try {
    await store.changePassword(form.currentPassword, form.password);
    form.currentPassword = '';
    form.password = '';
    passwordRepeat.value = '';
    done.value = true;
  } catch (error) {
    errors.value = errorMessages(error);
  }
}
</script>
