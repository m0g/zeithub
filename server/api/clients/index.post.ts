import * as t from '../../db/schema';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const { client, address } = splitClientInput(
    await readBodyAs(event, clientSchema)
  );

  const clientId = useDb().transaction(tx => {
    const { id } = tx
      .insert(t.clients)
      .values({ ...client, userId })
      .returning({ id: t.clients.id })
      .get();

    tx.insert(t.addresses)
      .values({ ...address, name: client.name, userId, clientId: id })
      .run();

    return id;
  });

  setResponseStatus(event, 201);
  return findClients(userId, clientId)[0];
});
