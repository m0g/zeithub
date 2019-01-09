import DB from "./../../db";

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;

  const invoices = await db.query(`
    select 
      i.id, 
      i.number, 
      i.name, 
      i.date, 
      i.rate,
      i.rate_daily as dailyRate,
      i.discount,
      i.tax,
      sum(a.duration_minutes) as 'totalDurationMinutes',
      c.code as 'currencyCode',
      c.sign as 'currencySign',
      c.name as 'currencyName',
      c.leading as 'currencyLeading'
    from invoices i
      join currencies c on i.currency_code = c.code
      join activities a on i.id = a.invoice_id
    where i.user_id = ${userId}
    group by a.invoice_id
    order by i.date desc
  `);

  res.json({ success: true, invoices });
};
