import { createOrder , verifyPayment } from "../Controllers/payment.controller.js";

import express from "express";

const router = express.Router();

router.post('/create-order', createOrder)
router.post('/verify-payment', verifyPayment)

export default router;