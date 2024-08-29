const dbConnection = require('../db/dbConfig');
const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

// User registration controller
async function register(req, res) {
	const { username, firstname, lastname, email, password } = req.body;

	if (!email || !password || !firstname || !lastname || !username) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: 'Please provide all required information' });
	}

	try {
		// Check if the user already exists
		const [user] = await dbConnection.query(
			'SELECT username, userid FROM users WHERE username = ? OR email = ?',
			[username, email]
		);

		if (user.length > 0) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ msg: 'User already registered' });
		}

		if (password.length < 8) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ msg: 'Password must be at least 8 characters' });
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Insert new user into database
		await dbConnection.query(
			'INSERT INTO users(username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)',
			[username, firstname, lastname, email, hashedPassword]
		);

		return res
			.status(StatusCodes.CREATED)
			.json({ msg: 'User registered successfully' });
	} catch (error) {
		console.log(error.message);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ msg: 'Something went wrong, try again later!' });
	}
}

// User login controller
async function login(req, res) {
	const { email, password } = req.body;

	if (!email || !password) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: 'Please enter all required fields' });
	}

	try {
		// Check if user exists
		const [user] = await dbConnection.query(
			'SELECT username, userid, password FROM users WHERE email = ?',
			[email]
		);

		if (user.length === 0) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ msg: 'Invalid credentials' });
		}

		// Compare password
		const isMatch = await bcrypt.compare(password, user[0].password);

		if (!isMatch) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ msg: 'Invalid credentials' });
		}

		const { username, userid } = user[0];
		const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
			expiresIn: '1d',
		});

		return res
			.status(StatusCodes.OK)
			.json({ msg: 'User login successful', token, username });
	} catch (error) {
		console.log(error.message);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ msg: 'Something went wrong, try again later!' });
	}
}

// Check if the user is authenticated
async function checkUser(req, res) {
	const { username, userid } = req.user;
	res.status(StatusCodes.OK).json({ msg: 'Valid user', username, userid });
}

// Get all users
async function getuser(req, res) {
	try {
		const [users] = await dbConnection.query('SELECT * FROM users');
		return res.status(StatusCodes.OK).json(users);
	} catch (error) {
		console.log(error.message);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ msg: 'Something went wrong, try again later!' });
	}
}

module.exports = {
	register,
	login,
	checkUser,
	getuser,
};
