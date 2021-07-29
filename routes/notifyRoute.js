const router = require('express').Router();
const { createNotify, deleteNotify, getNotify, isReadNotify, deleteAllNotify } = require('../controller/notifyController');
const auth = require('../middleware/auth');

router.post('/notify', auth, createNotify);

router.delete('/notify/:id', auth, deleteNotify);

router.get('/notify', auth, getNotify);

router.patch('/isReadNotify/:id', auth, isReadNotify);

router.delete('/delete_Notify', auth, deleteAllNotify);

module.exports = router