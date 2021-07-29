const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');



//-----------------CREATE POST-----------------//
exports.createPost = async (req, res) => {
    try {
        const { content, images } = req.body;

        if(images.length === 0) {
            return res.status(400).json({ msg: "Please add your photo." })
        }

        const post = await new Post({
            content, 
            images,
            postBy: req.user._id
        }).save()

        res.json({
            post: {
                ...post._doc,
                postBy: req.user
            },
            msg: "Create Post!"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}


//-----------------GET POST-----------------//
exports.getPosts = async (req, res) => {
    // console.log([...req.user.following, req.user._id])
    try {
        
        const posts = await Post.find({
            postBy: [...req.user.following, req.user._id]
        })
        .sort('-createdAt')
        .populate('postBy likes', 'avatar username fullname followers')
        .populate({
            path: 'comments',
            populate: {
                path: 'user likes',
                select: '-password'
            }
        })

        res.json({
            posts,
            result: posts.length
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}


//-----------------EDIT POST-----------------//
exports.updatePost = async (req, res) => {
    const { content, images } = req.body;

    try {
        const post = await Post.findOneAndUpdate({ _id: req.params.id }, 
            {
                content, images
            }, 
            { new: true }
        )
        .populate('postBy likes', 'avatar username fullname')
        .populate({
            path: 'comments',
            populate: {
                path: 'user likes',
                select: '-password'
            }
        })

        res.status(200).json({
            msg: "Post Updated!",
            newPost: {
                ...post._doc,
                content, images
            }
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


//----------------- LIKE POST -----------------//
exports.likePost = async(req, res) => {
    try{
        const post = await Post.find({ _id: req.params.id, likes: req.user._id })
        if(post.length > 0) return res.status(400).json({ msg: "You liked post already" })
        
        await Post.findOneAndUpdate({_id: req.params.id}, {
            $push: {likes: req.user._id}
        }, { new: true })

        res.status(200).json({
            msg: 'Post Liked'
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}


//----------------- DISLIKE POST -----------------//
exports.dislikePost = async(req, res) => {
    try{
        await Post.findOneAndUpdate({_id: req.params.id}, {
            $pull: {likes: req.user._id}
        }, { new: true })

        res.status(200).json({
            msg: 'Post disLiked'
        })
    } catch(error) {
        return res.status(500).json({ msg: error.message })
    }
}


//--------------GET USER POST------------------// 
exports.getUserPost = async (req, res) => {
    try {
        const post = await Post.find({ postBy: req.params.id }).sort('-createdAt')
        res.json({ 
            post,
            result: post.length
        })

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


//--------------GET USER POST BY ID------------------//
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        .populate('postBy likes', 'avatar username fullname')
        .populate({
            path: 'comments',
            populate: {
                path: 'user likes',
                select: '-password'
            }
        })

        if(!post) return res.status(500).json({ msg: "This post does not exist." })

        res.json({  post })

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


//--------------DISCOVER POST------------------//
exports.discoverPost = async (req, res) => {
    try {

        const newArr = [...req.user.following, req.user._id]

        const num = req.query.num || 3

        const posts = await Post.aggregate([
            { $match: { postBy: {$nin: newArr } } },
            { $sample: { size: Number(num) } }
        ])
    
        res.json({
            result: posts.length,
            posts
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

//--------------DELETE POST------------------//
exports.deletePost = async (req, res) => {
    try {
       const post = await Post.findOneAndDelete({_id: req.params.id, postBy: req.user._id})
       await Comment.deleteMany({_id: { $in: post.comments }})
       
        res.status(200).json({
            post: {
                ...post,
                postBy: req.user
            },
            msg: "Post deleted"
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


//--------------SAVE POST------------------//
exports.savePost = async(req, res) => {
    try {

        const user = await User.find({_id: req.user._id, saved: req.params.id})
        if(user.length > 0) return res.status(500).json({ msg: "You saved this post." })

        const savedPost = await User.findOneAndUpdate({_id: req.user._id}, {
            $push: { saved: req.params.id }
        })

        res.status(200).json({
            savedPost,
            msg: 'Post Saved'
        })

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


//--------------UNSAVE POST------------------//
exports.unSavePost = async(req, res) => {
    try {

        const savedPost = await User.findOneAndUpdate({_id: req.user._id}, {
            $pull: { saved: req.params.id }
        })

        res.status(200).json({
            savedPost,
            msg: 'Post Unsaved'
        })

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


//--------------GET SAVED POST------------------//
exports.getSavedPost = async(req, res) => {
    try {

        let post = await Post.aggregate([
            { $match: {_id: { $in: req.user.saved } } }
        ]).project('-createdAt')

        res.status(200).json({
            post,
            result: post.length
        })

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


// const page = parseInt(req.query.page) || 1;
// const limit = parseInt(req.query.limit) || 3;
// const skip = (page - 1) * limit;
// const total = await Post.countDocuments()