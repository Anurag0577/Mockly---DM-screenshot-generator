import addCreditsToAccount from '../Controllers/credit.controller.js';
import express from 'express';
import { authenticationMiddleware } from '../Middlewares/authenticationMiddleware.js';

const router = express.Router();

router.post('/add-credit', authenticationMiddleware, addCreditsToAccount);

export default router;