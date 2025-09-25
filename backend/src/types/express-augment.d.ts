import 'express';

declare module 'express-serve-static-core' {
	interface Request {
		user?: {
			sub: string;
			email: string;
			[key: string]: unknown;
		};
		rawBody?: string;
	}
}
