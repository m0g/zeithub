import DB from './../../db';

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;

  const clients = await db.query(`
    select id, name
    from clients
    where user_id = ${userId}
  `);
 
  res.json({ success: true, clients });
};

