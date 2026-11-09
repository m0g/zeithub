import { and, eq, isNull } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const id = getIdParam(event);
  const db = useDb();

  assertNotUsedByInvoices(userId, t.invoices.userAddressId, id, 'Address');

  const deleted = db
    .delete(t.addresses)
    .where(
      and(
        eq(t.addresses.id, id),
        eq(t.addresses.userId, userId),
        isNull(t.addresses.clientId)
      )
    )
    .returning({ id: t.addresses.id })
    .get();

  if (!deleted) throw notFound('Address not found');
  return sendNoContent(event);
});
