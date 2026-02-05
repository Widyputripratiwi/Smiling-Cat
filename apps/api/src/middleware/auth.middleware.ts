import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/auth';
import { fromNodeHeaders } from 'better-auth/node';

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
        const headers = fromNodeHeaders(req.headers);
        const session = await auth.api.getSession({
            headers: headers,
        });

        if (!session) {
            console.log('Unauthorized request to:', req.originalUrl);
            console.log('Cookie header:', req.headers.cookie);
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
