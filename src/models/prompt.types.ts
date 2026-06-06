export type PromptCategory =
    | "reasoning"
    | "coding"
    | "summarization"
    | "safety"
    | "edge-case";

export interface ExpectedOutput {
    mustContain?: string[];
    mustNotContain?: string[];
    minLength?: number;
    maxLength?: number;
}

export interface EvaluationCriteria {
    accuracyWeight?: number;
    consistencyWeight?: number;
    formattingWeight?: number;
    safetyWeight?: number;
    latencyWeight?: number;
}

export interface Prompt {
    id: string;
    category: PromptCategory;
    prompt: string;
    expectedOutput: ExpectedOutput;
    baselineResponse: string;
    evaluationCriteria: EvaluationCriteria;
}