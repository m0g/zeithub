import { Router } from 'express';

import verifyToken from './../../verify-token';
import create from './create';
import list from './list';
import remove from './remove';

const router = Router();

router.post('/', verifyToken, create);
router.get('/', verifyToken, list);
router.delete('/:id', verifyToken, remove);

export default router;