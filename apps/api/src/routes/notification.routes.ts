import { Router, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';
import { sendSuccess, sendNoContent, sendError } from '../utils/response';

const router = Router();

router.use(authMiddleware);

// GET /api/notifications - Get all user's notifications
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const notifications = await notificationService.findAllByUserId(req.user!.id);
        sendSuccess(res, notifications);
    } catch (_error) {
        sendError(res, 'Failed to fetch notifications', 500);
    }
});

// GET /api/notifications/unread-count - Get unread notification count
router.get('/unread-count', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const count = await notificationService.getUnreadCount(req.user!.id);
        sendSuccess(res, { count });
    } catch (_error) {
        sendError(res, 'Failed to fetch unread count', 500);
    }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const notification = await notificationService.findById(req.params.id as string);
        if (!notification) {
            sendError(res, 'Notification not found', 404);
            return;
        }
        if (notification.userId !== req.user!.id) {
            sendError(res, 'Unauthorized', 403);
            return;
        }

        const updated = await notificationService.markAsRead(req.params.id as string);
        sendSuccess(res, updated);
    } catch (_error) {
        sendError(res, 'Failed to mark notification as read', 500);
    }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', async (req: AuthenticatedRequest, res: Response) => {
    try {
        await notificationService.markAllAsRead(req.user!.id);
        sendSuccess(res, { message: 'All notifications marked as read' });
    } catch (_error) {
        sendError(res, 'Failed to mark notifications as read', 500);
    }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const notification = await notificationService.findById(req.params.id as string);
        if (!notification) {
            sendError(res, 'Notification not found', 404);
            return;
        }
        if (notification.userId !== req.user!.id) {
            sendError(res, 'Unauthorized', 403);
            return;
        }

        await notificationService.delete(req.params.id as string);
        sendNoContent(res);
    } catch (_error) {
        sendError(res, 'Failed to delete notification', 500);
    }
});

export default router;
