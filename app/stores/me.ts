export const useMeStore = defineStore('me', () => {
  const me = ref<Me | null>(null);

  async function fetchMe() {
    me.value = await $fetch<Me>('/api/me');
    return me.value;
  }

  async function updateMe(input: MeInput) {
    me.value = await $fetch<Me>('/api/me', { method: 'PUT', body: input });
  }

  async function changePassword(currentPassword: string, password: string) {
    await $fetch('/api/me/password', {
      method: 'PUT',
      body: { currentPassword, password },
    });
  }

  return { me, fetchMe, updateMe, changePassword };
});
