const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const { registerUserController, loginUserController, changePasswordController } = require('../controllers/auth-controller');
const router = express.Router();


router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.post('/change-password', authMiddleware, changePasswordController);







module.exports = router;