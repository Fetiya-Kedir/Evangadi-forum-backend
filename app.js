require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
//db connection
const dbConnection = require('./db/dbConfig');

//user routes middleware file
const userRoutes = require('./routes/userRoute');

//question routes middleware file
const questionRoutes = require('./routes/questionRoute');

//answer routes middleware
const answerRoutes = require('./routes/answerRoute');


const authMiddleware = require('./middleware/authMiddleware');

app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/questions', questionRoutes);
// answers routes middleware
app.use('/api/answers', answerRoutes);

async function start() {
	try {
		const result = await dbConnection.execute("SELECT 'test'");
		await app.listen(port);
		console.log('database connection established');
		console.log(`listening on port ${port}`);
	} catch (error) {
		console.log(error.message);
	}
}
start();
