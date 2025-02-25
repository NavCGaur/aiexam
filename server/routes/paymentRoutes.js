import express from 'express';
import {
  createOrder,
  updatePayment,
  verifyPayment,
  handleWebhook,
} from '../controllers/paymentControllers.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.get('/update-payment/:orderId', updatePayment);
router.get('/verify/:orderId', verifyPayment);
router.post('/webhook/cashfree', handleWebhook);

export default router;