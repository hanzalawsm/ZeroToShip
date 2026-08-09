# ZeroToShip | Summer Activity 2026

Welcome to **ZeroToShip | Summer Activity 2026**. This repository contains the complete progression from Phase 1 through Phase 5 and the unified **Final Integration** of the **Smart Local Service Orchestrator** — an AI-powered local home service marketplace for Karachi, Pakistan.

---

## 📁 Repository Structure

```text
ZeroToShip/
├── Phase-1/             # Database Schema Design, SQLite Setup & Seed Data
├── Phase-2/             # FastAPI Backend Engine, Auth & CRUD Operations
├── Phase-3/             # Provider Search, Ranking Algorithm & API Endpoints
├── Phase-4/             # Next.js Web Interface & Dynamic UI Component Library
├── Phase-5/             # AI Intent Extraction, Multilingual NLP & Reasoning Engine
└── Final-Integration/   # Fully Unified Backend, Frontend, SQLite DB & Documentation
```

---

## 🚀 Phases Summary

| Phase | Title | Key Deliverables |
|---|---|---|
| **Phase 1** | Database Architecture | Relational SQLite schema (`app.db`), SQL DDL (`schema.sql`), and seed records (`seed.sql`). |
| **Phase 2** | Backend Engine & Auth | FastAPI server with JWT authentication (register/login/profile) and Passlib password hashing. |
| **Phase 3** | Provider Search & Ranking | Provider query filtering, multi-factor ranking (rating, completion rate, availability), and unit tests. |
| **Phase 4** | Web User Interface | Next.js 15 App Router interface with responsive CSS design, profile editor, and booking dashboard. |
| **Phase 5** | AI Orchestrator & NLP | Gemini LLM + Rule-based intent extractor for English & Roman Urdu, AI reasoning summaries, and prompt safety. |
| **Final Integration** | Production-Ready Submission | End-to-end connected stack, zero mock data, automated test suite, clean `.gitignore`, and full setup guide. |

---

## ⚡ Quick Start (Final Integration)

To test and run the final unified application:

1. **Backend**:
   ```bash
   cd Final-Integration/backend
   uv sync  # or pip install -r requirements
   uv run uvicorn main:app --reload
   ```

2. **Frontend**:
   ```bash
   cd Final-Integration/frontend
   npm install
   npm run dev
   ```

For detailed step-by-step instructions, testing guides, and API documentation, see [Final-Integration/README.md](file:///c:/Users/hanza/Documents/ZeroToShip/Final-Integration/README.md).
