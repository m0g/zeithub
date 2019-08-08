import DB from './../../db';

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;

  const { name, street, city, postcode, country } = req.body;

  try {
    await db.execute(
      `update addresses
      set name = ?, street = ?, city = ?, postcode = ?, country = ?
      where id = ? and user_id = ?`,
      [name, street, city, postcode, country, id, userId]
    );
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

  return res.json({ success: true });
};
