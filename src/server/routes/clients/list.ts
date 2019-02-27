import DB from "./../../db";

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;

  const clients = await db.query(`
    select 
      c.id, 
      c.name, 
      c.tax_number as "taxNumber",
      c.vat_number as "vatNumber",
      a.street, 
      a.city, 
      a.postcode, 
      a.country
    from clients c 
    left join addresses a on c.id = a.client_id
    where c.user_id = ${userId}
  `);

  res.json({ success: true, clients });
};
