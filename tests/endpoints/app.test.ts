import request from "supertest";
import { app } from "../../src";
import { describe, expect, it } from "@jest/globals";

describe("API Endpoints", () => {
    describe("GET /", () => {
        it("returns application metadata", async () => {
            const response = await request(app).get("/");

            expect(response.status).toBe(200);
            expect(response.body.service).toBe("LLM Regression Testing Framework");
            expect(response.body.status).toBe("RUNNING");
        });
    });

    describe("GET /health", () => {
        it("returns health status", async () => {
            const response = await request(app).get("/health");

            expect(response.status).toBe(200);
            expect(response.body.status).toBe("UP");
            expect(response.body.service).toBe("LLM Regression Testing Framework");
        });
    });

    describe("GET /prompts", () => {
        it("loads prompts successfully", async () => {
            const response = await request(app).get("/prompts");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.totalPrompts).toBeGreaterThan(0);
            expect(Array.isArray(response.body.prompts)).toBe(true);
        });
    });

    describe("GET /run-model", () => {
        it("runs model against all prompts", async () => {
            const response = await request(app).get("/run-model");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.totalPrompts).toBeGreaterThan(0);
            expect(response.body.totalResponses).toBe(response.body.totalPrompts);
            expect(Array.isArray(response.body.results)).toBe(true);
        }, 30000);
    });
});