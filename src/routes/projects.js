const express = require('express');

const connection = require('./../connection');

const router = express.Router();

router.get('/', (req, res, next) => {
  connection.query('SELECT * from projects', (err, projects) => {
    if (projects) {
      res.json(projects);
    }
  });

});

module.exports = router;

