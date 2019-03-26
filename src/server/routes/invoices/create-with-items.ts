import DB from './../../db';
import { Item, Invoice } from './../../../models';

const db = new DB();

export default async (req, res) => {
  if (!req.body.name) {
    return res.status(403).json({ success: false, message: 'Missing name' });
  }

  if (!req.body.number) {
    return res
      .status(403)
      .json({ success: false, message: 'Missing invoice number' });
  }

  if (!req.body.iban) {
    return res
      .status(403)
      .json({ success: false, message: 'Missing bank account' });
  }

  if (!req.body.date) {
    return res.status(403).json({ success: false, message: 'Missing date' });
  }

  if (!req.body.clientId) {
    return res
      .status(403)
      .json({ success: false, message: 'Missing client ID' });
  }

  if (!req.body.dueDate) {
    return res
      .status(403)
      .json({ success: false, message: 'Missing due date' });
  }

  if (!req.body.userAddressId) {
    return res.status(403).json({ success: false, message: 'Missing address' });
  }

  if (!req.body.items || req.body.items.length === 0) {
    return res.status(403).json({ success: false, message: 'Missing items' });
  }

  if (!req.body.currency) {
    return res
      .status(403)
      .json({ success: false, message: 'Missing currency' });
  }

  const userId = req.userId;
  let invoiceId;

  const {
    name,
    iban,
    date,
    dueDate,
    number,
    memo,
    discount,
    vat,
    currency,
    userAddressId
  } = req.body;

  const items: Item[] = req.body.items;

  const isNumberExisting = await db.queryOne(`
    select id
    from invoices
    where user_id = ${userId} and number = ${number}
  `);

  if (isNumberExisting) {
    return res
      .status(500)
      .json({ success: false, message: 'Invoice number already existing' });
  }

  const bankAccount = await db.queryOne(`
    select id
    from bank_accounts
    where user_id = ${userId} and iban = '${iban}'
  `);

  if (!bankAccount) {
    return res
      .status(500)
      .json({ success: false, message: 'Bank account does not exists' });
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
          currency_code
        )
        values (?,?,?,?,?,?,?,?,?,?,?)
      `,
      [
        userId,
        date,
        dueDate,
        name,
        memo,
        number,
        vat,
        discount,
        userAddressId,
        bankAccount.id,
        currency
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
