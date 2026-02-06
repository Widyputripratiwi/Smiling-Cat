import { pgTable, text, timestamp, real, pgEnum, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { pets } from './pets';

export const severityEnum = pgEnum('severity', [
    'none',
    'low',
    'medium',
    'high',
    'critical',
]);

export const healthScans = pgTable('health_scans', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    petId: text('pet_id')
        .notNull()
        .references(() => pets.id, { onDelete: 'cascade' }),
    scanCode: text('scan_code').notNull().unique(),
    imageUrl: text('image_url').notNull(),
    roboflowResultId: text('roboflow_result_id'),
    diagnosis: text('diagnosis'),
    confidence: real('confidence'),
    severity: severityEnum('severity').default('none'),
    recommendations: text('recommendations'),
    detectedAreas: json('detected_areas').$type<{
        type: 'skin';
        predictions: {
            class: string;
            confidence: number;
            x?: number;
            y?: number;
            width?: number;
            height?: number;
        }[];
    }[]>(),
    imageWidth: real('image_width'),
    imageHeight: real('image_height'),
    scannedAt: timestamp('scanned_at').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const scanSymptoms = pgTable('scan_symptoms', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    scanId: text('scan_id')
        .notNull()
        .references(() => healthScans.id, { onDelete: 'cascade' }),
    symptom: text('symptom').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const healthScansRelations = relations(healthScans, ({ one, many }) => ({
    pet: one(pets, {
        fields: [healthScans.petId],
        references: [pets.id],
    }),
    symptoms: many(scanSymptoms),
}));

export const scanSymptomsRelations = relations(scanSymptoms, ({ one }) => ({
    scan: one(healthScans, {
        fields: [scanSymptoms.scanId],
        references: [healthScans.id],
    }),
}));
