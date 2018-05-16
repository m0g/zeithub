import { Router } from 'express';

import verifyToken from './../../verify-token';
import * as create from './create';
import * as getBankAccounts from './get-bank-accounts';

const router = Router();

router.post('/', verifyToken, create);
router.get('/', verifyToken, getBankAccounts);

export default router;