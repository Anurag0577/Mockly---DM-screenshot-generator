import express from 'express';
const router = express.Router();
import messagesData from '../Controllers/messageController';

router.post('/messages', messagesData);

export default messageRoute;