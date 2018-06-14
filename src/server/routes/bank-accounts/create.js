const DB = require('./../../db').default;

const db = new DB();

const create = async (req, res) => {
  if (!req.body.name) {
    return res.status(403).json({ success: false, message: 'Missing name' });
  }

  if (!req.body.owner) {
    return res.status(403).json({ success: false, message: 'Missing owner' });
  }

  if (!req.body.iban) {
    return res.status(403).json({ success: false, message: 'Missing IBAN' });
  }

  if (!req.body.bic) {
    return res.status(403).json({ success: false, message: 'Missing BIC' });
  }

  const userId = req.userId;
  const { name, owner, iban, bic } = req.body;
  let bankAccountID;

  try {
    bankAccountID = await db.execute(`
      insert into bank_accounts (name, owner, iban, bic, user_id)
      values ('${name}', '${owner}', '${iban}', '${bic}', ${userId})
    `);
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error on insert', 
      error
    });
  }

  const bankAccount = await db.query(`
    select name, owner, iban, bic
    from bank_accounts
    where id = ${bankAccountID} and user_id = ${userId}
  `);

  if (bankAccount) {
    return res.json({ success: true, bankAccount });
  }

  return res.status(500).json({ success: false, message: 'Bank account not found' });
};

module.exports = create;