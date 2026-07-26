# Phase 2 - Backend API with Authentication

Phase 2 delivers a working backend service with registration and login endpoints on top of the SQLite schema.

## What was implemented

- Backend code: `Phase-2/backend/`
- Database schema: `Phase-2/backend/database/schema.sql`
- SQLite database: `Phase-2/backend/database/app.db`
- Output artifacts: `Phase-2/Output/`

## Approach

1. Reused the Phase 1 relational schema for users, providers, and bookings.
2. Added backend application modules for DB access, models, and auth flows.
3. Added API endpoints for auth operations and verified responses through captured outputs.

## Run (from repository root)

```powershell
cd Phase-2/backend
uv run uvicorn main:app --reload
```

## Deliverables

- [x] Backend service scaffolded and organized under `Phase-2/backend/`
- [x] Database schema and fresh DB present in `Phase-2/backend/database/`
- [x] Output evidence captured in `Phase-2/Output/`
