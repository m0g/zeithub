import { Router } from 'express';

import verifyToken from './../../verify-token';
import create from './create';
import list from './list';

const router = Router();

router.post('/', verifyToken, create);
router.get('/', verifyToken, list);

export default router;