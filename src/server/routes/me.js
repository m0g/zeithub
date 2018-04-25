const express = require('express');

const DB = require('./../db');
const verifyToken = require('./../verify-token');

const router = express.Router();
const db = new DB();

router.get('/', verifyToken, async (req, res) => {
  await db.init();

  const userId = req.userId;

  try {
    const me = await db.queryOne(`
      select
        email, 
        name, 
        first_name as 'firstName', 
        last_name as 'lastName', 
        tel, 
        website
      from users
      where id = ${userId}
    `);

    res.json({ success: true, me });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.put('/', verifyToken, async (req, res) => {
  await db.init();

  const userId = req.userId;

  res.json({ success: true, body: req.body });
});

module.exports = router;