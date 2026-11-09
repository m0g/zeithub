import slugify from 'slugify';

// "007-website-redesign-jane-doe.pdf"
export function invoiceFilename(
  invoice: { number: number; name: string },
  issuer: { firstName: string | null; lastName: string | null }
) {
  const parts = [
    invoice.number.toString().padStart(3, '0'),
    invoice.name,
    issuer.firstName,
    issuer.lastName,
  ].filter(Boolean) as string[];

  return `${slugify(parts.join(' '), { lower: true, strict: true })}.pdf`;
}
