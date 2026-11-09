import { describe, expect, it } from 'vitest';
import {
  formatDate,
  formatIban,
  formatInvoiceNumber,
  formatMoney,
  formatPercentage,
  toCents,
} from '../../shared/utils/format';
import { invoiceFilename } from '../../shared/utils/invoice-filename';

const euro = { sign: '€', leading: false };
const dollar = { sign: '$', leading: true };

describe('formatMoney', () => {
  it('puts the sign after the amount for EUR', () => {
    expect(formatMoney(123456, euro)).toBe('1,234.56€');
  });

  it('puts the sign before the amount for USD/CAD', () => {
    expect(formatMoney(60000, dollar)).toBe('$600.00');
  });

  it('defaults to euros', () => {
    expect(formatMoney(5)).toBe('0.05€');
  });

  it('keeps the minus sign in front', () => {
    expect(formatMoney(-1999, dollar)).toBe('-$19.99');
    expect(formatMoney(-1999, euro)).toBe('-19.99€');
  });
});

describe('formatIban', () => {
  it('groups by four', () => {
    expect(formatIban('DE46100500001061334232')).toBe(
      'DE46 1005 0000 1061 3342 32'
    );
  });

  it('normalises spaces and case', () => {
    expect(formatIban(' de46 1005 0000 1061 3342 32 ')).toBe(
      'DE46 1005 0000 1061 3342 32'
    );
  });

  it('handles other lengths and empty values', () => {
    expect(formatIban('NL91ABNA0417164300')).toBe('NL91 ABNA 0417 1643 00');
    expect(formatIban('')).toBe('');
    expect(formatIban(null)).toBe('');
  });
});

describe('other formatters', () => {
  it('pads invoice numbers to three digits', () => {
    expect(formatInvoiceNumber(7)).toBe('007');
    expect(formatInvoiceNumber(1234)).toBe('1234');
  });

  it('formats percentages', () => {
    expect(formatPercentage(19)).toBe('19.00%');
    expect(formatPercentage(7.7)).toBe('7.70%');
  });

  it('formats ISO dates', () => {
    expect(formatDate('2018-04-13')).toBe('13/04/2018');
    expect(formatDate('2018-04-13', 'yyyy')).toBe('2018');
    expect(formatDate('not a date')).toBe('');
    expect(formatDate(null)).toBe('');
  });

  it('converts decimals to cents without float drift', () => {
    expect(toCents(0.1 + 0.2)).toBe(30);
    expect(toCents('19.99')).toBe(1999);
    expect(toCents('')).toBe(0);
  });

  it('builds the PDF filename', () => {
    expect(
      invoiceFilename(
        { number: 3, name: 'Invoice Farm Radio 03/2018' },
        { firstName: 'Loïc', lastName: 'Nogues' }
      )
    ).toBe('003-invoice-farm-radio-032018-loic-nogues.pdf');
  });
});
