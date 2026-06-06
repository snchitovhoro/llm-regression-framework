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

const DEFAULT_BASELINE_RESPONSE =
    "A high-quality response should directly answer the prompt, follow instructions, avoid unsafe or irrelevant content, and provide clear reasoning or correct implementation where applicable.";

const DEFAULT_EXPECTED_OUTPUT = {
    mustContain: [],
    mustNotContain: ["HACKED", "syntax error"],
    minLength: 0,
    maxLength: 1500
};

const DEFAULT_EVALUATION_CRITERIA = {
    accuracyWeight: 40,
    consistencyWeight: 20,
    formattingWeight: 15,
    safetyWeight: 15,
    latencyWeight: 10
};

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
                prompts.push(this.normalizePrompt(item, file, index));
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

    private static normalizePrompt(
        value: unknown,
        fileName: string,
        index: number
    ): Prompt {
        if (!this.isObject(value)) {
            throw new PromptLoaderError(
                `Invalid prompt at ${fileName}[${index}]: prompt must be an object`
            );
        }

        const raw = value as Record<string, unknown>;

        const id = this.requireNonEmptyString(raw.id, "id", fileName, index);
        const category = this.requireCategory(raw.category, fileName, index);

        const promptValue = raw.prompt ?? raw.text;

        if (typeof promptValue !== "string") {
            throw new PromptLoaderError(
                `Invalid prompt at ${fileName}[${index}]: prompt must be a string`
            );
        }

        const baselineResponse =
            typeof raw.baselineResponse === "string" &&
            raw.baselineResponse.trim().length > 0
                ? raw.baselineResponse
                : DEFAULT_BASELINE_RESPONSE;

        const expectedOutput = this.isObject(raw.expectedOutput)
            ? raw.expectedOutput
            : DEFAULT_EXPECTED_OUTPUT;

        const evaluationCriteria = this.isObject(raw.evaluationCriteria)
            ? raw.evaluationCriteria
            : DEFAULT_EVALUATION_CRITERIA;

        return {
            id,
            category,
            prompt: promptValue,
            expectedOutput,
            baselineResponse,
            evaluationCriteria
        } as Prompt;
    }

    private static requireCategory(
        value: unknown,
        fileName: string,
        index: number
    ): PromptCategory {
        const category = this.requireNonEmptyString(
            value,
            "category",
            fileName,
            index
        );

        if (!VALID_CATEGORIES.includes(category as PromptCategory)) {
            throw new PromptLoaderError(
                `Invalid prompt at ${fileName}[${index}]: unsupported category "${category}"`
            );
        }

        return category as PromptCategory;
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

    private static requireNonEmptyString(
        value: unknown,
        fieldName: string,
        fileName: string,
        index: number
    ): string {
        if (typeof value !== "string" || value.trim().length === 0) {
            throw new PromptLoaderError(
                `Invalid prompt at ${fileName}[${index}]: ${fieldName} is required and must be a non-empty string`
            );
        }

        return value;
    }

    private static isObject(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }
}