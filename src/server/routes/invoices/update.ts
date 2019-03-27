import DB from './../../db';

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  const { name, number, rate, userAddressId } = req.body;

  try {
    await db.execute(
      `update invoices
      set name = ?, number = ?, rate = ?, user_address_id = ?
      where id = ? and user_id = ?`,
      [name, number, rate, userAddressId, id, userId]
    );
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

  return res.json({ success: true });
};
