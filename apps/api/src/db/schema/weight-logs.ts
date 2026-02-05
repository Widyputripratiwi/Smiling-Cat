import { pgTable, text, timestamp, date, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { pets } from './pets';

export const weightLogs = pgTable('weight_logs', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    petId: text('pet_id')
        .notNull()
        .references(() => pets.id, { onDelete: 'cascade' }),
    weight: real('weight').notNull(),
    loggedAt: date('logged_at').defaultNow(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const weightLogsRelations = relations(weightLogs, ({ one }) => ({
    pet: one(pets, {
        fields: [weightLogs.petId],
        references: [pets.id],
    }),
}));
