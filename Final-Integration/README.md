# Smart Local Service Orchestrator — Final Integration

Welcome to the **Final Integration** phase of **ZeroToShip | Summer Activity 2026**.

This repository contains the complete, fully integrated codebase for the **Smart Local Service Orchestrator** — an AI-powered local home service marketplace tailored for Karachi, Pakistan. It seamlessly connects natural language user requests (in English, Urdu, or Roman Urdu) to verified service professionals (Electricians, Plumbers, Carpenters, Painters, Cleaners) with automated intent extraction, database provider ranking, AI reasoning, profile management, and real-time booking management.

---

## 🌟 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router with Client Components)
- **Library**: React 19 & TypeScript
- **Styling**: Modern Vanilla CSS with dark mode, Glassmorphism, CSS View Transitions, CSS Variables & smooth animations
- **State & Auth**: React Context API (`AuthContext`) with persistent LocalStorage authentication tokens

### Backend
- **API Framework**: FastAPI (Python 3.10+) with asynchronous CORS middleware
- **ORM & Database**: SQLModel & SQLite (relational schema with Users, Providers, and Bookings tables)
- **Authentication**: Passlib (Bcrypt hashing) & PyJWT (Bearer token generation and security middleware)
- **AI Orchestration Engine**: Google Gemini API (`google-genai` SDK) with fallback rule-based NLP intent extraction and reasoning model

---

## 📂 Project Architecture

```text
Final-Integration/
├── backend/
│   ├── main.py                  # FastAPI endpoints (Auth, Providers, Bookings, Orchestration)
│   ├── models.py                # SQLModel schemas & Pydantic response models
│   ├── auth.py                  # Password hashing & JWT middleware
│   ├── database.py              # SQLite engine & dynamic connection session
│   ├── orchestrator.py          # AI Intent extraction, provider ranking & AI reasoning engine
│   ├── test_orchestrator.py     # Unittest suite for AI orchestration and fallback behavior
│   └── database/
│       ├── schema.sql           # SQL table definitions
│       └── seed.sql             # Seed data for verified Karachi providers
└── frontend/
    ├── src/
    │   ├── app/                 # Next.js App Router pages
    │   │   ├── page.tsx         # Main AI Chat Assistant page
    │   │   ├── profile/         # User profile page (view & edit details)
    │   │   ├── bookings/        # My Bookings tracking & status management page
    │   │   └── landing/         # Marketing & feature showcase landing page
    │   ├── components/          # Reusable UI components (Sidebar, ChatBubble, BookingModal)
    │   └── lib/                 # API Client (`api.ts`), Auth Context (`AuthContext.tsx`), Types (`types.ts`)
    ├── package.json
    └── next.config.ts
```

---

## ⚡ Local Setup & Installation

### Prerequisites
- **Node.js** (v18.x or v20+)
- **Python** (v3.10+) with `uv` or `pip`

---

### Step 1: Backend Setup & Launch

1. Navigate to the backend directory:
   ```bash
   cd Final-Integration/backend
   ```

2. Initialize virtual environment and install dependencies:
   ```bash
   # Using uv (recommended)
   uv venv
   uv sync

   # Or using standard pip
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install fastapi sqlmodel passlib pyjwt python-dotenv google-genai pytest
   ```

3. Configure Environment Variables (Optional):
   Create a `.env` file in `Final-Integration/backend/`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
   *(Note: If no API key is provided, the system automatically uses the rule-based intent fallback engine)*.

4. Start the FastAPI backend server:
   ```bash
   uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   The backend API will be live at `http://127.0.0.1:8000`. Interactive API docs are accessible at `http://127.0.0.1:8000/docs`.

---

### Step 2: Frontend Setup & Launch

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Final-Integration/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your web browser.

---

## 🧪 Step-by-Step Testing & Walkthrough Guide

Follow these steps to test the complete end-to-end functionality of the platform:

### 1. User Registration & Authentication
- Click **Login** / **Register** in the sidebar or top header.
- Create a new account with your name, email, and password.
- Observe instant state update: JWT token is stored securely in `localStorage`, and your avatar & name appear on the top bar and chat welcome screen.

### 2. Natural Language AI Chat & Service Matching
- Navigate to the **AI Assistant** page (`/`).
- Test prompt 1 (English): `"I need a plumber in Gulshan tomorrow"`
  - *Result*: Extracted intent identifies `service: plumber` and `location: Gulshan`. The AI ranks `Tariq Plumber` (4.8⭐) as the top match and displays provider cards with rating, completion rate, and response time.
- Test prompt 2 (Roman Urdu): `"Electrician chahiye DHA mein urgent"`
  - *Result*: Extracted intent maps `electrician` in `DHA`, recommending top DHA electrical specialists.
- Test prompt 3 (General Conversational): `"Hello, how can you help me?"`
  - *Result*: Recognized non-service prompt; AI responds politely introducing available services without returning dummy matches.

### 3. Booking Lifecycle
- On any matched provider card in the chat, click **Book Professional**.
- Pick a preferred date and time (e.g. `2026-08-10 at 10:00 AM`) and click **Confirm Booking**.
- Observe confirmation message in chat with Booking ID.
- Click **Bookings** in the sidebar (`/bookings`). View your active booking listed with `Pending` status.
- Test completing or cancelling the booking directly from the dashboard actions.

### 4. Profile Management
- Click **Profile** in the sidebar (`/profile`).
- Update your name or phone number and click **Save Changes**.
- Refresh the page to confirm persistent dynamic data loading from the backend database.

---

## 🧪 Running Automated Unit Tests

To run the automated test suite covering AI orchestrator intent extraction, fallback handling, and database ranking logic:

```bash
cd Final-Integration/backend
uv run python test_orchestrator.py
```

*Expected output*: `Ran 4 tests ... OK`
