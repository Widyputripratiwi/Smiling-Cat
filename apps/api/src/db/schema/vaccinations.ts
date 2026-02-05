import { pgTable, uuid, text, timestamp, date, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { pets } from './pets';

export const vaccinationStatusEnum = pgEnum('vaccination_status', [
    'scheduled',
    'completed',
    'overdue',
    'cancelled',
]);

export const vaccinations = pgTable('vaccinations', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    petId: text('pet_id')
        .notNull()
        .references(() => pets.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    administeredDate: date('administered_date'),
    dueDate: date('due_date'),
    status: vaccinationStatusEnum('vaccination_status').default('scheduled'),
    administeredBy: text('administered_by'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const vaccinationsRelations = relations(vaccinations, ({ one }) => ({
    pet: one(pets, {
        fields: [vaccinations.petId],
        references: [pets.id],
    }),
}));
