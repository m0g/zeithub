const express = require('express');

const DB = require('./../db');
const verifyToken = require('./../verify-token');
const { camelToSnake } = require('./../../utils');

const router = express.Router();
const db = new DB();

const buildQuery = body => {
  let query = '';

  Object.keys(body).forEach(key => {
    query += ` ${camelToSnake(key)} = '${body[key]}'`;
  });

  return query;
};


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
  const fields = ['email', 'firstName', 'lastName', 'tel', 'website'];

  if (Object.keys(req.body).length === 0) {
    return res.status(500).json({ success: false, message: 'Empty body' });
  }

  let body = {};

  fields.forEach(key => {
    if (req.body.hasOwnProperty(key)) {
      body[key] = req.body[key];
    }
  });

  try {
    await db.execute(`
      update users 
      set ${buildQuery(body)}
      where id = ${userId}
    `);
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }

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
});

module.exports = router;