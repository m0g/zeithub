export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const body = await readBodyAs(event, invoiceSchema);

  const id = saveInvoice(userId, body);

  setResponseStatus(event, 201);
  return loadInvoiceDocument(userId, id);
});
