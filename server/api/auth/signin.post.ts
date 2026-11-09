import { eq, or } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const { username, password } = await readBodyAs(event, signInSchema);

  const user = useDb()
    .select({ id: t.users.id, name: t.users.name, password: t.users.password })
    .from(t.users)
    .where(or(eq(t.users.name, username), eq(t.users.email, username)))
    .get();

  if (!user || !(await checkPassword(user.id, user.password, password))) {
    throw createError({ statusCode: 401, statusMessage: 'Wrong credentials' });
  }

  const sessionUser = { id: user.id, name: user.name };
  await replaceUserSession(event, { user: sessionUser });
  return sessionUser;
});
