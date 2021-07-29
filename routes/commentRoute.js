const express = require('express');
const { createComment, 
        updateComment, 
        likeComment, 
        dislikeComment, 
        deleteComment } = require('../controller/commentController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/comment', auth, createComment);

router.patch('/comment/:id/update', auth, updateComment);

router.patch('/comment/:id/like', auth, likeComment);

router.patch('/comment/:id/dislike', auth, dislikeComment);

router.delete('/comment/:id', auth, deleteComment)

module.exports = router;