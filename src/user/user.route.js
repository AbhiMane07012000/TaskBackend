const express = require('express');
const router = express. Router();
const {protect, superAdminOnly} = require('../auth/auth.middleware');
const {getUsers, updateUser, changeUserPassword} = require('./user.controller');


router.get('/',protect,superAdminOnly, getUsers);
router.patch('/:id', protect, superAdminOnly, updateUser);
router.put('/:id/password', protect, changeUserPassword);


module.exports = router;