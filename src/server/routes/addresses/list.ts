import DB from './../../db';

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;

  const addresses = await db.query(`
    select id, name, street, city, postcode, country
    from addresses
    where user_id = ${userId}
  `);
 
  res.json({ success: true, addresses });
};

