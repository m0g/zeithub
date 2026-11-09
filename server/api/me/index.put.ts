import { and, eq, ne } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const body = await readBodyAs(event, meSchema);
  const db = useDb();

  const emailTaken = db
    .select({ id: t.users.id })
    .from(t.users)
    .where(and(eq(t.users.email, body.email), ne(t.users.id, userId)))
    .get();

  if (emailTaken) {
    throw createError({ statusCode: 409, statusMessage: 'Email already used' });
  }

  return db
    .update(t.users)
    .set(body)
    .where(eq(t.users.id, userId))
    .returning(meColumns)
    .get();
});
