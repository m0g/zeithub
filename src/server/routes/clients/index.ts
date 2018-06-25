import { Router } from 'express';

import verifyToken from './../../verify-token';
import list from './list';

const router = Router();

router.get('/', verifyToken, list);

export default router;