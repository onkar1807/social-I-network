const express = require('express');
const { createPost, 
        getPosts, 
        updatePost, 
        deletePost, 
        likePost, 
        dislikePost, 
        getUserPost,
        getPostById,
        discoverPost,  
        savePost,
        unSavePost, 
        getSavedPost
    } = require('../controller/postController');

const auth = require('../middleware/auth');
const router = express.Router();

router.route('/posts')
    .post(auth, createPost)
    .get(auth, getPosts)

router.route('/post/:id')
    .patch(auth, updatePost)
    .delete(auth, deletePost)


router.get('/user_posts/:id', getUserPost)

router.patch('/post/:id/like', auth, likePost)
router.patch('/post/:id/dislike', auth, dislikePost)
   
router.get('/post/:id', getPostById)

router.get('/post_discover', auth, discoverPost)

router.patch('/save_post/:id', auth, savePost)
router.patch('/unsave_post/:id', auth, unSavePost)

router.get('/saved_post', auth, getSavedPost)



module.exports = router;