const express = require('express');

const DB = require('./../db').default;
const verifyToken = require('./../verify-token').default;

const router = express.Router();
const db = new DB();

router.get('/', verifyToken, async (req, res) => {
  try {
    const activities = await db.query(`
      select 
        a.id, 
        a.name, 
        a.start_time as 'startTime', 
        a.end_time as 'endTime',
        a.duration_minutes as 'durationMinutes',
        p.name as 'projectName',
        p.slug as 'projectSlug'
      from activities a
      join projects p on a.project_id = p.id
      where a.user_id = ${req.userId}
      order by a.start_time asc
    `);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;