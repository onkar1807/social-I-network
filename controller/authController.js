const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { json } = require('express');

//-------------------USER REGISTRATION-----------------------//

exports.userRegister = async (req, res) => {
    try {
        const { fullname, username, email, password, gender } = req.body;
        const newUsername = username.toLowerCase().replace(/ /g, '');

        const new_user = await User.findOne({ username: newUsername });
        if (new_user) return res.status(400).json({ msg: 'This username is already exist.' });

        const new_email = await User.findOne({ email });
        if (new_email) return res.status(400).json({ msg: 'This email is already exist.' });

        if (password.length < 6)
            return res.status(400).json({ msg: 'Password must be atleast 6 characters.' });

        const hashPassword = await bcrypt.hash(password, 14)

        const newUser = new User({
            fullname,
            username: newUsername,
            email,
            password: hashPassword,
            gender
        })

        const access_token = createAccessToken({ id: newUser._id });
        const refresh_token = createRefreshToken({ id: newUser._id });

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/refresh_token',
            maxAge: 30 * 7 * 24 * 60 * 60 * 1000
        })

        await newUser.save();

        res.status(200).json({
            msg: 'Register Success!',
            access_token,
            user: {
                ...newUser._doc,
                password: ''
            }
        })

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

//-------------------USER LOGIN-----------------------//

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })
            .populate("followers following", "avatar username fullname followers following")
            .exec()

        if (!user) return res.status(400).json({ msg: "This email does not exist!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Password is incorrect!" });

        const access_token = createAccessToken({ id: user._id });
        const refresh_token = createRefreshToken({ id: user._id });

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/refresh_token',
            maxAge: 30 * 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            msg: 'Login Success!',
            access_token,
            user: {
                ...user._doc,
                password: ''
            }
        })

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

//-------------------USER LOGOUT-----------------------//

exports.Logout = async (req, res) => {
    try {
        // res.clearCookie('refreshtoken', {
        //     path: '/api/refresh_token'
        // })

        res.clearCookie('access_token')

        res.status(200).json({
            msg: 'Logged out!'
        })
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

//-------------------USER GENERATEACCESSTOKEN-----------------------//

exports.generateAccessToken = async (req, res) => {
    try {
        const rf_token = req.cookies.refreshtoken
        console.log(rf_token)

        if (!rf_token) return res.status(400).json({ msg: "Please login now...." })

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRETE, async (err, result) => {
            // console.log(err)
            if (err) return res.status(400).json({ msg: "Please login now." })

            const user = await User.findById(result.id).select("-password")
                .populate('followers following', 'avatar username fullname followers following')

            if (!user) return res.status(400).json({ msg: "This user does not exist." })

            const access_token = createAccessToken({ id: result.id })

            res.json({
                access_token,
                user
            })
        })
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRETE, { expiresIn: '30d' });
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRETE, { expiresIn: '30d' });
}