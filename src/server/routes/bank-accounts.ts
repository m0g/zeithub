import * as express from 'express';

import * as DB from './../db';
import verifyToken from './../verify-token';

const router = express.Router();
const db = new DB();

router.post('/', verifyToken, async (req, res) => {
  await db.init();

  res.json({ success: true });
});

export default router;