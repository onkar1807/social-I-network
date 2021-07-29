const express = require('express');
const { searchUser, 
        getUserById, 
        updateUser,
        followUser,
        unfollowUser,
        suggestionUser
    } = require('../controller/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/user',  searchUser);

router.get('/user/:userId', getUserById);

router.patch('/user', auth, updateUser);

router.patch('/user/:id/follow', auth, followUser);

router.patch('/user/:id/unfollow', auth, unfollowUser);

router.get('/suggestion_user', auth, suggestionUser)

module.exports = router;

