export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const id = getIdParam(event);
  const body = await readBodyAs(event, invoiceSchema);

  saveInvoice(userId, body, id);
  return loadInvoiceDocument(userId, id);
});
