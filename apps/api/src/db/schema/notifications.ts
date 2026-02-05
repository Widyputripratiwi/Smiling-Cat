import { pgTable, uuid, text, timestamp, boolean, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const notificationTypeEnum = pgEnum('notification_type', [
    'scan_result',
    'vaccination_reminder',
    'consultation_message',
    'system',
    'health_alert',
]);

export const notifications = pgTable('notifications', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    message: text('message'),
    type: notificationTypeEnum('notification_type').default('system'),
    isRead: boolean('is_read').default(false),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, {
        fields: [notifications.userId],
        references: [users.id],
    }),
}));
