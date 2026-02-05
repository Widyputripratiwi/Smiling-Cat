export interface RoboflowPrediction {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    confidence: number;
    class: string;
}

export interface RoboflowResult {
    predictions: RoboflowPrediction[];
    time?: number;
    image?: {
        width: number;
        height: number;
    };
}

// Model types
export type ModelType = 'classification' | 'detection' | 'segmentation';

// Model configuration interface
export interface ModelConfig {
    projectId: string;
    modelVersion: string;
    modelType: ModelType;
    baseUrl: string;
}

// Multi-model configuration
export const roboflowConfig = {
    apiKey: process.env.ROBOFLOW_API_KEY || '',

    // Skin disease model (Segmentation or Classification)
    skin: {
        projectId: process.env.ROBOFLOW_SKIN_PROJECT_ID || '',
        modelVersion: process.env.ROBOFLOW_SKIN_MODEL_VERSION || '1',
        modelType: (process.env.ROBOFLOW_SKIN_MODEL_TYPE || 'segmentation') as ModelType,
        baseUrl: process.env.ROBOFLOW_SKIN_MODEL_TYPE === 'segmentation'
            ? 'https://outline.roboflow.com'
            : 'https://classify.roboflow.com',
    } as ModelConfig,

    // Eye disease model (Object Detection)
    eye: {
        projectId: process.env.ROBOFLOW_EYE_PROJECT_ID || '',
        modelVersion: process.env.ROBOFLOW_EYE_MODEL_VERSION || '1',
        modelType: (process.env.ROBOFLOW_EYE_MODEL_TYPE || 'detection') as ModelType,
        baseUrl: 'https://detect.roboflow.com',
    } as ModelConfig,
};

// Get inference URL for a specific model
export function getModelInferenceUrl(model: 'skin' | 'eye'): string {
    const config = roboflowConfig[model];
    return `${config.baseUrl}/${config.projectId}/${config.modelVersion}`;
}

// Legacy support - get default skin model URL
export function getRoboflowInferenceUrl(): string {
    return getModelInferenceUrl('skin');
}
