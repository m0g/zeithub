const DB = require('./../../db').default;

const db = new DB();

const getBankAccounts = async (req, res) => {
  const userId = req.userId;

  const bankAccounts = await db.query(`
    select id, name, owner, iban, bic
    from bank_accounts
    where user_id = ${userId}
  `);

  res.json({ success: true, bankAccounts });
};

module.exports = getBankAccounts;
