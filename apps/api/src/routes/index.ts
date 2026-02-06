import { Router } from 'express';
import petRoutes from './pet.routes';
import scanRoutes from './scan.routes';
import vaccinationRoutes from './vaccination.routes';
import notificationRoutes from './notification.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Note: Auth routes are handled directly in index.ts

// API routes
router.use('/pets', petRoutes);
router.use('/scans', scanRoutes);
router.use('/vaccinations', vaccinationRoutes);
router.use('/notifications', notificationRoutes);

export default router;
