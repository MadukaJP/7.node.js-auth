const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {internalServerError} = require("../utils/error-message");
const {JWT_SECRET_KEY} = require("../config");


// register
const registerUserController = async (req, res) => {
    try {
        const username = req.body ?. username
        const email = req.body ?. email
        const password = req.body ?. password
        const role = req.body ?. role

        if (! username || ! email || ! password) {
            return res.status(400).json({status: "error", message: "Bad request, Missing params"})
        }

        if ((typeof username !== 'string') || (typeof email !== 'string') || (typeof password !== 'string')) {
            return res.status(400).json({status: "error", message: "Invalid type, required type : { username: string, email: string, password: string, role?: string }"})
        }

        if (role && !(['user', 'admin']).includes(role)) {
            return res.status(400).json({status: "error", message: `${role} is an invalid role, valid roles : 'user' or 'admin'`})
        }

        const userExists = await User.exists({
            $or: [{
                    username
                }, {
                    email
                }]
        })

        if (userExists) {
            return res.status(409).json({status: "error", message: `username or email has already been taken`})
        }
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashed_password,
            role: role || 'user'
        })

        await newUser.save();

        return res.status(201).json({status: "success", message: 'User created successfully!', data: newUser})


    } catch (error) {
        internalServerError(error, res)
    }
}


// login controller
const loginUserController = async (req, res) => {
    try {
        const username = req.body ?. username
        const email = req.body ?. email
        const password = req.body ?. password

        if ((! username && ! email) || ! password) {
            return res.status(400).json({status: "error", message: "Bad request, Missing params"})
        }


        if ((username && typeof username !== 'string') || (email && typeof email !== 'string') || (typeof password !== 'string')) {
            return res.status(400).json({status: "error", message: "Invalid type, required type : { username: string, email: string, password: string, role?: string }"})
        }

        let user;

        if (username) {
            user = await User.findOne({username})
        } else {
            user = await User.findOne({email})
        }


        if (! user) {
            return res.status(404).json({status: "error", message: "User does not exist"})
        }

        const match = await bcrypt.compare(password, user.password);
        const {
            password: userPassword,
            ...safeUser
        } = user.toObject();
        if (match) {
            const accessToken = jwt.sign({
                userId: user._id,
                username: user.username,
                role: user.role
            }, JWT_SECRET_KEY, {expiresIn: '15m'})
            res.status(200).json({
                status: "success",
                data: {
                    access_token: accessToken,
                    user: safeUser
                }
            })
        } else {
            return res.status(400).json({status: "error", message: "Invalid user credentials"})
        }


    } catch (error) {
        internalServerError(error, res)
    }
}


// change password
const changePasswordController = async (req, res) => {
    try {
        const oldPassword = req.body ?. old_password
        const newPassword = req.body ?. new_password
        const userId = req.userInfo.userId

        if (! oldPassword || ! newPassword) {
            return res.status(400).json({
                status: "error", 
                message: "Old password and new password are required"
            })
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({
                status: "error", 
                message: "Old password and new password cannot be the same"
            })
        }

        const user =  await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: "error", 
                message: "User does not exist"})
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                status: "error", 
                message: "Old password is not correct"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashNewPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashNewPassword

        user.save()

        console.log("Password done!");

        return res.status(200).json({
            status: "success",
            message: "Password change successful!"
        })

    } catch (error) {
        internalServerError(error, res)
    }
}


module.exports = {
    registerUserController,
    loginUserController,
    changePasswordController
}
