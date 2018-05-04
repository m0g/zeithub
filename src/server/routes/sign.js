const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const DB = require('./../db');

const router = express.Router();
const db = new DB();
const saltRounds = parseInt(process.env.BCRYPT_SALT);

router.post('/up', async (req, res) => {
  await db.init();

  if (!req.body.username) {
    return res.status(403).json({ success: false, message: 'Missing username' });
  }

  if (!req.body.password) {
    return res.status(403).json({ success: false, message: 'Missing password' });
  }

  if (!req.body.email) {
    return res.status(403).json({ success: false, message: 'Missing email' });
  }

  const email = req.body.email;
  const username = req.body.username;
  const password = await bcrypt.hash(req.body.password, saltRounds);

  const users = await db.query(`
    select id from users where name = '${username}' or email = '${email}'
  `);

  if (users.length > 0) {
    return res.status(500).json({ success: false, message: 'User already exists' });
  }

  const id = await db.execute(`
    insert into users (name, email, password)
    values ('${username}', '${email}', '${password}')
  `);

  if (!id) {
    return res.status(500).json({ success: false, message: 'Cannot insert' });
  }

  const user = await db.queryOne(`
    select id, name, email, password from users where id = ${id}
  `);

  if (!user) {
    return res.status(500).json({ success: false, message: 'Error' });
  }

  const token = jwt.sign({
    data: { id: user.id, username: user.name }
  }, process.env.JWT_SECRET, {
    expiresIn: '1d',
    algorithm: 'HS256'
  });

  res.json({ success: true, user, token });
});

router.post('/in', async (req, res) => {
  await db.init();

  if (!req.body.username) {
    return res.status(403).json({ success: false, message: 'Missing user name' });
  }

  if (!req.body.password) {
    return res.status(403).json({ success: false, message: 'Missing password' });
  }

  const sql = `
    select id, name, password
    from users
    where name='${req.body.username}'
  `;

  const users = await db.query(sql);

  if (users.length === 0) {
    return res.status(403).json({ success: false, message: 'Wrong credentials' });
  }

  const user = users[0];
  const match = await bcrypt.compare(req.body.password, user.password);

  if (match) {
    const token = jwt.sign({
      data: { id: user.id, username: user.name }
    }, process.env.JWT_SECRET, {
      expiresIn: '1d',
      algorithm: 'HS256'
    });

    return res.json({ success: true, token });
  }
  
  return res.status(403).json({ success: false, message: 'Wrong credentials' });
});

module.exports = router;