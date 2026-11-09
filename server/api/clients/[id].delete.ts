import { and, eq } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const id = getIdParam(event);

  assertNotUsedByInvoices(userId, t.invoices.clientId, id, 'Client');

  // The client's address goes with it (ON DELETE CASCADE).
  const deleted = useDb()
    .delete(t.clients)
    .where(and(eq(t.clients.id, id), eq(t.clients.userId, userId)))
    .returning({ id: t.clients.id })
    .get();

  if (!deleted) throw notFound('Client not found');
  return sendNoContent(event);
});
