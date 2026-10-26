# Neura Fullstack Web-application

# Neura

A full-stack productivity app for managing projects and tasks. Built as a portfolio project to demonstrate professional backend engineering, clean architecture, and modern DevOps practices.

**[Live Demo](https://neura.zackaad.com)** · **[API Docs](https://neura.zackaad.com/api/v1/swagger-ui/index.html)**

> Demo account: `demo@neura.dev` / `DemoPassword123` — read-only, pre-populated with data.

---

## Tech Stack

**Backend:** Java 17, Spring Boot 3, Spring Security, JWT, PostgreSQL 15, Flyway, JUnit 5, Testcontainers, Maven

**Frontend:** React 18, TypeScript, Vite, TanStack Query, shadcn/ui, Tailwind CSS

**DevOps:** Docker, Docker Compose, Nginx, GitHub Actions, Contabo VPS, Let's Encrypt

---

## Features

- JWT authentication — stateless, BCrypt password hashing, 24hr expiry
- Password reset flow — token-based password reset for unauthenticated users with 15m expiration and demo guards
- Project management — create, edit, delete with cascading task removal
- Task management — status tracking (Todo / In Progress / Done), due dates, ownership-scoped queries
- Notes — per-project markdown notes with live preview and project integration
- Account management — editable display name, authenticated password update, account deletion with confirmation
- Demo account protection — read-only guard via `is_demo` flag, returns 403 on all mutations
- Consistent error envelope — all errors return `{ status, message, path, timestamp }`
- Layered architecture — Controller → Service → Repository, DTOs at every boundary

---

## Architecture

```
[React SPA] ──HTTP/JSON──> [Nginx] ──proxy /api/v1──> [Spring Boot :8080]
                                  ──static files──>  [React build]
                                                           |
                                                     [PostgreSQL 15]
```

The backend enforces ownership at the service layer — every resource query is scoped to the authenticated user. Returning 404 instead of 403 on ownership mismatches prevents leaking resource existence to other users.

---

## Local Setup

**Prerequisites:** Docker, Java 17+, Node 18+

```bash
# Clone
git clone https://github.com/zackaad-dev/neura-fullstack
cd neura-fullstack

# Start database only
docker compose -f docker-compose.dev.yml up -d

# Backend
cd backend
./mvnw spring-boot:run

# Frontend (new terminal)
cd frontend
pnpm install
pnpm dev
```

App runs at `http://localhost:5173`, API at `http://localhost:8080/api/v1`.

**Full stack via Docker:**

```bash
cp .env.example .env   # fill in valuesf
docker compose up --build
```

App available at `http://localhost`.

---

## Testing

```bash
cd backend
./mvnw verify
```

- Unit tests: service layer with Mockito, no Spring context loaded
- Coverage: 70%+ on service layer (JaCoCo report at `target/site/jacoco/index.html`)

Controller, integration, and frontend tests are not yet implemented — see [Roadmap](#roadmap).

---

## Roadmap

Known gaps, in roughly the order they should be tackled. The querying items are sequenced
deliberately — each depends on the one above it.

**Querying & data access**

- **Global task & note endpoints** — `GET /tasks` and `GET /notes` spanning all projects.
  Tasks and notes are currently only reachable under `/projects/{projectId}/...`, so the
  all-tasks view and the dashboard fan out one request per project and merge the results
  client-side. This is a prerequisite for everything below it.
- **Pagination** — cursor-based pagination on the list endpoints. The API exposes no query
  parameters today; every list endpoint returns its full result set.
- **Sorting** — a `sort` parameter (due date, created date, title). The only ordering that
  exists now is a hardcoded client-side sort by creation date.
- **Filtering** — filter tasks by status, due-date range, and project.
- **Search** — full-text search across task and note titles and content.
- **Supporting indexes** — on `tasks(status)`, `tasks(due_date)`, and the `created_at`
  columns. Only foreign-key indexes exist today; filtering, sorting, and keyset pagination
  all need these.

**Auth & security**

- **Rate limiting** — auth endpoint protection on login and password reset.
- **Refresh tokens** — token rotation with a Redis blocklist. `POST /auth/logout` is
  currently a no-op, so an issued JWT stays valid for its full 24h expiry.

**Testing**

- **Controller tests** — `@WebMvcTest` coverage for request validation and error envelopes.
- **Integration tests** — repository and full-stack coverage against real PostgreSQL via
  Testcontainers (the dependency is declared but not yet used).
- **Frontend tests** — component and hook coverage.

---

## Project Structure

```
neura/
├── backend/          # Spring Boot — Java 17, Maven
├── frontend/         # React 18 — TypeScript, Vite
├── docs/             # Architecture, deployment, testing docs
├── .github/
│   └── workflows/    # CI (test + build) and CD (deploy on push to main)
├── docker-compose.yml
└── README.md
```

---

Built by Zackaria Aaden · [LinkedIn](https://www.linkedin.com/in/zackaria-a-320a21278/) · [Portfolio](https://zackaad-dev.github.io/portofolio/)
