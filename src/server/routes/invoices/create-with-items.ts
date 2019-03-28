import DB from './../../db';
import { Item, Invoice } from './../../../models';

const db = new DB();

export default async (req, res) => {
  if (!req.body.invoice) {
    return res.status(403).json({ success: false, message: 'Missing invoice' });
  }

  if (!req.body.items || req.body.items.length === 0) {
    return res.status(403).json({ success: false, message: 'Missing items' });
  }

  const userId = req.userId;
  const invoice: Invoice = req.body.invoice; // TODO: pass it to the constructor
  const items: Item[] = req.body.items;

  let invoiceId;
  let errors: string[] = invoice.validate();

  if (errors.length > 0) {
    return res.status(403).json({ success: false, errors });
  }

  const isNumberExisting = await db.queryOne(`
    select id
    from invoices
    where user_id = ${userId} and number = ${invoice.number}
  `);

  if (isNumberExisting) {
    return res
      .status(500)
      .json({ success: false, message: 'Invoice number already existing' });
  }

  try {
    invoiceId = await db.execute(
      `
        insert into invoices (
          user_id, 
          date, 
          due_date, 
          name, 
          memo,
          number, 
          tax,
          discount,
          user_address_id,
          bank_account_id,
          currency_code,
          client_id
        )
        values (?,?,?,?,?,?,?,?,?,?,?,?)
      `,
      [
        userId,
        invoice.date,
        invoice.dueDate,
        invoice.name,
        invoice.memo,
        invoice.number,
        invoice.tax,
        invoice.discount,
        invoice.userAddressId,
        invoice.bankAccountId,
        invoice.currencyCode,
        invoice.clientId
      ]
    );
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

  for (let item of items) {
    try {
      await db.execute(
        `
          insert into items (
            title,
            unit_price,
            qty,
            project_id,
            user_id, 
            invoice_id)
          values (?,?,?,?,?,?)
        `,
        [
          item.title,
          item.unitPrice,
          item.qty,
          item.projectId,
          userId,
          invoiceId
        ]
      );
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  }

  res.json({ success: true, invoiceId });
};
