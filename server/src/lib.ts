import { Handler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const users = new Map<string, UserType>();
export const JWT_SECRET = '293c3530730a20397e1d16ee9dba9412';

export const findUserByEmail = (email: string) => {
	for (const [key, value] of users) {
		if (value.email === email) {
			return { ...value, userId: key };
		}
	}
	return null;
};

export const auth: Handler = async (req, res, next) => {
	const token = req.headers.authorization?.split('Bearer')[1].trim();

	if (!token) {
		res.status(401);
		return res.json({ success: false, error: 'no token' });
	}

	const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
	const user = users.get(payload.userId);
	if (!user) {
		res.status(401);
		return res.json({ success: false, error: 'user does not exists' });
	}

	const { password, ...restInfo } = user;
	req.user = restInfo;
	next();
};

type UserType = {
	userId: string;
	email: string;
	provider: string;
	password: string;
};
