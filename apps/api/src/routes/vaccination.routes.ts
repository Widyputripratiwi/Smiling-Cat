import { Router, Response } from 'express';
import { vaccinationService } from '../services/vaccination.service';
import { petService } from '../services/pet.service';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendSuccess, sendCreated, sendNoContent, sendError } from '../utils/response';

const router = Router();

router.use(authMiddleware);

// GET /api/vaccinations/upcoming - Get upcoming vaccinations
router.get('/upcoming', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const vaccinations = await vaccinationService.getUpcomingVaccinations(req.user!.id);
        sendSuccess(res, vaccinations);
    } catch (_error) {
        sendError(res, 'Failed to fetch upcoming vaccinations', 500);
    }
});

// GET /api/vaccinations/pet/:petId - Get vaccinations for specific pet
router.get('/pet/:petId', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const pet = await petService.findById(req.params.petId as string);
        if (!pet || pet.userId !== req.user!.id) {
            sendError(res, 'Pet not found or unauthorized', 404);
            return;
        }

        const vaccinations = await vaccinationService.findAllByPetId(req.params.petId as string);
        sendSuccess(res, vaccinations);
    } catch (_error) {
        sendError(res, 'Failed to fetch vaccinations', 500);
    }
});

// POST /api/vaccinations - Create new vaccination
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { petId, name, administeredDate, dueDate, status, administeredBy, notes } = req.body;

        if (!petId || !name) {
            sendError(res, 'Pet ID and name are required', 400);
            return;
        }

        // Verify pet ownership
        const pet = await petService.findById(petId);
        if (!pet || pet.userId !== req.user!.id) {
            sendError(res, 'Pet not found or unauthorized', 404);
            return;
        }

        const vaccination = await vaccinationService.create({
            petId,
            name,
            administeredDate,
            dueDate,
            status,
            administeredBy,
            notes,
        });
        sendCreated(res, vaccination);
    } catch (_error) {
        sendError(res, 'Failed to create vaccination', 500);
    }
});

// PUT /api/vaccinations/:id - Update vaccination
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const vaccination = await vaccinationService.findById(req.params.id as string);
        if (!vaccination) {
            sendError(res, 'Vaccination not found', 404);
            return;
        }

        // Verify pet ownership
        const pet = await petService.findById(vaccination.petId);
        if (!pet || pet.userId !== req.user!.id) {
            sendError(res, 'Unauthorized', 403);
            return;
        }

        const { name, administeredDate, dueDate, status, administeredBy, notes } = req.body;
        const updated = await vaccinationService.update(req.params.id as string, {
            name,
            administeredDate,
            dueDate,
            status,
            administeredBy,
            notes,
        });
        sendSuccess(res, updated);
    } catch (_error) {
        sendError(res, 'Failed to update vaccination', 500);
    }
});

// DELETE /api/vaccinations/:id - Delete vaccination
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const vaccination = await vaccinationService.findById(req.params.id as string);
        if (!vaccination) {
            sendError(res, 'Vaccination not found', 404);
            return;
        }

        // Verify pet ownership
        const pet = await petService.findById(vaccination.petId);
        if (!pet || pet.userId !== req.user!.id) {
            sendError(res, 'Unauthorized', 403);
            return;
        }

        await vaccinationService.delete(req.params.id as string);
        sendNoContent(res);
    } catch (_error) {
        sendError(res, 'Failed to delete vaccination', 500);
    }
});

// PUT /api/vaccinations/:id/complete - Mark vaccination as completed
router.put('/:id/complete', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const vaccination = await vaccinationService.findById(req.params.id as string);
        if (!vaccination) {
            sendError(res, 'Vaccination not found', 404);
            return;
        }

        const pet = await petService.findById(vaccination.petId);
        if (!pet || pet.userId !== req.user!.id) {
            sendError(res, 'Unauthorized', 403);
            return;
        }

        const { administeredBy } = req.body;
        const updated = await vaccinationService.markAsCompleted(req.params.id as string, administeredBy);
        sendSuccess(res, updated);
    } catch (_error) {
        sendError(res, 'Failed to complete vaccination', 500);
    }
});

export default router;
