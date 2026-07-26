# Phase 1 - Database Schema, Seed Data, and Validation

This phase is focused only on relational database setup and direct SQL queries.
No backend server logic or AI components are included in this phase.

## Deliverables

- `Phase-2/database/schema.sql`
- `Phase-1/database/seed.sql`
- `Phase-1/database/validate.sql`
- `Phase-1/Output/` (screenshots of execution and results)

## Required Tables

1. `users` with `user_id`, `name`, `email`, `password_hash`
2. `providers` with `provider_id`, `name`, `category`, `neighborhood_zone`, `rating`
3. `bookings` with `booking_id`, `user_id` (FK), `provider_id` (FK), `booking_time`, `status`

## Local Environment Setup (SQLite)

1. Check if SQLite is available:
   ```powershell
   sqlite3 --version
   ```
2. If not installed, install SQLite CLI and re-run:
   ```powershell
   sqlite3 --version
   ```
3. Confirm SQLite works:
   ```sql
   SELECT sqlite_version();
   ```

## How to Run

From repository root:

```powershell
sqlite3 Phase-1/database/phase1.db ".read Phase-2/database/schema.sql"
sqlite3 Phase-1/database/phase1.db ".read Phase-1/database/seed.sql"
sqlite3 Phase-1/database/phase1.db ".read Phase-1/database/validate.sql"
```

## What Validation Covers

- provider records exist
- required area strings (including `Gulshan` and `Johar`) are present
- categories are from predefined values
- zones are from predefined values
- rating stays in valid range
- booking status stays in valid values
- booking foreign keys point to existing users/providers

## ASCII Schema Diagram

```text
+-----------------------------+
|            users            |
+-----------------------------+
| PK  user_id INTEGER         |
|     name TEXT               |
| UQ  email TEXT              |
|     password_hash TEXT      |
+-----------------------------+
              1
              |
              | FK bookings.user_id -> users.user_id
              |
              *
+-----------------------------+        +-----------------------------+
|          bookings           |        |          providers          |
+-----------------------------+        +-----------------------------+
| PK  booking_id INTEGER      |        | PK  provider_id INTEGER     |
| FK  user_id INTEGER         |        |     name TEXT               |
| FK  provider_id INTEGER     |------->|     category TEXT           |
|     booking_time TEXT       | FK     |     neighborhood_zone TEXT  |
|     status TEXT             |        |     rating REAL             |
+-----------------------------+        +-----------------------------+
                                               ^
                                               |
                          FK bookings.provider_id -> providers.provider_id
```

```text
Constraints:
- providers.category IN ('plumber','electrician','carpenter','painter','cleaner')
- providers.neighborhood_zone IN ('Gulshan','Johar','Clifton','DHA','Nazimabad','North Nazimabad','PECHS','Malir')
- providers.rating BETWEEN 0 AND 5
- bookings.status IN ('Pending','Confirmed','Completed','Cancelled')
- users.email UNIQUE
```

## Submission Checklist

- [X] `Phase-2/database/schema.sql` defines all 3 required tables and keys.
- [X] `seed.sql` inserts realistic mock records.
- [X] `validate.sql` returns PASS for all checks.
- [X] `Output/` contains execution proof screenshots.
