import DB from "./../../db";

const db = new DB();

export default async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  const { name, amount, date } = req.body;

  try {
    await db.execute(
      `update expenses
      set name = ?, amount = ?, date = ?
      where id = ? and user_id = ?`,
      [name, amount, date, id, userId]
    );
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

  return res.json({ success: true });
};
