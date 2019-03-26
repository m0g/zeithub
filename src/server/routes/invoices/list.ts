import DB from './../../db';

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
      sum(it.qty * it.unit_price) as 'subTotal',
      c.code as 'currencyCode',
      c.sign as 'currencySign',
      c.name as 'currencyName',
      c.leading as 'currencyLeading'
    from invoices i
      join currencies c on i.currency_code = c.code
      join items it on i.id = it.invoice_id
    where i.user_id = ${userId}
    group by it.invoice_id
    order by i.date desc
  `);

  res.json({ success: true, invoices });
};
