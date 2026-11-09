import { and, asc, eq, isNull } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);

  return useDb()
    .select(addressColumns)
    .from(t.addresses)
    .where(and(eq(t.addresses.userId, userId), isNull(t.addresses.clientId)))
    .orderBy(asc(t.addresses.id))
    .all();
});
