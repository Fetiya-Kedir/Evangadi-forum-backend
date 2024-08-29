const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

// Authentication middleware
async function authMiddleware(req, res, next) {
	const authHeader = req.headers.authorization;

	// Check if token exists and starts with "Bearer"
	if (!authHeader || !authHeader.startsWith('Bearer')) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ msg: 'Authentication invalid' });
	}

	const token = authHeader.split(' ')[1];

	try {
		// Verify token
		const { username, userid } = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { username, userid }; // Attach user info to request
		next();
	} catch (error) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ msg: 'Authentication invalid' });
	}
}

module.exports = authMiddleware;
