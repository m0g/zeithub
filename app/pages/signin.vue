<template>
  <AppCard title="Sign in" class="max-w-md">
    <form @submit.prevent="signIn">
      <FormErrors :errors="errors" />
      <div class="mt-4">
        <label class="label" for="username">Username or email</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          class="input w-full"
          autocomplete="username"
          required
        />
      </div>
      <div class="mt-4">
        <label class="label" for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="input w-full"
          autocomplete="current-password"
          required
        />
      </div>
      <div class="mt-4 flex items-center gap-4">
        <button type="submit" class="btn-primary" :disabled="pending">
          Sign in
        </button>
        <NuxtLink to="/signup" class="link">Create an account</NuxtLink>
      </div>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
const route = useRoute();
const { fetch: refreshSession } = useUserSession();

const form = reactive({ username: '', password: '' });
const errors = ref<string[]>([]);
const pending = ref(false);

async function signIn() {
  errors.value = validationMessages(signInSchema, form);
  if (errors.value.length) return;

  pending.value = true;
  try {
    await $fetch('/api/auth/signin', { method: 'POST', body: form });
    await refreshSession();
    const redirect = route.query.redirect;
    await navigateTo(
      typeof redirect === 'string' && redirect.startsWith('/')
        ? redirect
        : '/invoices'
    );
  } catch (error) {
    errors.value = errorMessages(error);
  } finally {
    pending.value = false;
  }
}
</script>
