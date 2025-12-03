import express from 'express'
import { registerUser, loginUser, logoutUser } from '../Controllers/auth.controller.js';
import {authenticationMiddleware} from '../Middlewares/authenticationMiddleware.js';
import { regenerateAccessToken } from '../Controllers/auth.controller.js';

const router = express.Router(); // create an instance of express.Router

router.post('/register', registerUser);
router.post('/newAccessToken', regenerateAccessToken);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
// -------------------------------- NOTE ------------------------------
// in future you have to write logout , refresh token, forgot password, reset password routes.

export default router;