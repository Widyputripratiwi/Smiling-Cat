import { Router, Response } from 'express';
import { scanService } from '../services/scan.service';
import { petService } from '../services/pet.service';
import { notificationService } from '../services/notification.service';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { uploadMemory } from '../middleware/upload.middleware';
import { sendSuccess, sendCreated, sendError } from '../utils/response';
import { roboflowService } from '../services/roboflow.service';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

router.use(authMiddleware);

// GET /api/scans - Get all scans for user's pets
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const pets = await petService.findAllByUserId(req.user!.id);
        const allScans = await Promise.all(
            pets.map((pet) => scanService.findAllByPetId(pet.id))
        );
        sendSuccess(res, allScans.flat());
    } catch (_error) {
        sendError(res, 'Failed to fetch scans', 500);
    }
});

// GET /api/scans/:id - Get scan by ID
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const result = await scanService.findByIdWithSymptoms(req.params.id as string);
        if (!result) {
            sendError(res, 'Scan not found', 404);
            return;
        }
        sendSuccess(res, result);
    } catch (_error) {
        sendError(res, 'Failed to fetch scan', 500);
    }
});

// POST /api/scans - Create new scan with image upload
router.post(
    '/',
    uploadMemory.single('image'),
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const { petId, imageUrl: providedImageUrl } = req.body;

            if (!petId) {
                sendError(res, 'Pet ID is required', 400);
                return;
            }

            // Verify pet ownership
            const pet = await petService.findById(petId);
            if (!pet || pet.userId !== req.user!.id) {
                sendError(res, 'Pet not found or unauthorized', 404);
                return;
            }

            let scan;
            let imageUrl = providedImageUrl;

            // If image file uploaded, save it locally to get a URL, then process with Roboflow
            if (req.file) {
                // Save locally to serve the image to frontend
                const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
                const uploadDir = path.join(process.cwd(), 'uploads');

                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);

                // Construct local URL
                const baseUrl = process.env.API_URL || 'http://localhost:3000';
                imageUrl = `${baseUrl}/uploads/${filename}`;

                // Analyze using buffer
                scan = await scanService.createScanWithBuffer(petId, imageUrl, req.file.buffer);
            } else {
                if (!imageUrl) {
                    sendError(res, 'Image URL or file is required', 400);
                    return;
                }
                // Use existing URL
                scan = await scanService.createScan(petId, imageUrl);
            }

            // Update pet status based on scan severity
            if (scan.severity && scan.severity !== 'none') {
                await petService.updateStatus(petId, 'attention_needed');
            }

            // Send notification
            await notificationService.notifyScanResult(
                req.user!.id,
                pet.name,
                scan.id,
                scan.severity || 'none'
            );

            sendCreated(res, scan);
        } catch (_error) {
            console.error('Scan error:', _error);
            sendError(res, 'Failed to create scan', 500);
        }
    }
);

// GET /api/pets/:petId/scans - Get scans for specific pet
router.get('/pet/:petId', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const pet = await petService.findById(req.params.petId as string);
        if (!pet || pet.userId !== req.user!.id) {
            sendError(res, 'Pet not found or unauthorized', 404);
            return;
        }

        const scans = await scanService.findAllByPetId(req.params.petId as string);
        sendSuccess(res, scans);
    } catch (_error) {
        sendError(res, 'Failed to fetch scans', 500);
    }
});

export default router;
