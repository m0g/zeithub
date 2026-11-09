import { and, asc, desc, eq } from 'drizzle-orm';
import type { z } from 'zod';
import * as t from '../db/schema';

type InvoiceBody = z.output<typeof invoiceSchema>;

const addressFields = {
  extra: true,
  street: true,
  city: true,
  postcode: true,
  country: true,
} as const;

export function listInvoices(userId: number): InvoiceListEntry[] {
  const rows = useDb()
    .query.invoices.findMany({
      where: eq(t.invoices.userId, userId),
      orderBy: [desc(t.invoices.date), desc(t.invoices.number)],
      with: {
        currency: true,
        client: { columns: { id: true, name: true } },
        items: { columns: { qty: true, unitPriceCents: true } },
      },
    })
    .sync();

  return rows.map(row => ({
    id: row.id,
    number: row.number,
    name: row.name,
    date: row.date,
    dueDate: row.dueDate,
    currency: row.currency,
    client: row.client,
    totals: computeInvoiceTotals(row.items, row.discountCents, row.taxRate),
  }));
}

// One relational query for everything the invoice page and the PDF need.
export function loadInvoiceDocument(
  userId: number,
  id: number
): InvoiceDocumentData {
  const db = useDb();
  const row = db.query.invoices
    .findFirst({
      where: and(eq(t.invoices.id, id), eq(t.invoices.userId, userId)),
      columns: { userId: false },
      with: {
        currency: true,
        items: {
          columns: {
            id: true,
            title: true,
            qty: true,
            unitPriceCents: true,
            projectId: true,
          },
          orderBy: asc(t.items.id),
        },
        client: {
          columns: { id: true, name: true, taxNumber: true, vatNumber: true },
          with: {
            addresses: {
              columns: addressFields,
              orderBy: asc(t.addresses.id),
              limit: 1,
            },
          },
        },
        bankAccount: {
          columns: { name: true, owner: true, iban: true, bic: true },
        },
        userAddress: { columns: addressFields },
        user: {
          columns: {
            firstName: true,
            lastName: true,
            email: true,
            tel: true,
            website: true,
            taxNumber: true,
            vatNumber: true,
          },
        },
      },
    })
    .sync();

  if (!row) throw notFound('Invoice not found');

  const {
    currency,
    items,
    client,
    bankAccount,
    userAddress,
    user,
    ...invoice
  } = row;

  return {
    invoice,
    items,
    currency,
    client: client
      ? {
          id: client.id,
          name: client.name,
          taxNumber: client.taxNumber,
          vatNumber: client.vatNumber,
          address: client.addresses[0] ?? null,
        }
      : null,
    issuer: user,
    userAddress: userAddress ?? null,
    bankAccount: bankAccount ?? null,
  };
}

function assertInvoiceReferences(userId: number, body: InvoiceBody) {
  assertReferencesOwned(userId, {
    clientId: body.clientId,
    bankAccountId: body.bankAccountId,
    userAddressId: body.userAddressId,
    currencyCode: body.currencyCode,
    projectIds: body.items.map(item => item.projectId),
  });
}

function duplicateNumber(number: number) {
  return createError({
    statusCode: 409,
    statusMessage: `Invoice number ${number} already exists`,
    data: {
      issues: [
        { path: 'number', message: `Invoice number ${number} already exists` },
      ],
    },
  });
}

// Insert (no id) or update (id) an invoice and replace its items, atomically.
export function saveInvoice(userId: number, body: InvoiceBody, id?: number) {
  assertInvoiceReferences(userId, body);
  const { items, ...fields } = body;

  try {
    return useDb().transaction(tx => {
      let invoiceId: number;

      if (id) {
        const updated = tx
          .update(t.invoices)
          .set(fields)
          .where(and(eq(t.invoices.id, id), eq(t.invoices.userId, userId)))
          .returning({ id: t.invoices.id })
          .get();
        if (!updated) throw notFound('Invoice not found');
        invoiceId = updated.id;
        tx.delete(t.items).where(eq(t.items.invoiceId, invoiceId)).run();
      } else {
        invoiceId = tx
          .insert(t.invoices)
          .values({ ...fields, userId })
          .returning({ id: t.invoices.id })
          .get().id;
      }

      tx.insert(t.items)
        .values(items.map(item => ({ ...item, invoiceId, userId })))
        .run();

      return invoiceId;
    });
  } catch (error) {
    if (isUniqueViolation(error)) throw duplicateNumber(body.number);
    throw error;
  }
}
