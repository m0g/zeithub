<template>
  <AppCard title="Sign up" class="max-w-md">
    <form @submit.prevent="signUp">
      <FormErrors :errors="errors" />
      <div class="mt-4">
        <label class="label" for="username">Username</label>
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
        <label class="label" for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="input w-full"
          autocomplete="email"
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
          autocomplete="new-password"
          required
        />
      </div>
      <div class="mt-4">
        <label class="label" for="password-repeat">Repeat password</label>
        <input
          id="password-repeat"
          v-model="passwordRepeat"
          type="password"
          class="input w-full"
          autocomplete="new-password"
          required
        />
      </div>
      <div class="mt-4">
        <button type="submit" class="btn-primary" :disabled="pending">
          Create account
        </button>
      </div>
    </form>
    <p class="mt-6 text-sm text-gray-600">How to write a password:</p>
    <a href="https://xkcd.com/936/" target="_blank" rel="noopener">
      <img
        src="https://imgs.xkcd.com/comics/password_strength.png"
        alt="xkcd: Password Strength"
        class="mt-2 max-w-full"
      />
    </a>
  </AppCard>
</template>

<script setup lang="ts">
const { fetch: refreshSession } = useUserSession();

const form = reactive({ username: '', email: '', password: '' });
const passwordRepeat = ref('');
const errors = ref<string[]>([]);
const pending = ref(false);

async function signUp() {
  errors.value = validationMessages(signUpSchema, form);
  if (form.password !== passwordRepeat.value) {
    errors.value.push("Passwords don't match");
  }
  if (errors.value.length) return;

  pending.value = true;
  try {
    await $fetch('/api/auth/signup', { method: 'POST', body: form });
    await refreshSession();
    await navigateTo('/me');
  } catch (error) {
    errors.value = errorMessages(error);
  } finally {
    pending.value = false;
  }
}
</script>
