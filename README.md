# 🏦 IDBI FinHealth
## AI-Assisted Financial Health Assessment Platform for MSME Lending

> Transforming fragmented alternate financial data into an explainable **Financial Health Card** that helps banks make faster, transparent, and more confident lending decisions for New-to-Credit (NTC) and New-to-Bank (NTB) MSMEs.

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-green)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)

---

# 📌 Table of Contents

- Problem Statement
- Our Solution
- Key Features
- AI Usage
- System Workflow
- Architecture
- Technology Stack
- Project Structure
- Screens
- Installation
- API Documentation
- Future Scope
- Disclaimer

---

# 🚨 Problem Statement

Millions of MSMEs in India remain underserved because traditional underwriting depends on:

- CIBIL Score
- Audited Financial Statements
- Long Credit History
- Formal Banking Records

Most small businesses instead generate alternate financial data through:

- GST Returns
- Account Aggregator
- UPI Transactions
- Bank Statements
- EPFO
- Utility Payments

Unfortunately, this information is fragmented across multiple systems, forcing credit officers to manually verify documents, resulting in slower loan approvals and lower financial inclusion.

---

# 💡 Our Solution

**IDBI FinHealth** is an AI-assisted decision support platform that converts alternate financial data into an explainable **Financial Health Card**.

Instead of producing a single opaque score, the platform evaluates businesses across three transparent dimensions:

- 📊 Financial Health
- 🎯 Assessment Confidence
- 🛡 Trust & Verification

The platform provides explainable insights, identifies risks, highlights strengths, recommends missing documents, and supports—but never replaces—the bank's underwriting process.

---

# 🎯 Objectives

- Improve Financial Inclusion
- Enable Alternate Data Lending
- Support Digital Credit Decisioning
- Reduce Manual Verification
- Increase Explainability
- Build Trust in AI-Assisted Lending

---

# ⭐ Key Features

## 📊 Financial Health Card

Unified assessment dashboard displaying

- Financial Health Score (0–1000)
- Confidence Score
- Trust Status
- AI Summary
- Business Strengths
- Financial Risks

---

## 📈 Financial Health Engine

Evaluates business performance across seven financial dimensions.

- Cash Flow
- Business Activity
- Stability
- Compliance
- Financial Discipline
- Growth
- Business Network

---

## 🎯 Confidence Engine

Measures assessment reliability using

- Data completeness
- Source coverage
- Cross verification
- Data freshness
- Evidence quality

---

## 🛡 Trust Engine

Detects inconsistencies between multiple financial sources.

Examples

- GST vs Bank Credits
- Revenue vs UPI
- Missing Documents
- Data Mismatch
- Suspicious Patterns

---

## 🤖 AI Executive Summary

Generates plain-English explanations including

- Financial strengths
- Business risks
- Missing evidence
- Recommended next steps

---

## 📂 Evidence Center

Provides complete transparency by displaying

- Data sources used
- Verification status
- Evidence availability
- Cross-verification matrix
- Anomaly flags

---

## 📑 Decision Workspace

Supports credit officers with

- AI Recommendation
- Confidence Simulator
- Officer Notes
- Request Additional Documents
- Final Decision Workflow

---

# 🧠 AI Usage

This project uses AI to **assist** credit officers.

AI is used for

- Explainable financial summaries
- Natural language assessment reports
- Risk explanation
- Pattern recognition
- Anomaly detection
- Evidence interpretation

Business scoring is generated using deterministic rule-based engines, while AI converts analytical outputs into understandable insights.

**The final lending decision always remains with the bank.**

---

# ⚙️ Assessment Workflow

```
Loan Application
        │
        ▼
Customer Consent
        │
        ▼
Alternate Data Collection
(GST • AA • UPI • EPFO)
        │
        ▼
Data Validation
        │
        ▼
Health Engine
        │
Confidence Engine
        │
Trust Engine
        │
        ▼
AI Executive Summary
        │
        ▼
Financial Health Card
        │
        ▼
Credit Officer Review
        │
        ▼
Decision Workspace
```

---

# 🏗 System Architecture

```
                    MSME Loan Application
                              │
                              ▼
                     Customer Consent
                   (Account Aggregator)
                              │
                              ▼
      ┌─────────────────────────────────────┐
      │     Alternate Financial Data        │
      │                                     │
      │  • GST                             │
      │  • Bank Statements                 │
      │  • UPI                             │
      │  • EPFO                            │
      │  • Utility Payments                │
      └─────────────────────────────────────┘
                              │
                              ▼
                 Data Normalization Layer
                              │
                              ▼
                  Rule-Based Assessment
                              │
             ┌─────────┬──────────┬─────────┐
             ▼         ▼          ▼
      Health Engine Confidence Trust Engine
             │         │          │
             └─────────┴──────────┘
                       │
                       ▼
          AI Executive Summary Generator
                       │
                       ▼
            Financial Health Card UI
                       │
                       ▼
             Credit Officer Decision
                       │
                       ▼
               Loan Origination System
```

---

# 🖥 Application Screens

The prototype consists of multiple enterprise-grade screens.

### Dashboard

- Portfolio Overview
- Pending Applications
- Advanced Filters
- Bulk Export

---

### Financial Health Card

- Health Score
- Confidence Score
- Trust Status
- Radar Chart
- AI Summary

---

### Dimension Explorer

- Financial Trend Analysis
- Monthly Performance
- Score Breakdown
- Supporting Evidence

---

### Trust & Evidence Center

- Cross Verification Matrix
- Evidence Vault
- Anomaly Detection
- Data Completeness

---

### Decision Workspace

- AI Recommendation
- Confidence Simulator
- Officer Notes
- Final Decision

---

# 💻 Technology Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Zustand
- Recharts
- Axios

---

## Backend

- FastAPI
- SQLAlchemy
- Asyncpg
- PostgreSQL
- Pydantic
- Alembic
- Redis

---

## AI Layer

- Explainable AI
- Rule-Based Financial Assessment
- Pattern Detection
- Natural Language Summary Generation

---

# 📁 Project Structure

```text
idbi-finhealth/
│
├── 📁 backend/
│   ├── requirements.txt
│   ├── 📁 uploads/
│   │
│   └── 📁 app/
│       ├── 📄 main.py
│       │
│       ├── 📁 core/
│       │   ├── config.py
│       │   ├── security.py
│       │   └── ai_client.py
│       │
│       ├── 📁 api/
│       │   └── 📁 v1/
│       │       ├── router.py
│       │       ├── deps.py
│       │       └── 📁 endpoints/
│       │           ├── applications.py
│       │           ├── assessments.py
│       │           ├── decisions.py
│       │           ├── analytics.py
│       │           └── documents.py
│       │
│       ├── 📁 db/
│       │   ├── base.py
│       │   ├── models.py
│       │   └── database.py
│       │
│       ├── 📁 schemas/
│       │   ├── application.py
│       │   ├── assessment.py
│       │   └── ai.py
│       │
│       ├── 📁 engines/
│       │   ├── health_engine.py
│       │   ├── confidence_engine.py
│       │   ├── trust_engine.py
│       │   └── rules.py
│       │
│       └── 📁 services/
│           ├── assessment_service.py
│           ├── data_generator.py
│           └── mock_data.py
│
└── 📁 frontend/
    ├── package.json
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── postcss.config.mjs
    ├── .eslintrc.json
    │
    ├── 📁 public/
    │   └── idbi-logo.svg
    │
    ├── 📁 app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   │
    │   ├── 📁 dashboard/
    │   ├── 📁 portfolio/
    │   ├── 📁 assessments/
    │   └── 📁 application/[id]/
    │       ├── page.tsx
    │       ├── dimensions/
    │       ├── evidence/
    │       ├── documents/
    │       └── decision/
    │
    ├── 📁 components/
    │   ├── layout/
    │   ├── dashboard/
    │   └── documents/
    │
    ├── 📁 lib/
    │   ├── api-client.ts
    │   ├── store.ts
    │   └── utils.ts
    │
    └── 📁 types/
        └── index.ts
```

---

# 🚀 Installation

## Backend

```bash
cd backend

python -m venv venv

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend

```
http://localhost:3000
```

``

---

# 🔮 Future Scope

- Live Account Aggregator Integration
- ULI Integration
- OCEN Integration
- Real-time Financial Monitoring
- Portfolio Analytics
- AI Relationship Manager Copilot
- Early Warning System
- Automated Document OCR

---



# 📄 License

Developed exclusively for the **IDBI Innovate 2026 Hackathon** for educational and demonstration purposes.
