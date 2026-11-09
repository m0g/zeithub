import { and, count, eq, type Column } from 'drizzle-orm';
import * as t from '../db/schema';

export const addressColumns = {
  id: t.addresses.id,
  name: t.addresses.name,
  extra: t.addresses.extra,
  street: t.addresses.street,
  city: t.addresses.city,
  postcode: t.addresses.postcode,
  country: t.addresses.country,
};

export const bankAccountColumns = {
  id: t.bankAccounts.id,
  name: t.bankAccounts.name,
  owner: t.bankAccounts.owner,
  iban: t.bankAccounts.iban,
  bic: t.bankAccounts.bic,
};

export const projectColumns = {
  id: t.projects.id,
  name: t.projects.name,
  slug: t.projects.slug,
  clientId: t.projects.clientId,
};

// Invoices are documents: refuse to delete something an invoice points at,
// otherwise its PDF would silently change.
export function assertNotUsedByInvoices(
  userId: number,
  column: Column,
  id: number,
  label: string
) {
  const value =
    useDb()
      .select({ value: count() })
      .from(t.invoices)
      .where(and(eq(t.invoices.userId, userId), eq(column, id)))
      .get()?.value ?? 0;

  if (value > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: `${label} is used by ${value} invoice${value > 1 ? 's' : ''}`,
    });
  }
}
