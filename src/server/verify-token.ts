import * as jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
  if (!req.headers['authorization']) {
    return res.status(403).send({ auth: false, message: 'Missing Authorization headers' });
  }

  const match = req.headers['authorization'].match(/Bearer (.+)/i);

  if (!match) {
    return res.status(403).send({ auth: false, message: 'Invalid token.' });
  }

  const token = match[1];

  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, { algorithm: 'HS256' }, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: 'Failed to authenticate token.' });
    }

    req.userId = decoded.data.id;
    req.username = decoded.data.username;

    next();
  });
}

export default verifyToken;