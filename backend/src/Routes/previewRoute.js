import { previewData } from "../Controllers/preview.controller.js";
import {authenticationMiddleware} from '../Middlewares/authenticationMiddleware.js';
import express from 'express'
import creditMiddleware from '../Middlewares/creditMiddleware.js';

const router = express.Router();

router.post('/messages', authenticationMiddleware, creditMiddleware, previewData);
export default router;