const express = require('express');
const multer  = require('multer');

const verifyToken = require('./../verify-token');
const parseXml = require('./../parse-xml');
const DB = require('./../db').default;

const router = express.Router();
const upload = multer();
const db = new DB();

router.post('/', verifyToken, upload.single('xml'), async (req, res) => {
  await db.init();

  const file = req.file;
  const userId = req.userId;

  if (!file) {
    return res.status(500).json({ success: false, message: 'File is missing' });
  }

  const xml = Buffer.from(file.buffer, file.encoding).toString('utf8');

  if (!xml) {
    return res.status(500).json({ success: false, message: 'Invalid XML' });
  }

  const activities = parseXml(xml);

  if (!activities) {
    return res.status(500).json({ 
      success: false, 
      message: 'XML isn\'t formatted properly' 
    });
  }

  let tags = [];

  activities.forEach(activity => {
    if (tags.indexOf(activity.tags) === -1) {
      tags.push(activity.tags);
    }
  });

  let projectIDs = {};

  for (let tag of tags) {
    const project = await db.queryOne(`
      select id 
      from projects 
      where slug = '${tag}' and user_id = ${userId}
    `);

    if (!project) {
      const projectID = await db.execute(`
        insert into projects (name, slug, user_id)
        values ('${tag}', '${tag}', ${userId})
      `);

      if (projectID) {
        projectIDs[tag] = projectID;
      }
    } else {
      projectIDs[tag] = project.id;
    }
  }

  for (let activity of activities) {
    const sqlQuery = `
      select id
      from activities
      where name = '${activity.name}'
      and duration_minutes = ${activity.durationMinutes}
      and start_time = '${activity.startTime}'
      and end_time = '${activity.endTime}'
      and project_id = ${projectIDs[activity.tags]}
      and user_id = ${userId}
    `;

    let existingActivity;

    try {
      existingActivity = await db.queryOne(sqlQuery);
    } catch(err) {
      return res.status(500).json({ success: false, message: 'Error on select', err });
    }

    if (!existingActivity) {
      const sqlInsert = `
        insert into activities (
          name, 
          description, 
          duration_minutes, 
          start_time, 
          end_time, 
          project_id, 
          user_id
        ) values (
          '${activity.name}',
          '${activity.description}',
          ${activity.durationMinutes},
          '${activity.startTime}',
          '${activity.endTime}',
          ${projectIDs[activity.tags]},
          ${userId}
        )
      `;

      try {
        await db.execute(sqlInsert);
      } catch(err) {
        return res.status(500).json({ success: false, message: 'Error on insert', err });
      }
    }
  }

  res.json({ success: true, activities });
});

module.exports = router;
