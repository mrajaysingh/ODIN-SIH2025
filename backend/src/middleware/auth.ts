import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export interface AuthenticatedRequest extends Request {
	user?: {
		sub: string;
		email: string;
		[key: string]: unknown;
	};
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) return res.sendStatus(401);

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err || !decoded || typeof decoded !== 'object') return res.sendStatus(403);
		req.user = decoded as any;
		next();
	});
}
