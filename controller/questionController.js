const dbConnection = require('../db/dbConfig');
const { v4: uuidv4 } = require('uuid');

// Fetch all questions
async function getallquestions(req, res) {
	try {
		// Retrieve all questions from the database
		const [questions] = await dbConnection.query('SELECT * FROM questions');

		return res.status(200).json(questions);
	} catch (error) {
		console.log(error.message);
		return res
			.status(500)
			.json({ msg: 'Something went wrong, try again later!' });
	}
}

// Fetch a single question by questionid
async function getquestionbyid(req, res) {
	const { questionid } = req.params;
	console.log('Fetching question with ID:', questionid); // Log the questionid

	try {
		const [question] = await dbConnection.query(
			'SELECT * FROM questions WHERE questionid = ?',
			[questionid]
		);
		console.log('Fetched question:', question); // Log the result of the query

		if (question.length === 0) {
			return res.status(404).json({ msg: 'Question not found' });
		}

		return res.status(200).json(question[0]);
	} catch (error) {
		console.log(error.message);
		return res
			.status(500)
			.json({ msg: 'Something went wrong, try again later!' });
	}
}

// Post a new question
async function postquestion(req, res) {
	const { title, description, userid } = req.body;

	try {
		const questionid = uuidv4();

		await dbConnection.query(
			'INSERT INTO questions (title, description, userid, questionid) VALUES (?, ?, ?, ?)',
			[title, description, userid, questionid]
		);

		return res.status(200).json({ msg: 'Question posted' });
	} catch (error) {
		console.log(error.message);
		return res
			.status(500)
			.json({ msg: 'Something went wrong, try again later!' });
	}
}

module.exports = { postquestion, getallquestions, getquestionbyid };
