# LLM Regression Testing Framework

A TypeScript-based AI Quality Engineering platform for detecting behavioral regressions, response drift, latency degradation, and formatting inconsistencies across Large Language Model (LLM) versions.

This framework enables automated evaluation of AI model quality by executing prompt suites, comparing outputs against established baselines, scoring responses across multiple quality dimensions, and generating comprehensive regression reports.

---

## Problem Statement

As AI models evolve, their behavior can change unexpectedly.

Common issues include:

* Hallucination increases
* Formatting regressions
* Response quality degradation
* Latency increases
* Safety behavior changes
* Inconsistent answers
* Prompt instruction failures

This project provides an automated framework for detecting and reporting these regressions before deployment.

---

## Features

### Prompt Suite Management

Organize prompts into categories:

* Coding
* Reasoning
* Summarization
* Safety
* Edge Cases

Example:

```json
{
  "id": "coding_001",
  "category": "coding",
  "text": "Write a TypeScript function to reverse a string."
}
```

---

### Baseline Comparison

Compare current model responses against previously approved baseline responses.

Detect:

* Content changes
* Missing information
* Formatting differences
* Instruction-following regressions

---

### Automated Evaluation

Evaluate responses for:

* Accuracy
* Consistency
* Formatting
* Safety
* Latency

Example score:

```json
{
  "accuracy": 92,
  "consistency": 89,
  "formatting": 98,
  "safety": 100,
  "latency": 87
}
```

---

### Regression Detection

Automatically identify:

* Response drift
* Hallucinations
* Missing sections
* Length anomalies
* Safety regressions
* Increased latency

---

### Reporting

Generate:

* JSON Reports
* Markdown Reports
* HTML Reports

Outputs:

```text
reports/
├── report.json
├── report.md
└── report.html
```

---

## Tech Stack

### Core

* TypeScript
* Node.js
* Express

### Testing

* Jest
* Playwright

### Quality Tooling

* ESLint
* Prettier
* Husky

### CI/CD

* GitHub Actions

---

## Architecture

```text
llm-regression-framework/
│
├── src/
│   ├── models/
│   │   ├── prompt.types.ts
│   │   ├── response.types.ts
│   │   └── evaluation.types.ts
│   │
│   ├── data/
│   │   ├── prompts/
│   │   └── baselines/
│   │
│   ├── services/
│   │   ├── promptLoader.ts
│   │   ├── modelRunner.ts
│   │   └── evaluationService.ts
│   │
│   ├── evaluators/
│   │   ├── accuracyEvaluator.ts
│   │   ├── consistencyEvaluator.ts
│   │   ├── latencyEvaluator.ts
│   │   └── safetyEvaluator.ts
│   │
│   ├── reports/
│   │   ├── generators/
│   │   └── reportGenerator.ts
│   │
│   └── runner/
│       └── regressionRunner.ts
│
├── reports/
├── tests/
├── .github/
├── package.json
└── README.md
```

---

## Example Regression Report

```json
{
  "summary": {
    "totalPrompts": 100,
    "passed": 92,
    "failed": 8
  },
  "regressions": [
    {
      "promptId": "reasoning_001",
      "issue": "Response length reduced by 60%"
    },
    {
      "promptId": "coding_012",
      "issue": "Formatting regression detected"
    }
  ]
}
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/llm-regression-framework.git
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

### Run Regression Suite

```bash
npm run regression
```

---

## CI/CD Pipeline

GitHub Actions automatically performs:

* Dependency Installation
* Type Checking
* Linting
* Unit Testing
* Regression Execution
* Report Generation
* Artifact Upload

---

## Engineering Goals

This project demonstrates:

* AI Quality Engineering
* Automated LLM Evaluation
* Regression Detection
* TypeScript Development
* Test Automation
* Structured Reporting
* CI/CD Practices
* Software Quality Engineering

---

## Future Enhancements

* OpenAI Integration
* Anthropic Integration
* Gemini Integration
* Semantic Similarity Scoring
* Embedding-Based Drift Detection
* Hallucination Detection
* Prompt Fuzz Testing
* Dashboard Visualization
* PostgreSQL Storage
* Docker Deployment

---

## Resume Bullet

Built a TypeScript-based AI Prompt Regression Testing Framework that automatically evaluated model behavior across prompt suites, detected response regressions, measured latency and consistency, and generated automated quality reports for AI-powered applications.

---

## Author

Simbarashe Chitovhoro

Software Engineer | AI Quality Engineering | Automation Testing | TypeScript
