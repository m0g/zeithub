<template>
  <header
    class="fixed inset-x-0 top-0 z-10 bg-gray-200 md:inset-y-0 md:right-auto md:w-48"
  >
    <div class="flex items-center gap-2 p-4">
      <button
        type="button"
        class="btn-icon md:hidden"
        aria-label="Toggle the menu"
        @click="open = !open"
      >
        <Icon name="fa6-solid:bars" />
      </button>
      <div>
        <h1 class="text-lg font-semibold">
          <NuxtLink to="/">Zeithub</NuxtLink>
        </h1>
        <p class="text-xs text-gray-600">{{ version }}</p>
      </div>
    </div>

    <nav :class="[open ? 'block' : 'hidden', 'm-4 mt-0 md:block']">
      <ul class="space-y-1">
        <template v-if="loggedIn">
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-300"
              active-class="bg-gray-300 font-semibold"
              @click="open = false"
            >
              <Icon :name="link.icon" />
              <span>{{ link.label }}</span>
            </NuxtLink>
          </li>
          <li>
            <button
              type="button"
              class="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-300"
              @click="signOut"
            >
              <Icon name="fa6-solid:right-from-bracket" />
              <span>Sign out</span>
            </button>
          </li>
        </template>
        <template v-else>
          <li>
            <NuxtLink
              to="/signin"
              class="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-300"
            >
              <Icon name="fa6-solid:right-to-bracket" />
              <span>Sign in</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/signup"
              class="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-300"
            >
              <Icon name="fa6-solid:user-plus" />
              <span>Sign up</span>
            </NuxtLink>
          </li>
        </template>
      </ul>
    </nav>
  </header>
  <!-- Keeps the content below the fixed header on small screens. -->
  <div class="h-16 md:hidden" />
</template>

<script setup lang="ts">
const version = '0.6.0';
const open = ref(false);
const { loggedIn } = useUserSession();

const links = [
  { to: '/invoices', label: 'Invoices', icon: 'fa6-solid:file-invoice' },
  { to: '/clients', label: 'Clients', icon: 'fa6-solid:users' },
  { to: '/projects', label: 'Projects', icon: 'fa6-solid:folder' },
  { to: '/me', label: 'Profile', icon: 'fa6-solid:circle-user' },
];

async function signOut() {
  await $fetch('/api/auth/signout', { method: 'POST' });
  // Full reload so no data from this user stays in memory.
  reloadNuxtApp({ path: '/signin' });
}
</script>
