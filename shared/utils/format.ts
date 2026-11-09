import { DateTime } from 'luxon';

export interface CurrencyFormat {
  sign: string;
  leading: boolean;
}

const EURO: CurrencyFormat = { sign: '€', leading: false };

const amountFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatDate(
  date: string | Date | null | undefined,
  format = 'dd/MM/yyyy'
) {
  if (!date) return '';
  const value =
    date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date);
  return value.isValid ? value.toFormat(format) : '';
}

// 123456 cents → "1,234.56€" (EUR) or "$1,234.56" (USD/CAD).
export function formatMoney(cents: number, currency: CurrencyFormat = EURO) {
  const amount = amountFormat.format(cents / 100);
  if (amount.startsWith('-')) {
    const positive = amount.slice(1);
    return currency.leading
      ? `-${currency.sign}${positive}`
      : `-${positive}${currency.sign}`;
  }
  return currency.leading
    ? `${currency.sign}${amount}`
    : `${amount}${currency.sign}`;
}

export function formatPercentage(rate: number) {
  return `${amountFormat.format(rate)}%`;
}

// "DE46100500001061334232" → "DE46 1005 0000 1061 3342 32"
export function formatIban(value: string | null | undefined) {
  if (!value) return '';
  return value
    .replace(/\s+/g, '')
    .toUpperCase()
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

export function formatInvoiceNumber(number: number) {
  return number.toString().padStart(3, '0');
}

// Decimal amount typed by a user → integer cents. "12.345" → 1235.
export function toCents(amount: number | string) {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

export function fromCents(cents: number) {
  return cents / 100;
}
