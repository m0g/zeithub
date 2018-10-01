import DB from "./../../db";

const db = new DB();

export default async (req, res) => {
  if (!req.body.name) {
    return res.status(403).json({ success: false, message: "Missing name" });
  }

  if (!req.body.amount) {
    return res.status(403).json({ success: false, message: "Missing amount" });
  }

  if (!req.body.date) {
    return res.status(403).json({ success: false, message: "Missing date" });
  }

  const name = req.body.name;
  const amount = req.body.amount;
  const date = req.body.date;
  const userId = req.userId;
  let expenseID;

  try {
    expenseID = await db.execute(
      `
        insert into expenses (name, date, amount, user_id)
        values (?, ?, ?, ?)
      `,
      [name, date, amount, userId]
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error on insert",
      error
    });
  }

  const expense = await db.query(`
    select name, amount
    from expenses
    where id = ${expenseID} and user_id = ${userId}
  `);

  if (expense) {
    res.json({ success: true, expense });
  } else {
    return res
      .status(500)
      .json({ success: false, message: "expense not found" });
  }
};
