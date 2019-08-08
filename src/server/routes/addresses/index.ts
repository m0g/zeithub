import { Router } from 'express';

import verifyToken from './../../verify-token';
import create from './create';
import list from './list';
import remove from './remove';
import update from './update';

const router = Router();

router.post('/', verifyToken, create);
router.get('/', verifyToken, list);
router.delete('/:id', verifyToken, remove);
router.put('/:id', verifyToken, update);

export default router;
