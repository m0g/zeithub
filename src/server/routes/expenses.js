const express = require('express');

const DB = require('./../db').default;
const verifyToken = require('./../verify-token').default;

const router = express.Router();
const db = new DB();

router.get('/', verifyToken, async (req, res) => {
  await db.init();

  let expenses;

  try {
    expenses = await db.query(`
      select id, name, date, amount
      from expenses
      where user_id = ${req.userId}
      order by date desc
    `);
  } catch(error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error on select', 
      error
    });
  }

  if (expenses) {
    return res.json({ success: true, expenses });
  }

  return res.status(500).json({ success: false, message: 'Expenses not found' });
});

router.post('/', verifyToken, async (req, res) => {
  await db.init();

  if (!req.body.name) {
    return res.status(403).json({ success: false, message: 'Missing name' });
  }

  if (!req.body.amount) {
    return res.status(403).json({ success: false, message: 'Missing amount' });
  }

  if (!req.body.date) {
    return res.status(403).json({ success: false, message: 'Missing date' });
  }

  const name = req.body.name;
  const amount = req.body.amount;
  const date = req.body.date;
  const userId = req.userId;
  let expenseID;

  try {
    expenseID = await db.execute(`
      insert into expenses (name, date, amount, user_id)
      values ('${name}', '${date}', ${amount}, ${userId})
    `);
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error on insert', 
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
    return res.status(500).json({ success: false, message: 'expense not found' });
  }
});

module.exports = router;