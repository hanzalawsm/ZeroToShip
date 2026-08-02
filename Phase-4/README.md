# Phase 4 - Client User Interface (React Native & Expo)

Phase 4 delivers the complete mobile client user interface for the **Smart Local Service Orchestrator** constructed using **React Native** and **Expo (v54)**. 

Following standard decoupled architecture principles, this phase is built statically using custom mock data before connecting live backend network integrations (scheduled for Phase 5).

---

## Deliverables & Architecture Overview

```text
Phase-4/
├── README.md
├── Output/
│   └── phase4_summary.md
└── frontend/
    └── smart-local-service-orchestrator/
        ├── app/
        │   ├── _layout.tsx               # Root Navigation Stack & Theme Provider
        │   └── (tabs)/
        │       ├── _layout.tsx           # Tab Bar Layout (Chat, Workspace, Inspector)
        │       ├── index.tsx             # Chat Prompt Interface Tab
        │       ├── recommendations.tsx   # Recommendations Workspace Tab
        │       └── inspector.tsx         # Intent Processing & Schema Inspector Tab
        ├── components/
        │   ├── ChatPromptInterface.tsx   # Mobile Search & Conversational Timeline Stream
        │   ├── RecommendationsWorkspace.tsx # Provider Cards & AI Reasoning Workspace
        │   ├── IntentInspectorView.tsx   # Schema & DB Ranking Mapping Visualizer
        │   └── ui/
        │       ├── ProviderCard.tsx      # Crisp Card Asset displaying Matched Statistics
        │       ├── AIReasoningCard.tsx   # Highlighted AI Reasoning Snippet Area
        │       ├── ConfirmBookingBtn.tsx # Unhooked, Static "Confirm Booking" Button Asset
        │       ├── BookingModal.tsx      # Interactive Booking Confirmation Preview
        │       ├── ChatBubble.tsx        # Timeline Bubble with Mock Intent Placeholders
        │       └── Badge.tsx             # Category, Zone, Intent & Status Badges
        ├── mock/
        │   └── mockData.ts               # Decoupled Provider Dataset & Chat History
        └── types/
            └── index.ts                  # TypeScript Domain Schemas
```

---

## Key Features Implemented

### 1. Chat Prompt Interface
- **Natural Language Search Input Box**: Clean mobile input bar with send actions and auto-suggest chips (supporting multilingual prompts in English, Urdu, and Roman Urdu like *"Need a plumber in Johar tomorrow morning"* and *"Mujhe Gulshan mein kal subah electrician chahiye"*).
- **Conversational Timeline Stream**: Dynamic timeline displaying user prompt bubbles, AI thinking states, and **Mock Intent Processing Placeholders** (showing extracted service category, neighborhood zone, time slot, and LLM confidence score).

### 2. Recommendations Workspace
- **Crisp Card Assets**: Cards showcasing matched provider statistics:
  - Provider Name & Verified Badge
  - Category tag (`plumber`, `electrician`, `carpenter`, `painter`, `cleaner`)
  - Neighborhood Zone tag (`Johar`, `Gulshan`, `Clifton`, `DHA`, `Nazimabad`, `PECHS`, `Malir`)
  - Rating Stars & Review Count (e.g. `4.9 ★ (142 reviews)`)
  - Response Speed & Job Success Rate %
  - Estimated Hourly Pricing (`PKR 1,500/hr`)
- **Clear Text Area for AI Reasoning**: Distinctive quote/callout containers displaying Gemini LLM reasoning snippets justifying provider ranking.
- **Unhooked, Static "Confirm Booking" Button Asset**: Primary action asset providing interactive visual feedback and displaying a modal confirmation preview.

### 3. Intent & Schema Inspector
- Visual tab demonstrating how natural language prompts translate to structured JSON intent schema and map to Phase 1-3 SQLite database tables.

---

## How to Run

1. Navigate to the frontend directory:
   ```bash
   cd Phase-4/frontend/smart-local-service-orchestrator
   ```

2. Run development server with `pnpm`:
   ```bash
   pnpm run web
   ```
   or
   ```bash
   pnpm start
   ```

3. Code Validation / Linting:
   ```bash
   pnpm run lint
   ```
