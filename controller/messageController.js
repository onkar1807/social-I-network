const Conversation = require('../models/conversation')
const Message = require('../models/message')


class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}


exports.createMessage = async (req, res) => {
    try {
        const { sender, recipient, text, media, call } = req.body;

        if(!recipient || (!text.trim() && media.length === 0 && !call)) return;

        const newConversation = await Conversation.findOneAndUpdate({
            $or: [
                {recipients: [sender, recipient]},
                {recipients: [recipient, sender]}
            ]
        }, {
            recipients: [sender, recipient],
            text,
            media,
            call
        }, 
            { new: true, upsert: true }
        )

        const newMessage = new Message({
            conversation: newConversation._id,
            sender,
            recipient, 
            text, 
            media,
            call
        })

        await newMessage.save()

        res.json({ 
            message: newMessage,
            newConversation
        })

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


exports.getConversation = async (req, res) => {
    try {
        const conversations = await Conversation.find({ recipients: req.user._id })
        .sort('-updatedAt')
        .populate('recipients', 'avatar username fullname')

        res.json({ 
            conversations
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


exports.getMessages = async (req, res) => {
    try {
       
        const messages = await Message.find({
            $or: [
                {sender: req.user._id, recipient: req.params.id},
                {sender: req.params.id, recipient: req.user._id},
            ]
        }).sort('-createdAt')


        // const features = new APIfeatures(Messages.find({
        //     $or: [
        //         {sender: req.user._id, recipient: req.params.id},
        //         {sender: req.params.id, recipient: req.user._id}
        //     ]
        // }), req.query).paginating()

        // const messages = await features.query.sort('-createdAt')

        res.json({ 
            messages,
            result: messages.length 
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


exports.deleteMessages = async (req, res) => {
    try {
       
        await Message.findOneAndDelete({_id: req.params.id, sender: req.user._id})

        res.json({msg: 'Deleted!'})
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


exports.deleteConversation = async (req, res) => {
    try {
       
        const newConver = await Conversation.findOneAndDelete({
            $or: [
                {recipients: [req.user._id, req.params.id]},
                {recipients: [req.params.id, req.user._i]}
            ]
        })

        if(newConver){
            await Message.deleteMany({conversation: newConver._id})
        }

        res.json({msg: 'Deleted!'})
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}