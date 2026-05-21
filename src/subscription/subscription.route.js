const express = require('express');
const router = express.Router();

const { createOrder } = require('./subscription.controller');
const { protect } = require('../auth/auth.middleware');

router.post('/create-order', protect, createOrder);
//Add Payment verification route here in future
//router.post('/verify-payment', protect, verifyPayment);

// Add getMySubscription route here in future
//router.get('/my-subscription', protect, getMySubscription);

// Add cancel subscription route here in future
//router.post('/cancel-subscription', protect, cancelSubscription);

module.exports = router;