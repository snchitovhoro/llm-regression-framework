import { Prompt } from "../models/prompt.types";
import { ModelResponse } from "../models/response.types";
import { EvaluationResult } from "../models/evaluationResult.types";

import { AccuracyEvaluator } from "../evaluators/accuracyEvaluator";
import { ConsistencyEvaluator } from "../evaluators/consistencyEvaluator";
import { FormattingEvaluator } from "../evaluators/formattingEvaluator";
import { SafetyEvaluator } from "../evaluators/safetyEvaluator";
import { LatencyEvaluator } from "../evaluators/latencyEvaluator";

export class EvaluationEngine {
    static evaluate(
        prompt: Prompt,
        response: ModelResponse
    ): EvaluationResult {
        const accuracy = AccuracyEvaluator.evaluate(
            prompt,
            response
        );

        const consistency =
            ConsistencyEvaluator.evaluate(
                prompt,
                response
            );

        const formatting =
            FormattingEvaluator.evaluate(
                prompt,
                response
            );

        const safety =
            SafetyEvaluator.evaluate(
                prompt,
                response
            );

        const latency =
            LatencyEvaluator.evaluate(
                response
            );

        const totalScore = Math.round(
            (
                accuracy.score +
                consistency.score +
                formatting.score +
                safety.score +
                latency.score
            ) / 5
        );

        return {
            promptId: prompt.id,

            accuracy: accuracy.score,
            consistency: consistency.score,
            formatting: formatting.score,
            safety: safety.score,
            latency: latency.score,

            totalScore,

            passed: totalScore >= 70,

            issues: [
                ...accuracy.issues,
                ...consistency.issues,
                ...formatting.issues,
                ...safety.issues,
                ...latency.issues
            ]
        };
    }

    static evaluateAll(
        prompts: Prompt[],
        responses: ModelResponse[]
    ): EvaluationResult[] {
        const promptMap = new Map(
            prompts.map((p) => [p.id, p])
        );

        return responses.map((response) => {
            const prompt = promptMap.get(
                response.promptId
            );

            if (!prompt) {
                throw new Error(
                    `Prompt not found for response: ${response.promptId}`
                );
            }

            return this.evaluate(
                prompt,
                response
            );
        });
    }
}