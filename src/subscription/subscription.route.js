const express = require('express');
const router = express.Router();

const { createOrder } = require('./subscription.controller');
const { protect } = require('../auth/auth.middleware');

router.post('/create-order', protect, createOrder);

module.exports = router;