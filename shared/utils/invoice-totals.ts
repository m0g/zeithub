export interface TotalsItem {
  qty: number;
  unitPriceCents: number;
}

export interface InvoiceTotals {
  netCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
}

export function lineAmountCents(item: TotalsItem) {
  return Math.round(item.qty * item.unitPriceCents);
}

// Net = sum of lines. The discount is a flat amount taken off the net, and
// tax (VAT, in percent) applies to what remains.
export function computeInvoiceTotals(
  items: TotalsItem[],
  discountCents = 0,
  taxRate = 0
): InvoiceTotals {
  const netCents = items.reduce((sum, item) => sum + lineAmountCents(item), 0);
  const discount = discountCents > 0 ? discountCents : 0;
  const taxable = netCents - discount;
  const taxCents = taxRate > 0 ? Math.round((taxable * taxRate) / 100) : 0;

  return {
    netCents,
    discountCents: discount,
    taxCents,
    totalCents: taxable + taxCents,
  };
}
