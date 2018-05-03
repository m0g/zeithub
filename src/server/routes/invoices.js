const express = require('express');

const DB = require('./../db');
const verifyToken = require('./../verify-token');

const router = express.Router();
const db = new DB();

router.post('/', verifyToken, async (req, res) => {
  await db.init();

  res.json({ success: true });
});

module.exports = router;
 