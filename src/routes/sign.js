const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/in', async function(req, res, next) {
  const connection = await mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWD,
    database : process.env.DB_NAME,
  });

  if (req.body.username && req.body.password) {
    const sql = `
      select name, password
      from users
      where name='${req.body.username}'
    `;

    const [results, fields] = await connection.query(sql);

    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(req.body.password, user.password);

      if (match) {
        const token = jwt.sign({
          data: { username: user.name }
          }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
            algorithm: 'HS256'
        });

        res.json({ sucess: true, token });
      } else {
        res.status(500).json({ success: false });
      }
    }
  }
});

module.exports = router;