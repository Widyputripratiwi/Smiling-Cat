import { eq, desc } from 'drizzle-orm';
import { db } from '../config/database';
import { healthScans, scanSymptoms, severityEnum } from '../db/schema/health-scans';
import { roboflowService } from './roboflow.service';
import { v4 as uuidv4 } from 'uuid';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type HealthScan = InferSelectModel<typeof healthScans>;
export type NewHealthScan = InferInsertModel<typeof healthScans>;
export type ScanSymptom = InferSelectModel<typeof scanSymptoms>;

export interface ScanAnalysisResult {
    diagnosis: string;
    confidence: number;
    severity: (typeof severityEnum.enumValues)[number];
    symptoms: string[];
    recommendations: string;
}

export class ScanService {
    async findAllByPetId(petId: string): Promise<HealthScan[]> {
        return db
            .select()
            .from(healthScans)
            .where(eq(healthScans.petId, petId))
            .orderBy(desc(healthScans.scannedAt));
    }

    async findById(id: string): Promise<HealthScan | undefined> {
        const result = await db.select().from(healthScans).where(eq(healthScans.id, id));
        return result[0];
    }

    async findByIdWithSymptoms(
        id: string
    ): Promise<{ scan: HealthScan; symptoms: ScanSymptom[] } | undefined> {
        const scan = await this.findById(id);
        if (!scan) return undefined;

        const symptoms = await db
            .select()
            .from(scanSymptoms)
            .where(eq(scanSymptoms.scanId, id));

        return { scan, symptoms };
    }

    async createScan(petId: string, imageUrl: string): Promise<HealthScan> {
        // Generate unique scan code
        const scanCode = `#${uuidv4().slice(0, 4).toUpperCase()}-${new Date()
            .toLocaleDateString('en-US', { month: 'short' })
            .toUpperCase()}`;

        // Analyze image with Roboflow
        const analysis = await roboflowService.analyzeImage(imageUrl);

        // Insert scan record
        const result = await db
            .insert(healthScans)
            .values({
                petId,
                scanCode,
                imageUrl,
                roboflowResultId: analysis.resultId,
                diagnosis: analysis.diagnosis,
                confidence: analysis.confidence,
                severity: analysis.severity,
                recommendations: analysis.recommendations,
            })
            .returning();

        const scan = result[0];

        // Insert symptoms
        if (analysis.symptoms.length > 0) {
            await db.insert(scanSymptoms).values(
                analysis.symptoms.map((symptom) => ({
                    scanId: scan.id,
                    symptom,
                }))
            );
        }

        return scan;
    }

    async createScanWithBuffer(petId: string, imageUrl: string, imageBuffer: Buffer): Promise<HealthScan> {
        // Generate unique scan code
        const scanCode = `#${uuidv4().slice(0, 4).toUpperCase()}-${new Date()
            .toLocaleDateString('en-US', { month: 'short' })
            .toUpperCase()}`;

        // Analyze image buffer with Roboflow
        const analysis = await roboflowService.analyzeImageBuffer(imageBuffer);

        // Insert scan record
        const result = await db
            .insert(healthScans)
            .values({
                petId,
                scanCode,
                imageUrl,
                roboflowResultId: analysis.resultId,
                diagnosis: analysis.diagnosis,
                confidence: analysis.confidence,
                severity: analysis.severity,
                recommendations: analysis.recommendations,
                detectedAreas: analysis.detectedAreas,
                imageWidth: analysis.imageWidth,
                imageHeight: analysis.imageHeight,
            })
            .returning();

        const scan = result[0];

        // Insert symptoms
        if (analysis.symptoms.length > 0) {
            await db.insert(scanSymptoms).values(
                analysis.symptoms.map((symptom) => ({
                    scanId: scan.id,
                    symptom,
                }))
            );
        }

        return scan;
    }

    async getSymptomsForScan(scanId: string): Promise<ScanSymptom[]> {
        return db.select().from(scanSymptoms).where(eq(scanSymptoms.scanId, scanId));
    }

    async getRecentScans(limit: number = 10): Promise<HealthScan[]> {
        return db
            .select()
            .from(healthScans)
            .orderBy(desc(healthScans.scannedAt))
            .limit(limit);
    }
}

export const scanService = new ScanService();
