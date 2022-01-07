import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { auth, findUserByEmail, JWT_SECRET, users } from './lib';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/auth/register', async (req, res) => {
	const { email, password, passwordConfirmed } = req.body;

	if (findUserByEmail(email)) {
		res.status(400);
		return res.json({ success: false, error: 'user already exists' });
	}

	const userId = crypto.randomBytes(16).toString('hex');
	const hash = await bcrypt.hash(password, 8);
	users.set(userId, { userId, email, password: hash, provider: 'local' });

	const token = jwt.sign({ userId }, JWT_SECRET);
	return res.json(token);
});

app.post('/auth/login', async (req, res) => {
	const { email, password } = req.body;

	const user = findUserByEmail(email);
	if (!user) {
		res.status(400);
		return res.json({ success: false, error: 'user does not exist' });
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		res.status(400);
		return res.json({ success: false, error: 'passwords do not match' });
	}

	const token = jwt.sign({ userId: user.userId }, JWT_SECRET);
	return res.json(token);
});

app.post('/auth/kakao', (req, res) => {
	//
});

app.post('/auth/validate', auth, (req, res) => {
	res.json(req.user);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`ON! -> http://localhost:${PORT}`));
