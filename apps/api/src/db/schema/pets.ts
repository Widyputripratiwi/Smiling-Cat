import { pgTable, uuid, text, timestamp, real, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const genderEnum = pgEnum('gender', ['male', 'female']);
export const petStatusEnum = pgEnum('pet_status', [
    'healthy',
    'needs_scan',
    'attention_needed',
    'under_treatment',
]);

export const pets = pgTable('pets', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    breed: text('breed'),
    age: text('age'),
    gender: genderEnum('gender'),
    status: petStatusEnum('pet_status').default('healthy'),
    imageUrl: text('image_url'),
    weight: real('weight'),
    lifestyle: text('lifestyle'),
    conditions: text('conditions'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const petsRelations = relations(pets, ({ one }) => ({
    user: one(users, {
        fields: [pets.userId],
        references: [users.id],
    }),
}));
