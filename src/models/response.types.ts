export interface ModelResponse {
    promptId: string;
    modelName: string;
    responseText: string;
    latencyMs: number;
    generatedAt: string;
}