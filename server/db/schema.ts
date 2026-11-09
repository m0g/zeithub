// Zeithub database schema (SQLite).
//
// Columns are camelCase here and snake_case in the database thanks to
// `casing: 'snake_case'` (see drizzle.config.ts and server/utils/db.ts).
//
// Money is stored as integer cents (`*Cents`) to avoid float rounding.
// Calendar dates (invoice date / due date) are ISO `YYYY-MM-DD` strings.
import { relations, sql } from 'drizzle-orm';
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

const id = () => integer().primaryKey({ autoIncrement: true });
const createdAt = () =>
  integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`);

export const users = sqliteTable(
  'users',
  {
    id: id(),
    // Login name ("username" in the UI).
    name: text().notNull(),
    email: text().notNull(),
    // scrypt hash from nuxt-auth-utils, or a legacy bcrypt hash ("$2…")
    // that gets upgraded on the next sign-in.
    password: text().notNull(),
    admin: integer({ mode: 'boolean' }).notNull().default(false),
    firstName: text(),
    lastName: text(),
    tel: text(),
    website: text(),
    taxNumber: text(),
    vatNumber: text(),
    createdAt: createdAt(),
  },
  t => [uniqueIndex('users_name_unique').on(t.name)]
);

export const currencies = sqliteTable('currencies', {
  code: text().primaryKey(),
  name: text().notNull(),
  sign: text().notNull(),
  // Whether the sign goes before the amount ($12.00) or after (12.00€).
  leading: integer({ mode: 'boolean' }).notNull().default(false),
});

export const clients = sqliteTable(
  'clients',
  {
    id: id(),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    taxNumber: text(),
    vatNumber: text(),
  },
  t => [index('clients_user_id_idx').on(t.userId)]
);

// Holds both the user's own addresses (clientId = null) and the address of
// each client (clientId set). userId is always the owner.
export const addresses = sqliteTable(
  'addresses',
  {
    id: id(),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    clientId: integer().references(() => clients.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    extra: text(),
    street: text().notNull(),
    city: text().notNull(),
    postcode: text().notNull(),
    country: text().notNull(),
  },
  t => [
    index('addresses_user_id_idx').on(t.userId),
    index('addresses_client_id_idx').on(t.clientId),
  ]
);

export const bankAccounts = sqliteTable(
  'bank_accounts',
  {
    id: id(),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    owner: text().notNull(),
    iban: text().notNull(),
    bic: text().notNull(),
  },
  t => [uniqueIndex('bank_accounts_user_iban_unique').on(t.userId, t.iban)]
);

export const projects = sqliteTable(
  'projects',
  {
    id: id(),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    clientId: integer().references(() => clients.id, { onDelete: 'set null' }),
    name: text().notNull(),
    slug: text().notNull(),
  },
  t => [uniqueIndex('projects_user_slug_unique').on(t.userId, t.slug)]
);

export const invoices = sqliteTable(
  'invoices',
  {
    id: id(),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    number: integer().notNull(),
    name: text().notNull(),
    date: text().notNull(),
    dueDate: text().notNull(),
    memo: text(),
    // Flat discount, subtracted from the net amount before tax.
    discountCents: integer().notNull().default(0),
    // VAT rate in percent, e.g. 19.
    taxRate: real().notNull().default(0),
    currencyCode: text()
      .notNull()
      .default('EUR')
      .references(() => currencies.code),
    clientId: integer().references(() => clients.id, { onDelete: 'set null' }),
    bankAccountId: integer().references(() => bankAccounts.id, {
      onDelete: 'set null',
    }),
    userAddressId: integer().references(() => addresses.id, {
      onDelete: 'set null',
    }),
  },
  t => [uniqueIndex('invoices_user_number_unique').on(t.userId, t.number)]
);

export const items = sqliteTable(
  'items',
  {
    id: id(),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    invoiceId: integer()
      .notNull()
      .references(() => invoices.id, { onDelete: 'cascade' }),
    projectId: integer().references(() => projects.id, {
      onDelete: 'set null',
    }),
    title: text().notNull(),
    qty: real().notNull().default(1),
    unitPriceCents: integer().notNull(),
  },
  t => [
    index('items_invoice_id_idx').on(t.invoiceId),
    index('items_user_id_idx').on(t.userId),
  ]
);

// Relations, used by the relational query API (db.query.*.findFirst({ with })).

export const usersRelations = relations(users, ({ many }) => ({
  clients: many(clients),
  addresses: many(addresses),
  bankAccounts: many(bankAccounts),
  projects: many(projects),
  invoices: many(invoices),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  addresses: many(addresses),
  projects: many(projects),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
  client: one(clients, {
    fields: [addresses.clientId],
    references: [clients.id],
  }),
}));

export const bankAccountsRelations = relations(bankAccounts, ({ one }) => ({
  user: one(users, { fields: [bankAccounts.userId], references: [users.id] }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
  items: many(items),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  user: one(users, { fields: [invoices.userId], references: [users.id] }),
  currency: one(currencies, {
    fields: [invoices.currencyCode],
    references: [currencies.code],
  }),
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  bankAccount: one(bankAccounts, {
    fields: [invoices.bankAccountId],
    references: [bankAccounts.id],
  }),
  userAddress: one(addresses, {
    fields: [invoices.userAddressId],
    references: [addresses.id],
  }),
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  invoice: one(invoices, {
    fields: [items.invoiceId],
    references: [invoices.id],
  }),
  project: one(projects, {
    fields: [items.projectId],
    references: [projects.id],
  }),
}));
