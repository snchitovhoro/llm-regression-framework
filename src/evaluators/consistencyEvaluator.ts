import { Prompt } from "../models/prompt.types";
import { ModelResponse } from "../models/response.types";

export interface EvaluatorResult {
    score: number;
    issues: string[];
}

export class ConsistencyEvaluator {
    static evaluate(prompt: Prompt, response: ModelResponse): EvaluatorResult {
        const issues: string[] = [];

        const baselineWords = this.tokenize(prompt.baselineResponse);
        const responseWords = this.tokenize(response.responseText);

        if (baselineWords.length === 0) {
            return {
                score: 100,
                issues: []
            };
        }

        const overlapCount = baselineWords.filter((word) =>
            responseWords.includes(word)
        ).length;

        const overlapRatio = overlapCount / baselineWords.length;

        if (overlapRatio < 0.3) {
            issues.push("Low keyword overlap with baseline response");
        }

        const baselineLength = prompt.baselineResponse.length;
        const responseLength = response.responseText.length;

        const lengthRatio =
            Math.min(baselineLength, responseLength) /
            Math.max(baselineLength, responseLength);

        if (lengthRatio < 0.4) {
            issues.push("Response length differs significantly from baseline");
        }

        const score = Math.round(((overlapRatio + lengthRatio) / 2) * 100);

        return {
            score: Math.max(0, Math.min(100, score)),
            issues
        };
    }

    private static tokenize(text: string): string[] {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter((word) => word.length > 3);
    }
}