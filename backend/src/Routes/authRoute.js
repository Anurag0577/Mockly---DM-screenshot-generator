import express from 'express'
import { registerUser, loginUser, logoutUser } from '../Controllers/auth.controller.js';
import {authenticationMiddleware} from '../Middlewares/authenticationMiddleware.js';

const router = express.Router(); // create an instance of express.Router

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', authenticationMiddleware, logoutUser);
// in future you have to write logout , refresh token, forgot password, reset password routes.

export default router;