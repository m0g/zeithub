const express = require('express');
const mysql = require('mysql2');

const router = express.Router();

const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWD,
  database : process.env.DB_NAME,
});

connection.connect();

router.get('/', (req, res, next) => {
  connection.query('SELECT * from projects', (err, projects) => {
    if (projects) {
      res.json(projects);
    }
  });

});

module.exports = router;

