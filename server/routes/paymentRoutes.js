const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyPaymentStatus } = require('../controllers/paymentController');

// Route: Initiate Cashfree Live Order Payment
router.post('/create-order', createPaymentOrder);

// Route: Verify Cashfree Live Payment Status
router.post('/verify-status', verifyPaymentStatus);

module.exports = router;
