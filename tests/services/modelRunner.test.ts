import { ModelRunner } from "../../src/services/modelRunner";
import { Prompt } from "../../src/models/prompt.types";
import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";

describe("ModelRunner", () => {
    it("generates a model response", async () => {
        const prompt: Prompt = {
            id: "coding_001",
            category: "coding",
            prompt: "Write a reverse string function.",
            expectedOutput: {},
            baselineResponse: "baseline",
            evaluationCriteria: {}
        };

        const result = await ModelRunner.run(prompt);

        expect(result.promptId).toBe(prompt.id);
        expect(result.responseText.length).toBeGreaterThan(0);
        expect(result.latencyMs).toBeGreaterThan(0);
        expect(result.modelName).toBe("mock-llm-v1");
    });
});