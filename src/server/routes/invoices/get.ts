import DB from "./../../db";
import { Invoice, BankAccount, Activity } from "./../../../types";

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
      i.tax,
      i.discount,
      i.user_address_id as 'userAddressId',
      i.bank_account_id as 'bankAccountId',
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

  const activities: Array<Activity> = await db.query(`
    select
      a.name, 
      sum(a.duration_minutes) as 'durationMinutes',
      p.name as 'projectName',
      p.slug as 'projectSlug'
    from activities a
    join projects p on a.project_id = p.id
    where a.user_id = ${req.userId}
    and a.invoice_id = ${invoice.id}
    group by a.name, p.name, p.slug
  `);

  const address = await db.queryOne(`
    select id, name, street, city, postcode, country
    from addresses
    where id = ${invoice.userAddressId}
  `);

  res.json({ success: true, invoice, activities, bankAccount, address });
};
