import DB from "./../../db";

const db = new DB();

export default async (req, res) => {
  let years;

  try {
    years = await db.query(`
      select distinct year(date) as year
      from expenses
      where user_id = ${req.userId}
    `);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error on select",
      error
    });
  }

  if (years) {
    return res.json({
      success: true,
      years: years.map(y => y.year)
    });
  }

  return res
    .status(500)
    .json({ success: false, message: "Expenses not found" });
};
