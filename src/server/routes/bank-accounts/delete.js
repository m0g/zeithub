const DB = require("./../../db").default;

const db = new DB();

const deleteAccount = async (req, res) => {
  const iban = req.params.iban;
  const userId = req.userId;

  try {
    await db.execute(`
      delete from bank_accounts
      where iban = '${iban}' and user_id = ${userId}
    `);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error on delete",
      error
    });
  }

  return res.json({ success: true });
};

module.exports = deleteAccount;
