const express = require('express');
const { getAllUsersController } = require('../controllers/user-controller');
const router = express.Router();



router.get('/', getAllUsersController);




module.exports = router;