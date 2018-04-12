const express = require('express');
const multer  = require('multer');
const cheerio = require('cheerio');
const mysql = require('mysql2');
const slug = require('slug');

const renderer = require('./../renderer');
const Hamster = require('./../components/hamster');

const router = express.Router();
const upload = multer();

const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWD,
  database : process.env.DB_NAME,
});

connection.connect();

const parseXml = xml => {
  const $ = cheerio.load(xml, { xmlMode: true });
  let activities = [];

  $('activity').each(function(i, el) {
    activities.push({
      category: $(this).attr('category'),
      description: $(this).attr('description'),
      durationMinutes: $(this).attr('duration_minutes'),
      startTime: $(this).attr('start_time'),
      endTime: $(this).attr('end_time'),
      name: $(this).attr('name'),
      tags: $(this).attr('tags'),
    });
  });

  return activities;
};

async function insertProjects(activities) {
  let tags = [];

  activities.forEach(activity => {
    if (tags.indexOf(activity.tags) === -1) {
      tags.push(activity.tags);
    }
  });

  for (let tag of tags) {
    try {
      const res = await connection.execute(
        `INSERT INTO projects (name, slug)
        VALUES ("${tag}", "${slug(tag)}");`
      );
      console.log(res);
    } catch(e) {
      console.error(e);
    }
  }

  return tags;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  renderer.renderToString(Hamster(), (err, html) => {
    res.end(html);
  })
});

router.post('/', upload.single('xml'), (req, res, next) => {
  const file = req.file;

  if (file) {
    const xml = Buffer.from(file.buffer, file.encoding).toString('utf8');
    const data = parseXml(xml);

    console.log(data);
    // TODO: insert projects if not exists
    console.log(insertProjects(data));

    // TODO: insert activities
  }
});

module.exports = router;
