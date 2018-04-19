const express = require('express');
const multer  = require('multer');
// const cheerio = require('cheerio');
// const mysql = require('mysql2');
const slug = require('slug');

const verifyToken = require('./../verify-token');
const parseXml = require('./../parse-xml');
const DB = require('./../db');

const router = express.Router();
const upload = multer();
const db = new DB();

// const connection = mysql.createConnection({
//   host     : process.env.DB_HOST,
//   user     : process.env.DB_USER,
//   password : process.env.DB_PASSWD,
//   database : process.env.DB_NAME,
// });

// connection.connect();

// const parseXml = xml => {
//   const $ = cheerio.load(xml, { xmlMode: true });
//   let activities = [];

//   $('activity').each(function(i, el) {
//     activities.push({
//       category: $(this).attr('category'),
//       description: $(this).attr('description'),
//       durationMinutes: $(this).attr('duration_minutes'),
//       startTime: $(this).attr('start_time'),
//       endTime: $(this).attr('end_time'),
//       name: $(this).attr('name'),
//       tags: $(this).attr('tags'),
//     });
//   });

//   return activities;
// };

// async function insertProjects(activities) {
//   let tags = [];

//   activities.forEach(activity => {
//     if (tags.indexOf(activity.tags) === -1) {
//       tags.push(activity.tags);
//     }
//   });

//   for (let tag of tags) {
//     try {
//       const res = await connection.execute(
//         `INSERT INTO projects (name, slug)
//         VALUES ("${tag}", "${slug(tag)}");`
//       );
//       console.log(res);
//     } catch(e) {
//       console.error(e);
//     }
//   }

//   return tags;
// }

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
    const sql = `
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
      await db.execute(sql);
    } catch(err) {
      return res.status(500).json({ success: false, message: 'Error on insert', err });
    }
  }

  res.json({ success: true, activities });
});

module.exports = router;
