import { describe, expect, it } from 'vitest';
import {
  computeInvoiceTotals,
  lineAmountCents,
} from '../../shared/utils/invoice-totals';

describe('computeInvoiceTotals', () => {
  const items = [
    { qty: 2, unitPriceCents: 30000 },
    { qty: 1, unitPriceCents: 30000 },
  ];

  it('sums the lines', () => {
    expect(computeInvoiceTotals(items)).toEqual({
      netCents: 90000,
      discountCents: 0,
      taxCents: 0,
      totalCents: 90000,
    });
  });

  it('applies the discount before tax', () => {
    // (900 - 100) * 19% = 152
    expect(computeInvoiceTotals(items, 10000, 19)).toEqual({
      netCents: 90000,
      discountCents: 10000,
      taxCents: 15200,
      totalCents: 95200,
    });
  });

  it('rounds tax to the cent', () => {
    const totals = computeInvoiceTotals(
      [{ qty: 1, unitPriceCents: 999 }],
      0,
      19
    );
    expect(totals.taxCents).toBe(190); // 189.81
    expect(totals.totalCents).toBe(1189);
  });

  it('rounds fractional quantities per line', () => {
    expect(lineAmountCents({ qty: 1.5, unitPriceCents: 33333 })).toBe(50000);
    expect(lineAmountCents({ qty: 0.1, unitPriceCents: 3 })).toBe(0);
  });

  it('ignores negative discounts and handles no items', () => {
    expect(computeInvoiceTotals([], -500, 19)).toEqual({
      netCents: 0,
      discountCents: 0,
      taxCents: 0,
      totalCents: 0,
    });
  });
});
