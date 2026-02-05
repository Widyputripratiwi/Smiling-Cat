import { Router } from 'express';
import authRoutes from './auth.routes';
import petRoutes from './pet.routes';
import scanRoutes from './scan.routes';
import vaccinationRoutes from './vaccination.routes';
import notificationRoutes from './notification.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes (handled by Better Auth)
router.use('/auth', authRoutes);

// API routes
router.use('/pets', petRoutes);
router.use('/scans', scanRoutes);
router.use('/vaccinations', vaccinationRoutes);
router.use('/notifications', notificationRoutes);

export default router;
