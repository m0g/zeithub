import { eq } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);

  const me = useDb()
    .select(meColumns)
    .from(t.users)
    .where(eq(t.users.id, userId))
    .get();

  if (!me) throw notFound('User not found');
  return me;
});
