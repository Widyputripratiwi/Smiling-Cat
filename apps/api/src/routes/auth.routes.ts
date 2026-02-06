import { Router } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../config/auth';

const router = Router();

// Better Auth handles all auth routes - use middleware pattern
const authHandler = toNodeHandler(auth);
router.use('/', (req, res, next) => {
    authHandler(req, res).catch(next);
});

export default router;
