import { eq } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const { currentPassword, password } = await readBodyAs(event, passwordSchema);
  const db = useDb();

  const user = db
    .select({ password: t.users.password })
    .from(t.users)
    .where(eq(t.users.id, userId))
    .get();

  if (!user) throw notFound('User not found');

  if (!(await checkPassword(userId, user.password, currentPassword))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Current password is wrong',
    });
  }

  db.update(t.users)
    .set({ password: await hashPassword(password) })
    .where(eq(t.users.id, userId))
    .run();

  return { ok: true };
});
