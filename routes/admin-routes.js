const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const router = express.Router();



router.get('/', authMiddleware, adminMiddleware, (req, res) => {
    const { userId, username, role } = req.userInfo

    return res.status(200).json({
        message: "Welcome to the admin page",
        user: {
            _id: userId,
            username: username,
            role: role
        }
    })
})



module.exports = router