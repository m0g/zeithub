import DB from "./../../db";

const db = new DB();

export default async (req, res) => {
  let expenses;

  try {
    expenses = await db.query(`
      select id, name, date, amount
      from expenses
      where user_id = ${req.userId}
      order by date desc
    `);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error on select",
      error
    });
  }

  if (expenses) {
    return res.json({ success: true, expenses });
  }

  return res
    .status(500)
    .json({ success: false, message: "Expenses not found" });
};
