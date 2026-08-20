const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyPaymentStatus } = require('../controllers/paymentController');

// Route: Initiate PhonePe Order Payment
router.post('/create-order', createPaymentOrder);

// Route: Verify PhonePe Payment Status
router.post('/verify-status', verifyPaymentStatus);

module.exports = router;
