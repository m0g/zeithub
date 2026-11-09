import { and, eq, inArray, isNull } from 'drizzle-orm';
import * as t from '../db/schema';

interface References {
  clientId?: number | null;
  bankAccountId?: number | null;
  userAddressId?: number | null;
  projectIds?: (number | null | undefined)[];
  currencyCode?: string;
}

// Make sure every id in a request body points at a row the user owns, so
// nobody can attach (and then read back) another user's data.
export function assertReferencesOwned(userId: number, refs: References) {
  const db = useDb();
  const fail = (what: string) =>
    createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      message: `Unknown ${what}`,
      data: { issues: [{ path: what, message: `Unknown ${what}` }] },
    });

  if (refs.clientId) {
    const row = db
      .select({ id: t.clients.id })
      .from(t.clients)
      .where(and(eq(t.clients.id, refs.clientId), eq(t.clients.userId, userId)))
      .get();
    if (!row) throw fail('clientId');
  }

  if (refs.bankAccountId) {
    const row = db
      .select({ id: t.bankAccounts.id })
      .from(t.bankAccounts)
      .where(
        and(
          eq(t.bankAccounts.id, refs.bankAccountId),
          eq(t.bankAccounts.userId, userId)
        )
      )
      .get();
    if (!row) throw fail('bankAccountId');
  }

  if (refs.userAddressId) {
    const row = db
      .select({ id: t.addresses.id })
      .from(t.addresses)
      .where(
        and(
          eq(t.addresses.id, refs.userAddressId),
          eq(t.addresses.userId, userId),
          isNull(t.addresses.clientId)
        )
      )
      .get();
    if (!row) throw fail('userAddressId');
  }

  const projectIds = [
    ...new Set((refs.projectIds ?? []).filter((id): id is number => !!id)),
  ];
  if (projectIds.length > 0) {
    const rows = db
      .select({ id: t.projects.id })
      .from(t.projects)
      .where(
        and(inArray(t.projects.id, projectIds), eq(t.projects.userId, userId))
      )
      .all();
    if (rows.length !== projectIds.length) throw fail('projectId');
  }

  if (refs.currencyCode) {
    const row = db
      .select({ code: t.currencies.code })
      .from(t.currencies)
      .where(eq(t.currencies.code, refs.currencyCode))
      .get();
    if (!row) throw fail('currencyCode');
  }
}
