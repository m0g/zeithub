var express = require('express');
var bcrypt = require('bcrypt');

const connection = require('./../connection');

var router = express.Router();
const saltRounds = parseInt(process.env.BCRYPT_SALT);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  if (req.body.name && req.body.password) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        connection.execute(
          'insert into users (name, password) values (?, ?)',
          [req.body.name, hash],
          function(err, results, fields) {
            res.json(results);
          }
        );
      });
    });
  }
});

module.exports = router;
