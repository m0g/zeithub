import { and, eq } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const id = getIdParam(event);

  assertNotUsedByInvoices(userId, t.invoices.bankAccountId, id, 'Bank account');

  const deleted = useDb()
    .delete(t.bankAccounts)
    .where(and(eq(t.bankAccounts.id, id), eq(t.bankAccounts.userId, userId)))
    .returning({ id: t.bankAccounts.id })
    .get();

  if (!deleted) throw notFound('Bank account not found');
  return sendNoContent(event);
});
