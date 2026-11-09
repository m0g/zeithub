import { asc, eq } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);

  return useDb()
    .select(bankAccountColumns)
    .from(t.bankAccounts)
    .where(eq(t.bankAccounts.userId, userId))
    .orderBy(asc(t.bankAccounts.id))
    .all();
});
