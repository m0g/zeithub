import type { z } from 'zod';
import { and, asc, eq } from 'drizzle-orm';
import * as t from '../db/schema';

// A client and its (single) address, as returned by the API.
export function findClients(userId: number, clientId?: number): ClientInfo[] {
  const rows = useDb()
    .query.clients.findMany({
      where: clientId
        ? and(eq(t.clients.userId, userId), eq(t.clients.id, clientId))
        : eq(t.clients.userId, userId),
      orderBy: asc(t.clients.name),
      with: {
        addresses: {
          columns: {
            extra: true,
            street: true,
            city: true,
            postcode: true,
            country: true,
          },
          orderBy: asc(t.addresses.id),
          limit: 1,
        },
      },
    })
    .sync();

  return rows.map(({ addresses, userId: _userId, ...client }) => ({
    ...client,
    address: addresses[0] ?? null,
  }));
}

export function splitClientInput(input: z.output<typeof clientSchema>) {
  const { name, taxNumber, vatNumber, ...address } = input;
  return { client: { name, taxNumber, vatNumber }, address };
}
