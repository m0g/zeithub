import { and, eq } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const id = getIdParam(event);

  // Items go with it (ON DELETE CASCADE).
  const deleted = useDb()
    .delete(t.invoices)
    .where(and(eq(t.invoices.id, id), eq(t.invoices.userId, userId)))
    .returning({ id: t.invoices.id })
    .get();

  if (!deleted) throw notFound('Invoice not found');
  return sendNoContent(event);
});
