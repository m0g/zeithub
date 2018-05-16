import { Router } from 'express';

import verifyToken from './../../verify-token';
import create from './create';

const router = Router();

router.post('/', verifyToken, create);