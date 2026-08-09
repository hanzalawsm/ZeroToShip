# Phase 5 — AI Intent Extraction & Orchestration Engine

Welcome to **Phase 5** of **ZeroToShip | Summer Activity 2026**.

## Overview

In Phase 5, we implemented an intelligent NLP Intent Extraction and AI Reasoning Engine that converts unstructured user input (in English, Urdu, or Roman Urdu) into structured service parameters and matches them against verified local service providers in Karachi.

---

## Key Features Developed in Phase 5

1. **Structured Natural Language Intent Extraction**:
   - Integrated Google Gemini API (`google-genai` SDK with `response_schema` enforcement) to extract `service`, `location`, `time`, `confidence`, and `is_service_request`.
   - Native support for Roman Urdu phrases (e.g., *"nal wala Gulshan me"*, *"bijli ka kaam DHA"*).
   - Built-in rule-based fallback extractor (`_rule_based_intent_fallback`) when API keys are absent or network requests time out.

2. **Database Provider Ranking & Filtering**:
   - Formulates SQLModel queries filtering providers by `category` and `neighborhood_zone`.
   - Ranks results multi-dimensionally by `rating` (descending), `completion_rate` (descending), and `available_now` (boolean priority).
   - Graceful fallback strategies if specific zone/category combinations yield no initial database matches.

3. **AI Justification & Reasoning**:
   - Generates natural language reasoning summaries (`summary`, `key_factors`, `alternative_count`) explaining why the top provider was selected.
   - Non-service prompt detection: Handles general greetings and out-of-scope requests politely without displaying provider cards.

4. **Frontend Chat Interface**:
   - Modern Next.js chat interface featuring auto-scrolling, loading state indicators, provider preview cards, and one-click booking triggers.

---

## Directory Structure

```text
Phase-5/
├── backend/
│   ├── main.py              # Extended FastAPI server with /api/orchestrate endpoint
│   ├── orchestrator.py      # Core intent extraction, ranking, and reasoning module
│   ├── test_orchestrator.py # Automated unittest suite
│   ├── models.py            # Pydantic & SQLModel data definitions
│   ├── auth.py              # JWT & Auth module
│   └── database.py          # SQLite database connection module
├── frontend/                # Next.js 15 Web Application
├── expo-frontend/           # React Native / Expo Mobile Application prototype
└── Output/                  # Deliverables, screenshots, and logs
```

---

## Learnings & Key Takeaways

- **Structured Output Constraints**: Enforcing JSON schema contracts with LLMs drastically reduces parsing errors and simplifies frontend integration.
- **Resilient Fallbacks**: Implementing a local Regex/Rule-based fallback guarantees system availability even during external API downtime.
- **Multilingual Recognition**: Accounted for Roman Urdu variations common in local urban Pakistani markets.
