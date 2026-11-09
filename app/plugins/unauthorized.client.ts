// When the session expires, any API call answers 401: refresh the session
// state and send the user to the sign-in page.
export default defineNuxtPlugin(() => {
  const session = useUserSession();
  const router = useRouter();

  globalThis.$fetch = globalThis.$fetch.create({
    async onResponseError({ request, response }) {
      const url = typeof request === 'string' ? request : request.url;
      if (response.status !== 401 || url.includes('/api/auth/')) return;

      await session.fetch();
      const current = router.currentRoute.value;
      if (current.path !== '/signin') {
        await navigateTo({
          path: '/signin',
          query: { redirect: current.fullPath },
        });
      }
    },
  }) as typeof globalThis.$fetch;
});
