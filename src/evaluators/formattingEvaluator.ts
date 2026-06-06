import { Prompt } from "../models/prompt.types";
import { ModelResponse } from "../models/response.types";

export interface EvaluatorResult {
    score: number;
    issues: string[];
}

export class FormattingEvaluator {
    static evaluate(prompt: Prompt, response: ModelResponse): EvaluatorResult {
        const issues: string[] = [];
        const responseText = response.responseText;

        if (prompt.category === "coding" && !this.containsCodeLikeText(responseText)) {
            issues.push("Coding response does not appear to contain code");
        }

        if (this.looksLikeJsonPrompt(prompt.prompt) && !this.isValidJson(responseText)) {
            issues.push("Response is not valid JSON");
        }

        if (this.hasUnbalancedMarkdownCodeFence(responseText)) {
            issues.push("Response contains unbalanced markdown code fences");
        }

        const score = Math.max(0, 100 - issues.length * 25);

        return {
            score,
            issues
        };
    }

    private static containsCodeLikeText(text: string): boolean {
        return (
            text.includes("function") ||
            text.includes("class") ||
            text.includes("return") ||
            text.includes("=>") ||
            text.includes("{") ||
            text.includes("}")
        );
    }

    private static looksLikeJsonPrompt(prompt: string): boolean {
        return prompt.toLowerCase().includes("json");
    }

    private static isValidJson(text: string): boolean {
        try {
            JSON.parse(text);
            return true;
        } catch {
            return false;
        }
    }

    private static hasUnbalancedMarkdownCodeFence(text: string): boolean {
        const matches = text.match(/```/g);
        return matches !== null && matches.length % 2 !== 0;
    }
}