const express = require('express');
const { getDashboardData } = require('./dashboard.controller');
const { protect } = require('../auth/auth.middleware');

const router = express.Router();

router.get('/', protect, getDashboardData);

module.exports = router;