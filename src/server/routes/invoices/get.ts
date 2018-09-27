import DB from "./../../db";
import { Invoice, BankAccount, Activity } from "./../../../types";

const db = new DB();

export default async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  const invoice: Invoice = await db.queryOne(`
    select 
      id, 
      number, 
      name, 
      memo,
      date, 
      due_date as 'dueDate', 
      rate, 
      tax,
      discount,
      user_address_id as 'userAddressId',
      bank_account_id as 'bankAccountId'
    from invoices
    where id = ${id} and user_id = ${userId}
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
