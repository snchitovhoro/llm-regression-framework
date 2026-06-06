import fs from "fs";
import path from "path";
import { Prompt, PromptCategory } from "../models/prompt.types";

const VALID_CATEGORIES: PromptCategory[] = [
    "reasoning",
    "coding",
    "summarization",
    "safety",
    "edge-case"
];

export class PromptLoaderError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PromptLoaderError";
    }
}

export class PromptLoader {
    static loadPrompts(
        promptsDirectory = path.resolve(process.cwd(), "src", "data", "prompts")
    ): Prompt[] {
        if (!fs.existsSync(promptsDirectory)) {
            throw new PromptLoaderError(
                `Prompts directory does not exist: ${promptsDirectory}`
            );
        }

        const files = fs
            .readdirSync(promptsDirectory)
            .filter((file) => file.endsWith(".json"));

        if (files.length === 0) {
            throw new PromptLoaderError(
                `No JSON prompt files found in: ${promptsDirectory}`
            );
        }

        const prompts: Prompt[] = [];

        for (const file of files) {
            const filePath = path.join(promptsDirectory, file);
            const parsed = this.readJsonFile(filePath, file);

            if (!Array.isArray(parsed)) {
                throw new PromptLoaderError(
                    `Prompt file must contain an array: ${file}`
                );
            }

            parsed.forEach((item, index) => {
                const prompt = this.validatePrompt(item, file, index);
                prompts.push(prompt);
            });
        }

        this.validateDuplicateIds(prompts);

        return prompts;
    }

    private static readJsonFile(filePath: string, fileName: string): unknown {
        const rawContent = fs.readFileSync(filePath, "utf-8");

        try {
            return JSON.parse(rawContent);
        } catch (error) {
            throw new PromptLoaderError(
                `Invalid JSON in ${fileName}: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    private static validatePrompt(
        value: unknown,
        fileName: string,
        index: number
    ): Prompt {
        if (!this.isObject(value)) {
            throw new PromptLoaderError(
                `Invalid prompt at ${fileName}[${index}]: prompt must be an object`
            );
        }

        const prompt = value as Record<string, unknown>;

        this.assertString(prompt.id, "id", fileName, index);
        this.assertString(prompt.category, "category", fileName, index);
        this.assertString(prompt.prompt, "prompt", fileName, index);
        this.assertString(
            prompt.baselineResponse,
            "baselineResponse",
            fileName,
            index
        );

        if (!VALID_CATEGORIES.includes(prompt.category as PromptCategory)) {
            throw new PromptLoaderError(
                `Invalid prompt at ${fileName}[${index}]: unsupported category "${String(
                    prompt.category
                )}"`
            );
        }

        if (!this.isObject(prompt.expectedOutput)) {
            throw new PromptLoaderError(
                `Invalid prompt at ${fileName}[${index}]: expectedOutput must be an object`
            );
        }

        if (!this.isObject(prompt.evaluationCriteria)) {
            throw new PromptLoaderError(
                `Invalid prompt at ${fileName}[${index}]: evaluationCriteria must be an object`
            );
        }

        return {
            id: prompt.id,
            category: prompt.category as PromptCategory,
            prompt: prompt.prompt,
            expectedOutput: prompt.expectedOutput,
            baselineResponse: prompt.baselineResponse,
            evaluationCriteria: prompt.evaluationCriteria
        } as Prompt;
    }

    private static validateDuplicateIds(prompts: Prompt[]): void {
        const seen = new Set<string>();

        for (const prompt of prompts) {
            if (seen.has(prompt.id)) {
                throw new PromptLoaderError(`Duplicate prompt id found: ${prompt.id}`);
            }

            seen.add(prompt.id);
        }
    }

    private static assertString(
        value: unknown,
        fieldName: string,
        fileName: string,
        index: number
    ): asserts value is string {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new PromptLoaderError(
                `Invalid prompt at ${fileName}[${index}]: ${fieldName} is required and must be a non-empty string`
            );
        }
    }

    private static isObject(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }
}