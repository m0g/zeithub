import { and, eq, isNull } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const id = getIdParam(event);
  const body = await readBodyAs(event, addressSchema);

  const address = useDb()
    .update(t.addresses)
    .set(body)
    .where(
      and(
        eq(t.addresses.id, id),
        eq(t.addresses.userId, userId),
        isNull(t.addresses.clientId)
      )
    )
    .returning(addressColumns)
    .get();

  if (!address) throw notFound('Address not found');
  return address;
});
