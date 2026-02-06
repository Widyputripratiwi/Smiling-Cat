import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { db } from '../config/database';
import { sessions, users } from '../db/schema';
import { eq, and, gt } from 'drizzle-orm';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
    };
    session?: {
        id: string;
        userId: string;
        token: string;
        expiresAt: Date;
    };
}

export async function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // First, check for Bearer token (manual auth)
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.substring(7);

            // Find session by token
            const sessionResult = await db
                .select()
                .from(sessions)
                .where(and(
                    eq(sessions.token, token),
                    gt(sessions.expiresAt, new Date())
                ))
                .limit(1);

            if (sessionResult.length > 0) {
                const session = sessionResult[0];

                // Get user
                const userResult = await db
                    .select()
                    .from(users)
                    .where(eq(users.id, session.userId))
                    .limit(1);

                if (userResult.length > 0) {
                    req.user = {
                        id: userResult[0].id,
                        email: userResult[0].email,
                        name: userResult[0].name,
                    };
                    req.session = {
                        id: session.id,
                        userId: session.userId,
                        token: session.token,
                        expiresAt: session.expiresAt,
                    };
                    next();
                    return;
                }
            }
        }

        // Fallback to Better Auth session
        const headers = fromNodeHeaders(req.headers);
        const session = await auth.api.getSession({
            headers: headers,
        });

        if (!session) {
            console.log('Unauthorized request to:', req.originalUrl);
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
        };
        req.session = {
            id: session.session.id,
            userId: session.session.userId,
            token: session.session.token,
            expiresAt: session.session.expiresAt,
        };

        next();
    } catch (_error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
}

export function optionalAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    auth.api
        .getSession({
            headers: fromNodeHeaders(req.headers),
        })
        .then((session) => {
            if (session) {
                req.user = {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.name,
                };
                req.session = {
                    id: session.session.id,
                    userId: session.session.userId,
                    token: session.session.token,
                    expiresAt: session.session.expiresAt,
                };
            }
            next();
        })
        .catch(() => {
            next();
        });
}
