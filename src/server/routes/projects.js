const express = require('express');

const connection = require('./../connection');
const verifyToken = require('./../verify-token');

const router = express.Router();

router.get('/', verifyToken, (req, res, next) => {
  console.log('username', req.username, req.userId);
  connection.query('SELECT * from projects', (err, projects) => {
    if (projects) {
      res.json(projects);
    }
  });

});

module.exports = router;

