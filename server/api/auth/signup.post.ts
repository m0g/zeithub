import { eq, or } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const { username, email, password } = await readBodyAs(event, signUpSchema);
  const db = useDb();

  const existing = db
    .select({ id: t.users.id })
    .from(t.users)
    .where(or(eq(t.users.name, username), eq(t.users.email, email)))
    .get();

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'User already exists',
    });
  }

  const user = db
    .insert(t.users)
    .values({ name: username, email, password: await hashPassword(password) })
    .returning({ id: t.users.id, name: t.users.name })
    .get();

  await setUserSession(event, { user });
  setResponseStatus(event, 201);
  return user;
});
