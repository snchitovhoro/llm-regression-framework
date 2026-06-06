import fs from "fs";
import os from "os";
import path from "path";
import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";
import { PromptLoader, PromptLoaderError } from "../../src/services/promptLoader";

describe("PromptLoader", () => {
    let tempDir: string;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "prompt-loader-test-"));
    });

    afterEach(() => {
        fs.rmSync(tempDir, {
            recursive: true,
            force: true
        });
    });

    it("loads and merges prompts from JSON files", () => {
        fs.writeFileSync(
            path.join(tempDir, "coding.json"),
            JSON.stringify([
                {
                    id: "coding_001",
                    category: "coding",
                    prompt: "Write a TypeScript function to reverse a string.",
                    expectedOutput: {
                        mustContain: ["function", "reverse"]
                    },
                    baselineResponse: "function reverseString(str: string): string { return str.split('').reverse().join(''); }",
                    evaluationCriteria: {
                        accuracyWeight: 40
                    }
                }
            ])
        );

        fs.writeFileSync(
            path.join(tempDir, "reasoning.json"),
            JSON.stringify([
                {
                    id: "reasoning_001",
                    category: "reasoning",
                    prompt: "Explain binary search.",
                    expectedOutput: {
                        mustContain: ["O(log n)"]
                    },
                    baselineResponse: "Binary search repeatedly halves the search space.",
                    evaluationCriteria: {
                        accuracyWeight: 50
                    }
                }
            ])
        );

        const prompts = PromptLoader.loadPrompts(tempDir);

        expect(prompts).toHaveLength(2);
        expect(prompts[0].id).toBe("coding_001");
        expect(prompts[1].id).toBe("reasoning_001");
    });

    it("throws an error when directory does not exist", () => {
        expect(() => {
            PromptLoader.loadPrompts(path.join(tempDir, "missing"));
        }).toThrow(PromptLoaderError);
    });

    it("throws an error when no JSON files exist", () => {
        expect(() => {
            PromptLoader.loadPrompts(tempDir);
        }).toThrow("No JSON prompt files found");
    });

    it("throws an error for invalid JSON", () => {
        fs.writeFileSync(path.join(tempDir, "bad.json"), "{ invalid json");

        expect(() => {
            PromptLoader.loadPrompts(tempDir);
        }).toThrow("Invalid JSON in bad.json");
    });

    it("throws an error when prompt file is not an array", () => {
        fs.writeFileSync(
            path.join(tempDir, "coding.json"),
            JSON.stringify({
                id: "coding_001"
            })
        );

        expect(() => {
            PromptLoader.loadPrompts(tempDir);
        }).toThrow("Prompt file must contain an array");
    });

    it("throws an error when required fields are missing", () => {
        fs.writeFileSync(
            path.join(tempDir, "coding.json"),
            JSON.stringify([
                {
                    id: "coding_001",
                    category: "coding"
                }
            ])
        );

        expect(() => {
            PromptLoader.loadPrompts(tempDir);
        }).toThrow("prompt must be a string");

    });

    it("throws an error for unsupported categories", () => {
        fs.writeFileSync(
            path.join(tempDir, "bad-category.json"),
            JSON.stringify([
                {
                    id: "bad_001",
                    category: "unknown",
                    prompt: "Test prompt",
                    expectedOutput: {},
                    baselineResponse: "Baseline response",
                    evaluationCriteria: {}
                }
            ])
        );

        expect(() => {
            PromptLoader.loadPrompts(tempDir);
        }).toThrow("unsupported category");
    });

    it("throws an error for duplicate prompt ids", () => {
        const prompt = {
            id: "duplicate_001",
            category: "coding",
            prompt: "Write a function.",
            expectedOutput: {},
            baselineResponse: "Baseline",
            evaluationCriteria: {}
        };

        fs.writeFileSync(
            path.join(tempDir, "one.json"),
            JSON.stringify([prompt])
        );

        fs.writeFileSync(
            path.join(tempDir, "two.json"),
            JSON.stringify([prompt])
        );

        expect(() => {
            PromptLoader.loadPrompts(tempDir);
        }).toThrow("Duplicate prompt id found");
    });
});