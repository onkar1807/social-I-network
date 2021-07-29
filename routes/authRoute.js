const express = require('express');
const { userRegister, 
        userLogin, 
        Logout, 
        generateAccessToken } = require('../controller/authController');
const router = express.Router();

router.post('/register', userRegister);

router.post('/login', userLogin);

router.post('/logout', Logout);

router.post('/refresh_token', generateAccessToken);

module.exports = router;



// npm i -g nodemon@debug