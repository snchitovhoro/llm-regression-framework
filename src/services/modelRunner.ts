import { Prompt } from "../models/prompt.types";
import { ModelResponse } from "../models/response.types";

export class ModelRunner {
    static async run(
        prompt: Prompt,
        modelName = "mock-llm-v1"
    ): Promise<ModelResponse> {
        const startTime = Date.now();

        await this.simulateLatency();

        const responseText = this.generateMockResponse(prompt);

        return {
            promptId: prompt.id,
            modelName,
            responseText,
            latencyMs: Date.now() - startTime,
            generatedAt: new Date().toISOString()
        };
    }

    static async runAll(
        prompts: Prompt[],
        modelName = "mock-llm-v1"
    ): Promise<ModelResponse[]> {
        return Promise.all(
            prompts.map((prompt) =>
                this.run(prompt, modelName)
            )
        );
    }

    private static async simulateLatency(): Promise<void> {
        const delay = Math.floor(Math.random() * 1000) + 250;

        return new Promise((resolve) =>
            setTimeout(resolve, delay)
        );
    }

    private static generateMockResponse(
        prompt: Prompt
    ): string {
        switch (prompt.category) {
            case "coding":
                return `
function reverseString(str) {
  return str.split('').reverse().join('');
}
`;

            case "reasoning":
                return `
Binary search is more efficient because it repeatedly divides the search space in half, resulting in O(log n) complexity.
`;

            case "summarization":
                return `
Cloud computing provides scalability, cost efficiency, and high availability.
`;

            case "safety":
                return `
Organizations should implement MFA, encryption, and access controls to protect sensitive information.
`;

            case "edge-case":
                return `
Edge case handled successfully.
`;

            default:
                return "No response generated.";
        }
    }
}