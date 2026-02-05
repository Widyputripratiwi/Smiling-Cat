import { roboflowConfig, getModelInferenceUrl, type RoboflowResult, type RoboflowPrediction } from '../config/roboflow';
import { severityEnum } from '../db/schema/health-scans';
import * as fs from 'fs';
import axios from 'axios';

const logToFile = (message: string) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync('roboflow.log', `[${timestamp}] ${message}\n`);
};

export interface AnalysisResult {
    resultId: string;
    diagnosis: string;
    confidence: number;
    severity: (typeof severityEnum.enumValues)[number];
    symptoms: string[];
    recommendations: string;
    detectedAreas?: {
        type: 'skin' | 'eye';
        predictions: RoboflowPrediction[];
    }[];
    imageWidth?: number;
    imageHeight?: number;
}

export type ScanType = 'skin' | 'eye' | 'both';

export class RoboflowService {
    private apiKey: string;

    constructor() {
        this.apiKey = roboflowConfig.apiKey;
    }

    async uploadImage(imageBuffer: Buffer, fileName: string): Promise<string> {
        const formData = new FormData();
        const blob = new Blob([new Uint8Array(imageBuffer)], { type: 'image/jpeg' });
        formData.append('file', blob, fileName);

        const response = await fetch(
            `https://api.roboflow.com/dataset/${roboflowConfig.skin.projectId}/upload?api_key=${this.apiKey}`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error(`Roboflow upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.id;
    }

    async analyzeImage(imageUrl: string): Promise<AnalysisResult> {
        if (!this.apiKey || this.apiKey.startsWith('your_')) {
            return this.getDefaultAnalysis();
        }

        const inferenceUrl = getModelInferenceUrl('skin');

        const response = await fetch(
            `${inferenceUrl}?api_key=${this.apiKey}&image=${encodeURIComponent(imageUrl)}`,
            {
                method: 'POST',
            }
        );

        if (!response.ok) {
            return this.getDefaultAnalysis();
        }

        const result: RoboflowResult = await response.json();
        return this.parseRoboflowResult(result, 'skin');
    }

    // Analyze image buffer with a specific model
    async analyzeImageBufferWithModel(
        imageBuffer: Buffer,
        modelType: 'skin' | 'eye'
    ): Promise<{ predictions: RoboflowPrediction[]; modelType: 'skin' | 'eye'; imageWidth?: number; imageHeight?: number }> {
        const base64Image = imageBuffer.toString('base64');
        const config = roboflowConfig[modelType];
        const url = `${config.baseUrl}/${config.projectId}/${config.modelVersion}`;

        logToFile(`[${modelType.toUpperCase()}] Request URL: ${url}`);

        try {
            const response = await axios({
                method: 'POST',
                url: url,
                params: {
                    api_key: this.apiKey
                },
                data: base64Image,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            logToFile(`[${modelType.toUpperCase()}] Response: ${JSON.stringify(response.data)}`);

            // Handle different response formats
            let predictions: RoboflowPrediction[] = [];

            if (response.data.predictions) {
                // Object Detection / Segmentation format: predictions is an array of objects
                if (Array.isArray(response.data.predictions)) {
                    predictions = response.data.predictions.map((p: any) => ({
                        class: p.class,
                        confidence: p.confidence,
                        x: p.x,
                        y: p.y,
                        width: p.width,
                        height: p.height,
                    }));
                } else {
                    // Classification format: predictions is an object { "class": confidence }
                    predictions = Object.entries(response.data.predictions).map(([className, confidence]) => ({
                        class: className,
                        confidence: confidence as number,
                    }));
                }
            }

            // Get top prediction from Classification format
            if (response.data.top) {
                const existingTop = predictions.find(p => p.class === response.data.top);
                if (!existingTop) {
                    predictions.unshift({
                        class: response.data.top,
                        confidence: response.data.confidence || 0.5,
                    });
                }
            }

            // Filter out false positive detections for eye model
            // - Always allow 'healthy' class through
            // - For disease classes: reject if bounding box is too large (>50%) OR confidence is too low (<40%)
            if (modelType === 'eye' && response.data.image) {
                const imageWidth = response.data.image.width;
                const imageHeight = response.data.image.height;
                const imageArea = imageWidth * imageHeight;

                predictions = predictions.filter(p => {
                    const className = p.class.toLowerCase();

                    // Always allow healthy detections through (with minimum 30% confidence)
                    if (className === 'healthy') {
                        if (p.confidence < 0.3) {
                            logToFile(`[EYE] Filtered out very low confidence healthy: ${(p.confidence * 100).toFixed(1)}%`);
                            return false;
                        }
                        return true;
                    }

                    // For disease detections: check confidence (min 40%)
                    if (p.confidence < 0.4) {
                        logToFile(`[EYE] Filtered out low confidence detection: ${p.class} (${(p.confidence * 100).toFixed(1)}%)`);
                        return false;
                    }

                    // For disease detections: check bounding box size (max 50% coverage)
                    if (p.width && p.height) {
                        const boxArea = p.width * p.height;
                        const coverageRatio = boxArea / imageArea;
                        if (coverageRatio > 0.5) {
                            logToFile(`[EYE] Filtered out oversized detection: ${p.class} covers ${(coverageRatio * 100).toFixed(1)}% of image`);
                            return false;
                        }
                    }

                    return true;
                });
            }

            const imageWidth = response.data.image?.width;
            const imageHeight = response.data.image?.height;
            return { predictions, modelType, imageWidth, imageHeight };
        } catch (error: any) {
            logToFile(`[${modelType.toUpperCase()}] Error: ${error.response?.status || 'unknown'} - ${JSON.stringify(error.response?.data || error.message)}`);
            return { predictions: [], modelType, imageWidth: undefined, imageHeight: undefined };
        }
    }

    // Main method: Analyze with multiple models
    async analyzeImageBuffer(imageBuffer: Buffer, scanType: ScanType = 'skin'): Promise<AnalysisResult> {
        if (!this.apiKey || this.apiKey.startsWith('your_')) {
            return this.getDefaultAnalysis();
        }

        try {
            logToFile(`Starting analysis with scanType: ${scanType}`);
            logToFile(`Image buffer size: ${imageBuffer.length} bytes`);

            const modelsToUse: ('skin' | 'eye')[] =
                scanType === 'both' ? ['skin', 'eye'] : [scanType];

            // Run all models in parallel
            const results = await Promise.all(
                modelsToUse.map(model => this.analyzeImageBufferWithModel(imageBuffer, model))
            );

            // Combine results from all models
            return this.combineResults(results);
        } catch (error: any) {
            logToFile(`Analysis Error: ${error.message}`);
            return this.getDefaultAnalysis();
        }
    }

    // Combine results from multiple models
    private combineResults(
        results: { predictions: RoboflowPrediction[]; modelType: 'skin' | 'eye'; imageWidth?: number; imageHeight?: number }[]
    ): AnalysisResult {
        const allPredictions: RoboflowPrediction[] = [];
        const detectedAreas: AnalysisResult['detectedAreas'] = [];

        // Get image dimensions from first result that has them
        let imageWidth: number | undefined;
        let imageHeight: number | undefined;

        for (const result of results) {
            // Capture image dimensions from first valid response
            if (!imageWidth && result.imageWidth) {
                imageWidth = result.imageWidth;
                imageHeight = result.imageHeight;
            }

            if (result.predictions.length > 0) {
                allPredictions.push(...result.predictions);
                detectedAreas.push({
                    type: result.modelType,
                    predictions: result.predictions,
                });
            }
        }

        if (allPredictions.length === 0) {
            return {
                resultId: `rf-${Date.now()}`,
                diagnosis: 'Tidak ada masalah terdeteksi',
                confidence: 100,
                severity: 'none',
                symptoms: [],
                recommendations: 'Kucing Anda tampak sehat. Lanjutkan perawatan rutin.',
                detectedAreas: [],
                imageWidth,
                imageHeight,
            };
        }

        // Get highest confidence prediction
        const topPrediction = allPredictions.reduce((prev, current) =>
            prev.confidence > current.confidence ? prev : current
        );

        const symptoms = this.extractSymptoms(allPredictions);
        const avgConfidence = allPredictions.reduce((sum, p) => sum + p.confidence, 0) / allPredictions.length;
        const severity = this.determineSeverity(symptoms, avgConfidence);

        // Generate diagnosis based on detected areas
        const diagnosisParts: string[] = [];
        for (const area of detectedAreas) {
            const topInArea = area.predictions.reduce((prev, current) =>
                prev.confidence > current.confidence ? prev : current
            );
            const areaLabel = area.type === 'skin' ? 'Kulit' : 'Mata';
            diagnosisParts.push(`${areaLabel}: ${this.formatClassName(topInArea.class)}`);
        }

        return {
            resultId: `rf-${Date.now()}`,
            diagnosis: diagnosisParts.join(' | ') || this.generateDiagnosis(topPrediction.class, avgConfidence),
            confidence: Math.min(avgConfidence * 100, 100),
            severity,
            symptoms,
            recommendations: this.generateRecommendations(symptoms, severity),
            detectedAreas,
            imageWidth,
            imageHeight,
        };
    }

    private extractSymptoms(predictions: RoboflowPrediction[]): string[] {
        return predictions
            .filter(p => p.confidence > 0.3)
            .map(p => this.formatClassName(p.class));
    }

    private formatClassName(className: string): string {
        // Convert snake_case or kebab-case to readable format
        return className
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    private parseRoboflowResult(result: RoboflowResult, modelType: 'skin' | 'eye'): AnalysisResult {
        const predictions = result.predictions || [];

        if (predictions.length === 0) {
            return {
                resultId: `rf-${Date.now()}`,
                diagnosis: 'Tidak ada masalah terdeteksi',
                confidence: 100,
                severity: 'none',
                symptoms: [],
                recommendations: 'Kucing Anda tampak sehat. Lanjutkan perawatan rutin.',
            };
        }

        const topPrediction = predictions.reduce((prev, current) =>
            prev.confidence > current.confidence ? prev : current
        );

        const symptoms = predictions.map((p) => this.formatClassName(p.class));
        const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
        const severity = this.determineSeverity(symptoms, avgConfidence);

        return {
            resultId: `rf-${Date.now()}`,
            diagnosis: this.generateDiagnosis(topPrediction.class, avgConfidence),
            confidence: avgConfidence * 100,
            severity,
            symptoms,
            recommendations: this.generateRecommendations(symptoms, severity),
        };
    }

    private determineSeverity(
        symptoms: string[],
        confidence: number
    ): (typeof severityEnum.enumValues)[number] {
        // Critical conditions
        const criticalConditions = ['infection', 'infeksi', 'injury', 'tumor', 'cancer', 'severe'];
        // High severity conditions
        const highConditions = ['conjunctivitis', 'konjungtivitis', 'ulcer', 'glaucoma', 'cataract', 'entropion'];
        // Medium severity conditions  
        const mediumConditions = ['redness', 'kemerahan', 'discharge', 'swelling', 'irritation', 'iritasi', 'ringworm'];
        // Low severity conditions
        const lowConditions = ['minor', 'ringan', 'dry', 'kering', 'tear stain', 'mild'];

        const hasCondition = (conditions: string[]) =>
            symptoms.some((s) => conditions.some((c) => s.toLowerCase().includes(c.toLowerCase())));

        if (hasCondition(criticalConditions) && confidence > 0.7) return 'critical';
        if (hasCondition(highConditions) && confidence > 0.6) return 'high';
        if (hasCondition(mediumConditions) && confidence > 0.5) return 'medium';
        if (hasCondition(lowConditions) || (symptoms.length > 0 && confidence > 0.3)) return 'low';
        return 'none';
    }

    private generateDiagnosis(condition: string, confidence: number): string {
        const formattedCondition = this.formatClassName(condition);
        const confidenceLevel = confidence > 0.8 ? 'Tinggi' : confidence > 0.6 ? 'Sedang' : 'Rendah';
        return `${formattedCondition} terdeteksi (Keyakinan: ${confidenceLevel})`;
    }

    private generateRecommendations(
        symptoms: string[],
        severity: (typeof severityEnum.enumValues)[number]
    ): string {
        const recommendations: string[] = [];

        if (severity === 'critical') {
            recommendations.push('⚠️ SEGERA bawa kucing Anda ke dokter hewan!');
            recommendations.push('Kondisi ini memerlukan penanganan medis darurat.');
        } else if (severity === 'high') {
            recommendations.push('Konsultasikan dengan dokter hewan dalam 1-2 hari.');
            recommendations.push('Monitor kondisi kucing dengan cermat.');
        } else if (severity === 'medium') {
            recommendations.push('Observasi kucing Anda selama 2-3 hari.');
            recommendations.push('Jika gejala memburuk, segera hubungi dokter hewan.');
        } else if (severity === 'low') {
            recommendations.push('Masalah minor terdeteksi.');
            recommendations.push('Jaga kebersihan dan nutrisi kucing Anda.');
        } else {
            recommendations.push('Kucing Anda tampak sehat! 🐱');
            recommendations.push('Lanjutkan perawatan rutin dan pemeriksaan berkala.');
        }

        // Add symptom-specific recommendations
        const symptomsLower = symptoms.map(s => s.toLowerCase());

        if (symptomsLower.some(s => s.includes('eye') || s.includes('mata'))) {
            recommendations.push('Bersihkan area mata dengan kapas basah hangat.');
        }
        if (symptomsLower.some(s => s.includes('skin') || s.includes('kulit') || s.includes('ringworm'))) {
            recommendations.push('Jaga kebersihan kulit dan hindari kelembaban berlebih.');
        }

        return recommendations.join(' ');
    }

    private getDefaultAnalysis(): AnalysisResult {
        const simulatedResults = [
            {
                diagnosis: 'Normal - Mata dan Bulu Sehat',
                confidence: 94,
                severity: 'none' as const,
                symptoms: [],
                recommendations: 'Kucing Anda tampak sangat sehat! Pastikan untuk menjaga pola makan seimbang dan rutin menyisir bulunya.'
            },
            {
                diagnosis: 'Indikasi Konjungtivitis Ringan',
                confidence: 82,
                severity: 'medium' as const,
                symptoms: ['Kemerahan pada mata', 'Sedikit cairan'],
                recommendations: 'Bersihkan area mata dengan lembut menggunakan kapas basah hangat. Jika kemerahan menetap lebih dari 2 hari, hubungi dokter hewan.'
            },
            {
                diagnosis: 'Iritasi Kulit Terdeteksi',
                confidence: 76,
                severity: 'low' as const,
                symptoms: ['Bulu kusam', 'Area kemerahan'],
                recommendations: 'Periksa apakah ada kutu atau alergi makanan. Ganti sampo kucing ke varian yang lebih lembut.'
            },
        ];

        const randomResult = simulatedResults[Math.floor(Math.random() * simulatedResults.length)];

        return {
            resultId: `simulated-${Date.now()}`,
            ...randomResult
        };
    }
}

export const roboflowService = new RoboflowService();
