# Phase 3 - Headless AI Orchestrator: Intent Extraction, Algorithmic Ranking & Explainability

Phase 3 delivers the core operational AI APIs, prompt engineering constraints, and database ranking logic for the Smart Local Service Orchestrator using **Google Gemini API**.

---

## Deliverables & Architecture

- **`Phase-3/backend/orchestrator.py`**: Mandatory AI orchestration module integrating Google Gemini API (`google-genai` / `gemini-3.5-flash-lite`) for intent extraction and explanation generation.
- **`Phase-3/backend/main.py`**: FastAPI server exposing `POST /api/orchestrate`.
- **`Phase-3/backend/models.py`**: Pydantic and SQLModel schemas (`OrchestrateRequest`, `ExtractedIntent`, `OrchestrateResponse`, `Provider`).
- **`Phase-3/backend/database/app.db`**: Relational SQLite database pre-populated with Phase 1 provider schema and seed records.

---

## 1. Intent Extraction Endpoint (`POST /api/orchestrate`)

Accepts natural language text supporting multilingual inputs across **English**, **Urdu**, and **Roman Urdu** (e.g., *"Mujhe Gulshan mein kal subah electrician chahiye"*, *"Need a plumber in Johar tomorrow morning"*, *"پلمبر جوہر"*).

### Request Format
```json
POST /api/orchestrate
Content-Type: application/json

{
  "prompt": "Mujhe Gulshan mein kal subah plumber chahiye"
}
```

### Response Format
```json
{
  "intent": {
    "service": "plumber",
    "location": "Gulshan",
    "time": "Kal Subah"
  },
  "top_provider": {
    "provider_id": 1,
    "name": "Imran Plumbing Works",
    "category": "plumber",
    "neighborhood_zone": "Gulshan",
    "rating": 4.7
  },
  "all_matches": [
    {
      "provider_id": 1,
      "name": "Imran Plumbing Works",
      "category": "plumber",
      "neighborhood_zone": "Gulshan",
      "rating": 4.7
    }
  ],
  "explanation": "Selected 'Imran Plumbing Works' because they are the highest-rated plumber provider operating in Gulshan matching your request."
}
```

---

## 2. Ranking & Explainability Logic

1. **AI Extraction**: Prompts are passed to Gemini LLM (`gemini-3.5-flash-lite`) with structured JSON schema enforcement (`{"service": "...", "location": "...", "time": "..."}`).
2. **Standardization**:
   - `service` mapped to one of: `plumber`, `electrician`, `carpenter`, `painter`, `cleaner`.
   - `location` mapped to valid neighborhood zones: `Gulshan`, `Johar`, `Clifton`, `DHA`, `Nazimabad`, `North Nazimabad`, `PECHS`, `Malir`.
3. **Database Ranking**: Filters SQLite `providers` table matching `category` and `neighborhood_zone`, sorting by `rating` in descending order.
4. **AI Explainability**: Generates a Gemini LLM textual explanation justifying provider selection based on ratings and location matching.

---

## How to Run

1. Navigate to the backend directory:
   ```powershell
   cd Phase-3/backend
   ```

2. Set your Gemini API key (Mandatory):
   ```powershell
   $env:GEMINI_API_KEY="your_api_key_here"
   ```

3. Start the dev server:
   ```powershell
   uv run uvicorn main:app --reload
   ```
