import DB from './../../db';
import { Invoice, Item } from './../../../models';

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;

  if (!req.body.invoice) {
    return res.status(403).json({ success: false, message: 'Missing invoice' });
  }

  if (!req.body.items) {
    return res.status(403).json({ success: false, message: 'Missing items' });
  }

  const invoice: Invoice = req.body.invoice;
  const items: Item[] = req.body.items;

  try {
    await db.execute(
      `
        update invoices
        set 
          date = ?,
          due_date = ?,
          name = ?,
          memo = ?,
          number = ?,
          tax = ?,
          discount = ?,
          user_address_id = ?,
          bank_account_id = ?,
          client_id = ?,
          currency_code = ?
        where id = ? and user_id = ?
      `,
      [
        invoice.date,
        invoice.dueDate,
        invoice.name,
        invoice.memo,
        invoice.number,
        invoice.tax,
        invoice.discount,
        invoice.userAddressId,
        invoice.bankAccountId,
        invoice.clientId,
        invoice.currencyCode,
        id,
        userId
      ]
    );
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

  try {
    await db.execute(`delete from items where invoice_id = ?`, [id]);
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
        [item.title, item.unitPrice, item.qty, item.projectId, userId, id]
      );
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  }

  return res.json({ success: true });
};
