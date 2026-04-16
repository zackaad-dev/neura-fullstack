# Development Guide

## Prerequisites

- **Docker** — required for the dev database and for running integration tests (Testcontainers)
- **Java 17** — the backend won't compile on anything older
- **Maven** — ships with the wrapper (`./mvnw`), no global install needed
- **Node 18+** — for the frontend build
- **pnpm** — package manager for the frontend (`npm install -g pnpm`)

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/neura.git
cd neura
```

### 2. Start the dev database

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts a PostgreSQL 15 container on port **5433** (not the default 5432 — intentional, to avoid collisions).

### 3. Run the backend

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

The API starts on `http://localhost:8085/api/v1`. Flyway runs automatically on startup and applies any pending migrations.

Swagger UI is available at `http://localhost:8085/swagger-ui.html` (dev profile only).

### 4. Run the frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The Vite dev server starts on `http://localhost:5173` with hot module replacement. API requests are proxied to `localhost:8085` via the Vite config.

---

## Port Map

| Service | Port |
|---|---|
| Spring Boot API | **8085** |
| Actuator / health | **8081** |
| Dev database (PostgreSQL) | **5433** |
| Frontend (Vite) | **5173** |
| Full stack Docker (Nginx) | **80** |

These are non-standard on purpose. The dev database avoids 5432 in case you have a local Postgres running, and the backend avoids 8080 for the same reason.

---

## Environment Variables

The backend reads from `application-dev.properties` for local development. Sensitive values use `${ENV_VAR}` placeholders but the dev profile has sensible defaults so you don't need a `.env` file locally.

For production, see [Deployment Guide](./DEPLOYMENT.md).

---

## Running Tests

### Backend

```bash
cd backend

# Run all tests
./mvnw verify

# Run just unit tests (fast, no Docker needed)
./mvnw test

# Run with coverage report
./mvnw verify
# Report at: backend/target/site/jacoco/index.html
```

Integration tests use Testcontainers, which spins up a real PostgreSQL container. Docker must be running.

### Frontend

```bash
cd frontend
pnpm test
```

Minimal test suite — login, register, and protected route redirect.

---

## Running the Full Stack Locally (Docker)

If you want to test the production-like setup:

```bash
docker compose up --build
```

This starts all three containers (PostgreSQL, Spring Boot, Nginx) and serves the app on `http://localhost:80`. The backend runs behind Nginx, same as in production.

---

## Branching Strategy

```
main     ← production, deployed automatically
  └── dev    ← integration branch, CI runs here
       └── feature/TASK-1-task-crud    ← feature branches off dev
```

Feature branches are named `feature/{TICKET-ID}-{short-description}`. PRs go into `dev`, never directly into `main`. Squash merge if the commit history is noisy.

### Commit messages

Follow conventional commits:

```
feat(auth): add registration endpoint
fix(projects): return 404 instead of 403 for non-owner
chore: update Docker base images
test(tasks): add ownership check edge cases
```

---

## Project Structure

```
neura/
├── backend/                # Spring Boot (Java 17, Maven)
│   ├── src/main/java/app/neura/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   └── src/test/java/app/neura/
├── frontend/               # React + TypeScript + Vite
│   └── src/
│       ├── api/            # Fetch functions per resource
│       ├── components/     # Reusable UI components
│       ├── lib/            # Auth helpers, constants
│       └── pages/          # Route-level page components
├── docs/                   # Architecture, ADRs, guides
├── postman/                # Exported Postman collection
├── .github/workflows/      # CI/CD pipeline
├── docker-compose.yml      # Production stack
├── docker-compose.dev.yml  # Dev database only
└── README.md
```

---

## Common Gotchas

Things that have wasted time during development — saving them here so they don't waste yours.

**Flyway won't start:** Usually a duplicate version number. There can only be one file per version (e.g., you can't have both `V1__init.sql` and `V1__create_users.sql`). If you need to fix a migration that already ran locally, delete the `flyway_schema_history` record and drop the affected table, then run `./mvnw clean` before restarting — Flyway reads from `/target/classes/` and picks up stale cached files without the clean.

**Everything returns 403:** Check the error response format. If it's Spring Security's default shape (`{ timestamp, status, error, message }`), the security filter chain is blocking the request before it hits your code — check `SecurityConfig` for missing `permitAll()` rules. If it's the `ApiError` envelope, your code is running but throwing.

**Column name mismatch:** Java entity fields use camelCase (`updatedAt`), database columns use snake_case (`updated_at`). Always map explicitly with `@Column(name = "updated_at")`. Flyway doesn't care about your JPA annotations — it runs the raw SQL.

**Docker cache issues:** If the frontend Dockerfile builds but serves stale content, rebuild with `--no-cache`. This is usually caused by a mismatched WORKDIR and COPY path caching a failed layer.

**Base package is `app.neura`**, not `com.neura`. Every AI tool, template, and tutorial will default to `com.neura`. Always check imports and package declarations.