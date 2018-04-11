const express = require('express');
const multer  = require('multer');
const cheerio = require('cheerio');
const mysql = require('mysql');

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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('hamster');
});

router.post('/', upload.single('xml'), (req, res, next) => {
  const file = req.file;

  if (file) {
    const xml = Buffer.from(file.buffer, file.encoding).toString('utf8');
    const data = parseXml(xml);

    console.log(data);
  }
});

module.exports = router;
