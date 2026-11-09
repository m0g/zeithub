import { and, eq } from 'drizzle-orm';
import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const id = getIdParam(event);
  const { client, address } = splitClientInput(
    await readBodyAs(event, clientSchema)
  );

  const updated = useDb().transaction(tx => {
    const row = tx
      .update(t.clients)
      .set(client)
      .where(and(eq(t.clients.id, id), eq(t.clients.userId, userId)))
      .returning({ id: t.clients.id })
      .get();

    if (!row) return false;

    const existing = tx
      .select({ id: t.addresses.id })
      .from(t.addresses)
      .where(eq(t.addresses.clientId, id))
      .get();

    if (existing) {
      tx.update(t.addresses)
        .set({ ...address, name: client.name })
        .where(eq(t.addresses.id, existing.id))
        .run();
    } else {
      tx.insert(t.addresses)
        .values({ ...address, name: client.name, userId, clientId: id })
        .run();
    }

    return true;
  });

  if (!updated) throw notFound('Client not found');
  return findClients(userId, id)[0];
});
