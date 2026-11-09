// Request body schemas, shared by the API (validation) and the forms
// (client-side checks with the same messages).
import { z } from 'zod';

const required = (label: string, max = 255) =>
  z
    .string({ error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} is too long`);

// Empty strings become null.
const optionalText = (max = 255) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform(value => value || null);

const isoDate = (label: string) =>
  z
    .string({ error: `${label} is required` })
    .regex(/^\d{4}-\d{2}-\d{2}$/, `${label} must be a date (YYYY-MM-DD)`);

const optionalId = z.number().int().positive().nullish().default(null);

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1).max(255),
});

export const signUpSchema = z.object({
  username: required('Username', 100),
  email: z.email('Email is invalid').trim().max(255),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signInSchema = z.object({
  username: required('Username'),
  password: z.string().min(1, 'Password is required'),
});

export const meSchema = z.object({
  email: z.email('Email is invalid').trim().max(255),
  firstName: optionalText(),
  lastName: optionalText(),
  tel: optionalText(),
  website: optionalText(),
  taxNumber: optionalText(),
  vatNumber: optionalText(),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  password: z.string().min(8, 'New password must be at least 8 characters'),
});

const addressFields = {
  extra: optionalText(),
  street: required('Street'),
  city: required('City'),
  postcode: required('Postcode', 45),
  country: required('Country'),
};

export const addressSchema = z.object({
  name: required('Name'),
  ...addressFields,
});

export const clientSchema = z.object({
  name: required('Name'),
  taxNumber: optionalText(),
  vatNumber: optionalText(),
  ...addressFields,
});

export const bankAccountSchema = z.object({
  name: required('Name'),
  owner: required('Owner'),
  iban: required('IBAN', 64)
    .transform(value => value.replace(/\s+/g, '').toUpperCase())
    .pipe(z.string().regex(/^[A-Z]{2}\d{2}[A-Z0-9]{8,30}$/, 'IBAN is invalid')),
  bic: required('BIC', 11)
    .transform(value => value.replace(/\s+/g, '').toUpperCase())
    .pipe(z.string().regex(/^[A-Z0-9]{8}([A-Z0-9]{3})?$/, 'BIC is invalid')),
});

export const projectSchema = z.object({
  name: required('Name'),
  clientId: optionalId,
});

export const projectUpdateSchema = z.object({
  name: required('Name').optional(),
  clientId: z.number().int().positive().nullable().optional(),
});

export const invoiceItemSchema = z.object({
  title: required('Description', 1000),
  qty: z.number('Quantity must be a number').positive().max(1_000_000),
  unitPriceCents: z.number('Unit price must be a number').int(),
  projectId: optionalId,
});

export const invoiceSchema = z.object({
  name: required('Title'),
  number: z.number('Invoice number is required').int().positive(),
  date: isoDate('Date'),
  dueDate: isoDate('Due date'),
  memo: optionalText(5000),
  discountCents: z.number().int().min(0).default(0),
  taxRate: z.number().min(0).max(100).default(0),
  currencyCode: z.string('Currency is required').length(3),
  clientId: optionalId,
  bankAccountId: optionalId,
  userAddressId: optionalId,
  items: z.array(invoiceItemSchema).min(1, 'Add at least one item'),
});

export type SignUpInput = z.input<typeof signUpSchema>;
export type MeInput = z.input<typeof meSchema>;
export type AddressInput = z.input<typeof addressSchema>;
export type ClientInput = z.input<typeof clientSchema>;
export type BankAccountInput = z.input<typeof bankAccountSchema>;
export type ProjectInput = z.input<typeof projectSchema>;
export type InvoiceInput = z.input<typeof invoiceSchema>;
export type InvoiceItemInput = z.input<typeof invoiceItemSchema>;

export interface ValidationIssue {
  path: string;
  message: string;
}

export function toIssues(error: z.ZodError): ValidationIssue[] {
  return error.issues.map(issue => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}
