import { Router } from 'express';

import verifyToken from './../../verify-token';
import * as create from './create';
import * as getBankAccounts from './get-bank-accounts';
import * as deleteBankAccount from './delete';

const router = Router();

router.post('/', verifyToken, create);
router.get('/', verifyToken, getBankAccounts);
router.delete('/:iban', verifyToken, deleteBankAccount);

export default router;