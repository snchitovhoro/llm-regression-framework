import express from "express";
import dotenv from "dotenv";

import { PromptLoader } from "./services/promptLoader";
import { ModelRunner } from "./services/modelRunner";

dotenv.config();

export const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
    return res.status(200).json({
        service: "LLM Regression Testing Framework",
        status: "RUNNING",
        version: "1.0.0"
    });
});

app.get("/health", (_req, res) => {
    return res.status(200).json({
        status: "UP",
        service: "LLM Regression Testing Framework",
        timestamp: new Date().toISOString()
    });
});

app.get("/prompts", (_req, res) => {
    try {
        const prompts = PromptLoader.loadPrompts();

        return res.status(200).json({
            success: true,
            totalPrompts: prompts.length,
            prompts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to load prompts"
        });
    }
});

app.get("/run-model", async (_req, res) => {
    try {
        const prompts = PromptLoader.loadPrompts();
        const results = await ModelRunner.runAll(prompts);

        return res.status(200).json({
            success: true,
            totalPrompts: prompts.length,
            totalResponses: results.length,
            results
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

if (require.main === module) {
    const PORT = Number(process.env.PORT) || 3000;

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}