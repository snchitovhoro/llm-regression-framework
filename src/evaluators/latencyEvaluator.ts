import { ModelResponse } from "../models/response.types";

export interface EvaluatorResult {
    score: number;
    issues: string[];
}

export class LatencyEvaluator {
    static evaluate(response: ModelResponse): EvaluatorResult {
        const latencyMs = response.latencyMs;
        const issues: string[] = [];

        if (latencyMs < 1000) {
            return { score: 100, issues };
        }

        if (latencyMs < 2000) {
            return { score: 90, issues };
        }

        if (latencyMs < 5000) {
            issues.push("Moderate latency detected");
            return { score: 75, issues };
        }

        if (latencyMs < 10000) {
            issues.push("High latency detected");
            return { score: 50, issues };
        }

        issues.push("Severe latency detected");

        return {
            score: 25,
            issues
        };
    }
}