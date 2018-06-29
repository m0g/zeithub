import DB from './../../db';

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;

  const invoices = await db.query(`
    select id, number, name, date
    from invoices
    where user_id = ${userId}
    order by date desc
  `);

  res.json({ success: true, invoices });
};