import express from "express";
import dotenv from "dotenv";

import { PromptLoader } from "./services/promptLoader";
import {ModelRunner} from "./services/modelRunner";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

app.get("/", (_req, res) => {
    res.status(200).json({
        service: "LLM Regression Testing Framework",
        status: "RUNNING",
        version: "1.0.0"
    });
});

app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "UP",
        timestamp: new Date().toISOString()
    });
});

app.get("/prompts", (_req, res) => {
    try {
        const prompts = PromptLoader.loadPrompts();

        res.status(200).json({
            success: true,
            count: prompts.length,
            prompts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to load prompts"
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
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`
=====================================
LLM Regression Testing Framework
=====================================
Server: http://localhost:${PORT}

Endpoints:
GET /health
GET /prompts
GET /run-model
=====================================
`);
});

export default app;