export function requireAuth(to, from, next) {
  if (!isLoggedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
}

export function requireUnauth(to, from, next) {
  if (isLoggedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
}

export function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

export function signOut() {
  return localStorage.removeItem('token');
}