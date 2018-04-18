const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const match = req.headers['authorization'].match(/Bearer (.+)/i);

  if (!match) {
    return res.status(403).send({ auth: false, message: 'Invalid token.' });
  }

  const token = match[1];

  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }

  console.log(token);

  jwt.verify(token, process.env.JWT_SECRET, { algorithm: 'HS256' }, function(err, decoded) {
    console.log('err', err, decoded);
    if (err)
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    // if everything good, save to request for use in other routes
    req.userId = decoded.data.id;
    req.username = decoded.data.username;
    next();
  });
}

module.exports = verifyToken;