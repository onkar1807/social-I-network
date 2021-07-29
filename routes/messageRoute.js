const router = require('express').Router();
const { createMessage, 
        getConversation, 
        getMessages, 
        deleteMessages, 
        deleteConversation 
    } = require('../controller/messageController');
const auth = require('../middleware/auth');

router.post('/message', auth, createMessage);

router.get('/conversation', auth, getConversation);

router.get('/message/:id', auth, getMessages);

router.delete('/message/:id', auth, deleteMessages);

router.delete('/conversation/:id', auth, deleteConversation);


module.exports = router