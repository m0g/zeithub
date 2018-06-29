import DB from './../../db';

const db = new DB();

export default async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  const invoice = await db.queryOne(`
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

  const bankAccount = await db.queryOne(`
    select name, owner, iban, bic
    from bank_accounts
    where id = ${invoice.bankAccountId}
  `);

  const activities = await db.query(`
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

  res.json({ success: true, invoice, activities, bankAccount });
};