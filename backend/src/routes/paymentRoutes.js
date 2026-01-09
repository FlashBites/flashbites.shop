const express = require('express');
const router = express.Router();
const {
  createStripePaymentIntent,
  createRazorpayOrder,
  verifyPayment,
  handlePaymentFailure,
  getPaymentByOrderId
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes require authentication

router.post('/stripe/create-intent', createStripePaymentIntent);
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);
router.post('/:id/fail', handlePaymentFailure);
router.get('/order/:orderId', getPaymentByOrderId);

module.exports = router;