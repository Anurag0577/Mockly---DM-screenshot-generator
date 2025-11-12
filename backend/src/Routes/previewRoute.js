import { previewData } from "../Controllers/preview.controller.js";
import express from 'express'

const router = express.Router();

router.post('/messages', previewData);

export default router;