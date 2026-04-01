# Neura Fullstack Web-application


# Neura

A full-stack productivity app for managing projects and tasks. Built as a portfolio project to demonstrate professional backend engineering, clean architecture, and modern DevOps practices.

**[Live Demo](https://neura.zackaad.com)** · **[API Docs](https://neura.zackaad.com/api/v1/swagger-ui/index.html)**

> Demo account: `demo@neura.dev` / `DemoPassword123` — read-only, pre-populated with data.

---

## Tech Stack

**Backend:** Java 17, Spring Boot 3, Spring Security, JWT, PostgreSQL 15, Flyway, JUnit 5, Testcontainers, Maven

**Frontend:** React 18, TypeScript, Vite, TanStack Query, shadcn/ui, Tailwind CSS

**DevOps:** Docker, Docker Compose, Nginx, GitHub Actions, Hetzner, Let's Encrypt

---

## Features

- JWT authentication — stateless, BCrypt password hashing, 24hr expiry
- Project management — create, edit, delete with cascading task removal
- Task management — status tracking (Todo / In Progress / Done), due dates, ownership-scoped queries
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

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for full system design, security model, and architecture decisions.

---

## Local Setup

**Prerequisites:** Docker, Java 17+, Node 18+

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/neura.git
cd neura

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
cp .env.example .env   # fill in values
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
- Integration tests: repository layer against real PostgreSQL via Testcontainers
- Coverage: 70%+ on service layer (JaCoCo report at `target/site/jacoco/index.html`)

---

## Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md) — system design, security model, ADR log
- [Development Guide](./docs/DEVELOPMENT.md) — local setup, branching, conventions
- [Deployment Guide](./docs/DEPLOYMENT.md) — infrastructure, CI/CD pipeline
- [Testing Strategy](./docs/TESTING_STRATEGY.md) — pyramid, tooling, what's intentionally skipped

---

## Roadmap

These are planned features being actively developed:

- **Notes** — per-project markdown notes, backend complete, frontend in progress
- **Password update** — authenticated users can change their own password
- **Account deletion** — full data wipe with confirmation flow
- **Refresh tokens** — token rotation with Redis blocklist for proper logout invalidation
- **Pagination** — cursor-based pagination on project and task list endpoints
- **Rate limiting** — auth endpoint protection

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

Built by [Your Name] · [LinkedIn](#) · [Portfolio](#)