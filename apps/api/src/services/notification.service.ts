import { eq, desc, and } from 'drizzle-orm';
import { db } from '../config/database';
import { notifications, notificationTypeEnum } from '../db/schema/notifications';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Notification = InferSelectModel<typeof notifications>;
export type NewNotification = InferInsertModel<typeof notifications>;

export class NotificationService {
    async findAllByUserId(userId: string): Promise<Notification[]> {
        return db
            .select()
            .from(notifications)
            .where(eq(notifications.userId, userId))
            .orderBy(desc(notifications.createdAt));
    }

    async findById(id: string): Promise<Notification | undefined> {
        const result = await db.select().from(notifications).where(eq(notifications.id, id));
        return result[0];
    }

    async create(data: NewNotification): Promise<Notification> {
        const result = await db.insert(notifications).values(data).returning();
        return result[0];
    }

    async markAsRead(id: string): Promise<Notification | undefined> {
        const result = await db
            .update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, id))
            .returning();
        return result[0];
    }

    async markAllAsRead(userId: string): Promise<void> {
        await db
            .update(notifications)
            .set({ isRead: true })
            .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    }

    async delete(id: string): Promise<boolean> {
        const result = await db.delete(notifications).where(eq(notifications.id, id)).returning();
        return result.length > 0;
    }

    async getUnreadCount(userId: string): Promise<number> {
        const result = await db
            .select()
            .from(notifications)
            .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
        return result.length;
    }

    // Notification creation helpers
    async notifyScanResult(
        userId: string,
        petName: string,
        scanId: string,
        severity: string
    ): Promise<Notification> {
        return this.create({
            userId,
            title: `Scan Complete for ${petName}`,
            message: `AI analysis complete. Severity: ${severity}`,
            type: 'scan_result',
            metadata: { scanId, petName, severity },
        });
    }

    async notifyVaccinationReminder(
        userId: string,
        petName: string,
        vaccinationName: string,
        dueDate: string
    ): Promise<Notification> {
        return this.create({
            userId,
            title: `Vaccination Reminder: ${petName}`,
            message: `${vaccinationName} is due on ${dueDate}`,
            type: 'vaccination_reminder',
            metadata: { petName, vaccinationName, dueDate },
        });
    }

    async notifyNewMessage(
        userId: string,
        consultationId: string,
        senderName: string
    ): Promise<Notification> {
        return this.create({
            userId,
            title: 'New Message',
            message: `You have a new message from ${senderName}`,
            type: 'consultation_message',
            metadata: { consultationId, senderName },
        });
    }
}

export const notificationService = new NotificationService();
