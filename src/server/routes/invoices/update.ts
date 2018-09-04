import DB from "./../../db";

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  const { name, number, rate } = req.body;

  console.log(name, number, rate, id, userId);
  try {
    await db.execute(
      `update invoices
      set name = ?, number = ?, rate = ?
      where id = ? and user_id = ?`,
      [name, number, rate, id, userId]
    );
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

  return res.json({ success: true });
};
