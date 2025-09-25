import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const SIGNING_SECRET = process.env.SIGNING_SECRET || 'change_me_signing_secret';
const TOLERANCE_MS = process.env.SIGNATURE_TOLERANCE_MS ? parseInt(process.env.SIGNATURE_TOLERANCE_MS, 10) : 5 * 60 * 1000;

function computeSignature(payload: string, timestamp: string) {
	const hmac = crypto.createHmac('sha256', SIGNING_SECRET);
	hmac.update(`${timestamp}.${payload}`);
	return hmac.digest('hex');
}

export function verifyRequestSignature(req: Request, res: Response, next: NextFunction) {
	try {
		const signature = req.header('x-signature');
		const timestamp = req.header('x-timestamp');
		
		// Skip signature verification in development if headers are missing
		if (process.env.NODE_ENV === 'development' && (!signature || !timestamp)) {
			console.log('Skipping signature verification in development mode');
			return next();
		}
		
		if (!signature || !timestamp) return res.status(400).json({ message: 'Missing signature headers' });

		const ts = Number(timestamp);
		if (!Number.isFinite(ts)) return res.status(400).json({ message: 'Invalid timestamp' });
		if (Math.abs(Date.now() - ts) > TOLERANCE_MS) return res.status(400).json({ message: 'Stale request' });

		const rawBody = (req as any).rawBody ?? JSON.stringify(req.body ?? {});
		const expected = computeSignature(rawBody, timestamp);
		if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
			return res.status(401).json({ message: 'Invalid signature' });
		}

		next();
	} catch (err) {
		return res.status(401).json({ message: 'Signature verification failed' });
	}
}

export function signResponseBody(req: Request, res: Response, next: NextFunction) {
	const originalJson = res.json.bind(res);
	res.json = (body?: any) => {
		try {
			const payload = JSON.stringify(body ?? {});
			const timestamp = Date.now().toString();
			const signature = computeSignature(payload, timestamp);
			res.setHeader('x-response-timestamp', timestamp);
			res.setHeader('x-response-signature', signature);
			return originalJson(body);
		} catch {
			return originalJson(body);
		}
	};
	next();
}
