import { Router } from 'express';
import { db } from '../config/database';
import { users, accounts, sessions } from '../db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const router = Router();

// Manual signup endpoint - bypasses Better Auth
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password (simple hash for emergency use)
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Create user
        const userId = crypto.randomUUID();
        await db.insert(users).values({
            id: userId,
            email,
            name,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Create account with password
        await db.insert(accounts).values({
            id: crypto.randomUUID(),
            userId,
            accountId: userId,
            providerId: 'credential',
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Create session
        const sessionToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await db.insert(sessions).values({
            id: crypto.randomUUID(),
            userId,
            token: sessionToken,
            expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.json({
            success: true,
            user: { id: userId, email, name },
            token: sessionToken,
        });
    } catch (error: any) {
        console.error('Manual signup error:', error);
        res.status(500).json({ error: error.message || 'Signup failed' });
    }
});

// Manual signin endpoint
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (user.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Find account and verify password
        const account = await db.select().from(accounts).where(eq(accounts.userId, user[0].id)).limit(1);
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        if (account.length === 0 || account[0].password !== hashedPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create session
        const sessionToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await db.insert(sessions).values({
            id: crypto.randomUUID(),
            userId: user[0].id,
            token: sessionToken,
            expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.json({
            success: true,
            user: { id: user[0].id, email: user[0].email, name: user[0].name },
            token: sessionToken,
        });
    } catch (error: any) {
        console.error('Manual signin error:', error);
        res.status(500).json({ error: error.message || 'Signin failed' });
    }
});

export default router;
