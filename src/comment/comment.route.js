const express = require('express');
const router = express.Router();

const { createComment, updateComment ,deleteComment } = require('./comment.controller');
const { protect } = require('../auth/auth.middleware');

router.post('/', protect ,createComment);
router.patch('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);


module.exports = router;