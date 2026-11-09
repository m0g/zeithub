import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { InvoiceDocument } from '#shared/invoice/document';

export default defineEventHandler(async event => {
  const userId = await requireUser(event);
  const data = loadInvoiceDocument(userId, getIdParam(event));

  const body = await renderToString(
    createSSRApp({ render: () => h(InvoiceDocument, { data }) })
  );
  const html = `<!doctype html><html><head><meta charset="utf-8">
<style>@page { size: A4; margin: 0 } html, body { margin: 0 }</style>
</head><body>${body}</body></html>`;

  const page = await (await getBrowser()).newPage();
  let pdf: Uint8Array;
  try {
    await page.setContent(html, { waitUntil: 'load' });
    pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    await page.close();
  }

  const filename = invoiceFilename(data.invoice, data.issuer);
  setResponseHeaders(event, {
    'content-type': 'application/pdf',
    'content-disposition': `attachment; filename="${filename}"`,
  });
  return Buffer.from(pdf);
});
