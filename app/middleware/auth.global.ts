const PUBLIC_PAGES = ['/', '/signin', '/signup'];
const GUEST_ONLY_PAGES = ['/signin', '/signup'];

export default defineNuxtRouteMiddleware(to => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value && !PUBLIC_PAGES.includes(to.path)) {
    return navigateTo({ path: '/signin', query: { redirect: to.fullPath } });
  }

  if (loggedIn.value && GUEST_ONLY_PAGES.includes(to.path)) {
    return navigateTo('/invoices');
  }
});
