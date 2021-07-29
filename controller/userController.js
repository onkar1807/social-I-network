const User = require('../models/user');

// search user
exports.searchUser = async(req, res) => {
    try {
        const users = await User.find({ username: { $regex: req.query.username } })
        .limit(10).select("fullname username avatar")

        if(!users) return res.status(400).json({msg: "No user found."});

        res.status(200).json({ users })
    } catch (error) {
        return res.status(500).json({msg: error.message});
    }
}

// get user by its Id
exports.getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        .select('-password')
        .populate('followers following', '-password')

        if(!user) return res.status(400).json({msg: 'User does not found'});
        
        res.status(200).json({ user })
    } catch (error) {
        return res.status(500).json({msg: error.message});
    }
}

// update a user
exports.updateUser = async (req, res) => {
    
     try {
        const { avatar, userData: {
            mobile, fullname, gender, address, website, story
        } 
    } = req.body

    const updateUser = await User.findOneAndUpdate({ _id: req.user._id }, {
        avatar, mobile, fullname, gender, address, website, story
        },
        { new: true}
    )

        res.json({
            updateUser,
            msg: "Update Success!"
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}


// follow a user
exports.followUser = async(req, res) => {

    try {
        const user =  await User.find({_id: req.params.id, followers: req.user._id});
        if(user.length > 0) return res.status(400).json({msg: "You followed this user."});

        const newUser = await User.findOneAndUpdate({_id: req.params.id}, {
            $push: {followers: req.user._id}
        }, {new: true}).populate('followers following', '-password')

        await User.findOneAndUpdate({_id: req.user._id}, {
            $push: {following: req.params.id}
        }, {new: true})

        res.status(200).json({
            newUser,
            msg: "Followed user."
        })

    } catch (error) {
        return res.status(500).json({msg: err.message})
    }
}


// unfollow a user
exports.unfollowUser = async(req, res) => {

    try {
        const newUser = await User.findOneAndUpdate({_id: req.params.id}, {
            $pull: {followers: req.user._id}
        }, {new: true}).populate('followers following', '-password')

        await User.findOneAndUpdate({_id: req.user._id}, {
            $pull: {following: req.params.id}
        }, {new: true})

        res.status(200).json({
            newUser,
            msg: "unfollow user."
        })

    } catch (error) {
        return res.status(500).json({msg: err.message})
    }
}


// suggestions 
exports.suggestionUser = async(req, res) => {
    try {
        const newArr = [...req.user.following, req.user._id]

        const num = parseInt(req.query.num) || 10

        const users = await User.aggregate([
            { $match: { _id: { $nin: newArr } } },
            { $sample: { size: num } },
            { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
            { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
        ]).project('-password')

        res.status(200).json({ 
            users,
            result: users.length
        })
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}
