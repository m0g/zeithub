import DB from './../../db';
import { Invoice, BankAccount, Item, Client } from './../../../lib/models';

const db = new DB();

export default async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  const invoice: Invoice = await db.queryOne(`
    select 
      i.id, 
      i.number, 
      i.name, 
      i.memo,
      i.date, 
      i.due_date as 'dueDate', 
      i.rate, 
      i.rate_daily as dailyRate,
      i.tax,
      i.discount,
      i.user_address_id as 'userAddressId',
      i.bank_account_id as 'bankAccountId',
      i.client_id as 'clientId',
      c.code as 'currencyCode',
      c.sign as 'currencySign',
      c.name as 'currencyName',
      c.leading as 'currencyLeading'
    from invoices i
      join currencies c on i.currency_code = c.code
    where i.id = ${id} and i.user_id = ${userId}
  `);

  const bankAccount: BankAccount = await db.queryOne(`
    select name, owner, iban, bic
    from bank_accounts
    where id = ${invoice.bankAccountId}
  `);

  const client: Client = await db.queryOne(`
    select 
      c.name, 
      c.tax_number as 'taxNumber',
      c.vat_number as 'vatNumber',
      a.street,
      a.city, 
      a.postcode, 
      a.country
    from clients c
      join addresses a on a.client_id = c.id
    where c.id = ${invoice.clientId}
  `);

  const items: Array<Item> = await db.query(`
    select 
      title, 
      qty, 
      unit_price as 'unitPrice', 
      project_id as 'projectId'
    from items
    where user_id = ${req.userId}
    and invoice_id = ${invoice.id}
  `);

  const address = await db.queryOne(`
    select id, name, street, city, postcode, country
    from addresses
    where id = ${invoice.userAddressId}
  `);

  res.json({
    success: true,
    invoice,
    bankAccount,
    client,
    address,
    items
  });
};
