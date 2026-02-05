import { Router, Response } from 'express';
import { petService } from '../services/pet.service';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { sendSuccess, sendCreated, sendNoContent, sendError } from '../utils/response';

const router = Router();

// All pet routes require authentication
router.use(authMiddleware);

// GET /api/pets - Get all user's pets
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const pets = await petService.findAllByUserId(req.user!.id);
        sendSuccess(res, pets);
    } catch (_error) {
        sendError(res, 'Failed to fetch pets', 500);
    }
});

// GET /api/pets/:id - Get pet by ID
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const pet = await petService.findById(req.params.id as string);
        if (!pet) {
            sendError(res, 'Pet not found', 404);
            return;
        }
        if (pet.userId !== req.user!.id) {
            sendError(res, 'Unauthorized', 403);
            return;
        }
        sendSuccess(res, pet);
    } catch (_error) {
        sendError(res, 'Failed to fetch pet', 500);
    }
});

// POST /api/pets - Create new pet
router.post('/', upload.single('image'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, breed, age, gender, weight, notes, lifestyle, conditions } = req.body;
        let imageUrl = req.body.imageUrl;

        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        if (!name) {
            sendError(res, 'Name is required', 400);
            return;
        }

        const pet = await petService.create({
            userId: req.user!.id,
            name,
            breed,
            age,
            gender,
            imageUrl,
            weight: weight ? parseFloat(weight) : null,
            notes,
            lifestyle: typeof lifestyle === 'string' ? lifestyle : JSON.stringify(lifestyle),
            conditions: typeof conditions === 'string' ? conditions : JSON.stringify(conditions)
        });
        sendCreated(res, pet);
    } catch (_error: any) {
        console.error('Create pet error:', _error);
        sendError(res, 'Failed to create pet: ' + (_error.message || 'Unknown error'), 500);
    }
});

// PUT /api/pets/:id - Update pet
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const existingPet = await petService.findById(req.params.id as string);
        if (!existingPet) {
            sendError(res, 'Pet not found', 404);
            return;
        }
        if (existingPet.userId !== req.user!.id) {
            sendError(res, 'Unauthorized', 403);
            return;
        }

        const { name, breed, age, gender, status, imageUrl, weight, notes } = req.body;
        const pet = await petService.update(req.params.id as string, {
            name,
            breed,
            age,
            gender,
            status,
            imageUrl,
            weight,
            notes,
        });
        sendSuccess(res, pet);
    } catch (_error) {
        sendError(res, 'Failed to update pet', 500);
    }
});

// DELETE /api/pets/:id - Delete pet
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const existingPet = await petService.findById(req.params.id as string);
        if (!existingPet) {
            sendError(res, 'Pet not found', 404);
            return;
        }
        if (existingPet.userId !== req.user!.id) {
            sendError(res, 'Unauthorized', 403);
            return;
        }

        await petService.delete(req.params.id as string);
        sendNoContent(res);
    } catch (_error) {
        sendError(res, 'Failed to delete pet', 500);
    }
});

export default router;
