const Comment = require('../models/comment');
const Post = require('../models/post');

exports.createComment = async (req, res) => {
   
    try {
        const { postId, content, tag, reply, postUserId } = req.body;

        const post = await Post.findById(postId)
        if(!post) return res.status(400).json({ msg: "This post does not exist." })

        if(reply) {
            const cm = await Comment.findById(reply)
            if(!cm) return res.status(400).json({ msg: "This comment does not exist." })
        }

        const comment = new Comment({
            user: req.user._id,
            content, 
            tag, 
            reply,
            postUserId,
            postId
        })

        await Post.findOneAndUpdate({ _id: postId }, {
            $push: { comments: comment._id }
        }, {new: true})

        await comment.save()

        res.status(200).json({ comment })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


exports.updateComment = async (req, res) => {
    try {
        const { content } = req.body;

        await Comment.findOneAndUpdate({_id: req.params.id, user: req.user._id},
        { content })

        res.json({ msg: 'Update'})
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


exports.likeComment = async (req, res) => {
    try{
        await Comment.findOneAndUpdate({_id: req.params.id}, {
            $push: {likes: req.user._id}
        })

        res.json({ msg: 'Liked'})
        
    } catch(error) {
        return res.status(500).json({ msg: error.message })
    }
}


exports.dislikeComment = async (req, res) => {
    try{
        await Comment.findOneAndUpdate({_id: req.params.id}, {
            $pull: {likes: req.user._id}
        })

        res.json({ msg: 'Dislike'})

    } catch(error) {
        return res.status(500).json({ msg: error.message })
    }
}


exports.deleteComment = async (req, res) => {
    try{
        const comment = await Comment.findOneAndDelete({ 
            _id: req.params.id,
            $or: [
                {user: req.user._id},
                {postUserId: req.user._id}
            ]
        
        })

        await Post.findOneAndUpdate({ _id: comment.postId}, {
            $pull: {comments: req.params.id}
        })

        res.json({ msg: 'Deleted!'})
    } catch(error) {
        return res.status(500).json({ msg: error.message })
    }
}