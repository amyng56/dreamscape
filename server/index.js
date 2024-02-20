import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
import dalle from './routes/dalle.js';
import posts from './routes/posts.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

app.use('/api/auth', auth);
app.use('/api/user', users);
app.use('/api/dalle', dalle);
app.use('/api/post', posts);

app.get('/', async (req, res) => {
    res.status(200).send('Hello from Dreamscape!')
});

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(8080, () => console.log('Server has started on port http://localhost:8080'));
    } catch (error) {
        console.log(err);
    }
};

startServer();