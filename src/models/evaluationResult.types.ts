export interface EvaluationResult {
    promptId: string;

    accuracy: number;
    consistency: number;
    formatting: number;
    safety: number;
    latency: number;

    totalScore: number;
    passed: boolean;

    issues: string[];
}