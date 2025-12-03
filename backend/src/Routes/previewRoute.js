import { previewData } from "../Controllers/preview.controller.js";
import {authenticationMiddleware} from '../Middlewares/authenticationMiddleware.js';
import express from 'express'

const router = express.Router();

router.post('/messages', authenticationMiddleware, previewData);

export default router;