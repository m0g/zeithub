// Types for API payloads, shared by the server and the app.
import type { InferSelectModel } from 'drizzle-orm';
import type * as schema from '../../server/db/schema';

export type Currency = InferSelectModel<typeof schema.currencies>;
export type BankAccount = Omit<
  InferSelectModel<typeof schema.bankAccounts>,
  'userId'
>;
export type Address = Omit<
  InferSelectModel<typeof schema.addresses>,
  'userId' | 'clientId'
>;
export type AddressFields = Pick<
  Address,
  'extra' | 'street' | 'city' | 'postcode' | 'country'
>;
export type Project = Omit<InferSelectModel<typeof schema.projects>, 'userId'>;
export type Item = Omit<InferSelectModel<typeof schema.items>, 'userId'>;
export type Invoice = Omit<InferSelectModel<typeof schema.invoices>, 'userId'>;

export type Me = Omit<
  InferSelectModel<typeof schema.users>,
  'password' | 'admin' | 'createdAt'
>;

export interface ClientInfo {
  id: number;
  name: string;
  taxNumber: string | null;
  vatNumber: string | null;
  address: AddressFields | null;
}

// Everything needed to render an invoice, on screen or as a PDF.
export interface InvoiceDocumentData {
  invoice: Invoice;
  items: Pick<Item, 'id' | 'title' | 'qty' | 'unitPriceCents' | 'projectId'>[];
  currency: Currency;
  client: ClientInfo | null;
  issuer: Pick<
    Me,
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'tel'
    | 'website'
    | 'taxNumber'
    | 'vatNumber'
  >;
  userAddress: AddressFields | null;
  bankAccount: Pick<BankAccount, 'name' | 'owner' | 'iban' | 'bic'> | null;
}

export interface InvoiceListEntry {
  id: number;
  number: number;
  name: string;
  date: string;
  dueDate: string;
  currency: Currency;
  client: { id: number; name: string } | null;
  totals: {
    netCents: number;
    discountCents: number;
    taxCents: number;
    totalCents: number;
  };
}
