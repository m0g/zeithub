import { asc } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  await requireUser(event);
  return useDb()
    .select()
    .from(t.currencies)
    .orderBy(asc(t.currencies.code))
    .all();
});
