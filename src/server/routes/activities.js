const express = require('express');

const DB = require('./../db');
const verifyToken = require('./../verify-token');

const router = express.Router();
const db = new DB();

router.get('/', verifyToken, async (req, res) => {
  await db.init();

  const activities = await db.query(`
    select id, name, start_time as 'startTime', end_time as 'endTime'
    from activities
    where user_id = ${req.userId}
    order by start_time asc
  `);

  res.json(activities);
});

module.exports = router;