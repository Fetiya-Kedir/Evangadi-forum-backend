const express = require('express');
const router = express.Router();

//authentication middleware
const authMiddleware = require('../middleware/authMiddleware');
//user controllers
const {
	register,
	login,
	checkUser,
	getuser,
} = require('../controller/userController');

//register route
router.post('/register', register);

// login user
router.post('/login', login);

//get user
router.get('/getuser', getuser);

// check user
router.get('/check', authMiddleware, checkUser);
module.exports = router;
