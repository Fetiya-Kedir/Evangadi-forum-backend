const express = require('express');
const router = express.Router();

// Authentication middleware (if needed)
const authMiddleware = require('../middleware/authMiddleware');

// Controller functions
const {
	postquestion,
	getallquestions,
	getquestionbyid,
} = require('../controller/questionController');

// Define routes
router.post('/postquestion', postquestion);
router.get('/getallquestions', getallquestions);
router.get('/getquestion/:questionid', getquestionbyid); // Add this route

module.exports = router;
