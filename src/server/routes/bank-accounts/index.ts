import { Router } from 'express';

import verifyToken from './../../verify-token';
import * as create from './create';

const router = Router();

router.post('/', verifyToken, create);

export default router;