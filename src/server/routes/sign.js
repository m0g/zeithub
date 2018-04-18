const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const DB = require('./../db');

const router = express.Router();
const db = new DB();

router.post('/in', async function(req, res, next) {
  await db.init();

  if (req.body.username && req.body.password) {
    const sql = `
      select id, name, password
      from users
      where name='${req.body.username}'
    `;

    const users = await db.query(sql);

    if (users.length > 0) {
      const user = users[0];
      const match = await bcrypt.compare(req.body.password, user.password);

      if (match) {
        const token = jwt.sign({
          data: { id: user.id, username: user.name }
          }, process.env.JWT_SECRET, {
            expiresIn: '1d',
            algorithm: 'HS256'
        });

        res.json({ success: true, token });
      } else {
        res.status(500).json({ success: false });
      }
    }
  }
});

module.exports = router;