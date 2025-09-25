import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma';
import { withOptimize } from '@prisma/extension-optimize';
import { authenticateToken } from './middleware/auth';
import { verifyRequestSignature, signResponseBody } from './middleware/signature';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const prisma = new PrismaClient().$extends(
  withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY || '' })
);

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
	(req as any).rawBody = JSON.stringify(req.body ?? {});
	next();
});
app.use(signResponseBody);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_production';

// Health check (signed response)
app.get('/health', (_req, res) => {
	res.json({ status: 'ok' });
});

// Register (signed request optional)
app.post('/auth/register', verifyRequestSignature, async (req, res) => {
	try {
		const { email, password, name, username } = req.body as { email: string; password: string; name?: string; username?: string };
		if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

		if (username) {
			const existingByUsername = await prisma.user.findUnique({ where: { username } });
			if (existingByUsername) return res.status(409).json({ message: 'Username already taken' });
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) return res.status(409).json({ message: 'User already exists' });

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({ data: { email, passwordHash, name, username } });
		const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
		res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, username: user.username } });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal server error' });
	}
});

// Username availability
app.get('/auth/username-available', async (req, res) => {
  try {
    const username = (req.query.username as string | undefined)?.trim();
    if (!username) return res.status(400).json({ available: false, message: 'username query param required' });
    const existing = await prisma.user.findUnique({ where: { username } });
    return res.json({ available: !existing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ available: false, message: 'Internal server error' });
  }
});

// Login (signed request optional)
app.post('/auth/login', verifyRequestSignature, async (req, res) => {
	try {
		const { email, password } = req.body as { email: string; password: string };
		if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });

		const match = await bcrypt.compare(password, user.passwordHash);
		if (!match) return res.status(401).json({ message: 'Invalid credentials' });

		const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
		res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal server error' });
	}
});

// Password Reset (bypasses validation as requested)
app.post('/auth/reset-password', async (req, res) => {
	try {
		const { email, newPassword } = req.body as { email: string; newPassword: string };
		if (!email || !newPassword) return res.status(400).json({ message: 'Email and new password required' });

		// Find user by email
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(404).json({ message: 'User not found' });

		// Hash the new password
		const passwordHash = await bcrypt.hash(newPassword, 10);

		// Update the password in database
		await prisma.user.update({
			where: { email },
			data: { passwordHash }
		});

		res.json({ message: 'Password updated successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal server error' });
	}
});

// Example protected + signed route
app.get('/me', authenticateToken, verifyRequestSignature, async (req, res) => {
	const userId = (req as any).user?.sub as string | undefined;
	if (!userId) return res.sendStatus(401);
	const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
	res.json({ user });
});

io.on('connection', (socket) => {
	console.log('socket connected', socket.id);
	socket.on('disconnect', () => {
		console.log('socket disconnected', socket.id);
	});
});

server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
