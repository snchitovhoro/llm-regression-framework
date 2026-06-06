import { Prompt } from "../models/prompt.types";
import { ModelResponse } from "../models/response.types";

export interface EvaluatorResult {
    score: number;
    issues: string[];
}

export class AccuracyEvaluator {
    static evaluate(prompt: Prompt, response: ModelResponse): EvaluatorResult {
        const issues: string[] = [];
        const responseText = response.responseText.toLowerCase();

        const mustContain = prompt.expectedOutput.mustContain ?? [];
        const mustNotContain = prompt.expectedOutput.mustNotContain ?? [];

        for (const term of mustContain) {
            if (!responseText.includes(term.toLowerCase())) {
                issues.push(`Missing required term: ${term}`);
            }
        }

        for (const term of mustNotContain) {
            if (responseText.includes(term.toLowerCase())) {
                issues.push(`Contains forbidden term: ${term}`);
            }
        }

        if (
            prompt.expectedOutput.minLength !== undefined &&
            response.responseText.length < prompt.expectedOutput.minLength
        ) {
            issues.push("Response is shorter than minimum length");
        }

        if (
            prompt.expectedOutput.maxLength !== undefined &&
            response.responseText.length > prompt.expectedOutput.maxLength
        ) {
            issues.push("Response exceeds maximum length");
        }

        const score = Math.max(0, 100 - issues.length * 20);

        return { score, issues };
    }
}