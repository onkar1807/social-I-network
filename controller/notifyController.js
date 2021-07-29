const Notify = require('../models/notify')


exports.createNotify = async (req, res) => {
    
    try {
        const { id, recipients, url, text, content, image } = req.body

        if(recipients.includes(req.user._id.toString())) return;

        const notify = new Notify({
            id, recipients, url, text, content, image, user: req.user._id
        })

        await notify.save();
        res.status(200).json({ notify })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}


exports.deleteNotify = async (req, res) => {
   
    try {
        const notify = await Notify.findOneAndDelete({
            id: req.params.id, url: req.query.url
        })

        res.status(200).json({ notify })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}


exports.getNotify = async (req, res) => {
   
    try {
        const notifies = await Notify.find({recipients: req.user._id})
        .sort('-createdAt')
        .populate('user', 'avatar username')

        res.status(200).json({ notifies })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}


exports.isReadNotify = async (req, res) => {
    try{

        const notify = await Notify.findOneAndUpdate({ _id: req.params.id}, {
            isRead: true
        })

        res.json({ notify })
    } catch(error) {
        return res.status(500).json({ msg: error.message })
    }
}


exports.deleteAllNotify = async (req, res) => {
    try{

        const notify = await Notify.deleteMany({recipients: req.user._id})

        res.json({ notify })
    } catch(error) {
        return res.status(500).json({ msg: error.message })
    }
}