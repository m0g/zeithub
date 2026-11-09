import type { H3Event } from 'h3';

// Returns the signed-in user's id, or throws 401. Every query must be scoped
// with this id.
export async function requireUser(event: H3Event) {
  const { user } = await requireUserSession(event);
  return user.id;
}
