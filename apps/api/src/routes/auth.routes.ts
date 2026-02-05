import { Router, Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../config/auth';

const router = Router();

// Better Auth handles all auth routes
router.all('/*', (req: Request, res: Response) => {
    return toNodeHandler(auth)(req, res);
});

export default router;
