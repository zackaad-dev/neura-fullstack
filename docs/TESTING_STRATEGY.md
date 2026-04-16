# Testing Strategy

## Philosophy

Tests are the spec, not an afterthought. The backend follows TDD — write a failing test, make it pass, refactor. The goal isn't a coverage number, it's a suite that catches real regressions and gives me confidence before deploying.

Target: 70%+ coverage on the backend service layer.

---

## Testing Pyramid

```
       [ E2E / API ]            ← Skipped for MVP
      [ Integration ]           ← Moderate — real DB via local Postgres container
    [   Unit Tests    ]         ← Many, fast, isolated business logic
```

Each layer has a distinct job. Only running integration tests makes the suite slow and flaky. Only running unit tests with mocks gives false confidence because you never hit real SQL. The mix matters.

---

## Unit Tests (Service Layer)

**Tools:** JUnit 5 + Mockito

No Spring context loaded — these stay fast. Dependencies (repositories, `PasswordEncoder`, `JwtUtil`) are mocked with `@Mock` and injected via `@InjectMocks`. The focus is business logic: authorization checks, exception paths, input edge cases.

| Test Class | What It Covers |
|---|---|
| `AuthServiceTest` | Registration success, duplicate email → 409 |
| `ProjectServiceTest` | Create, list, get, update, delete. Ownership: not-found throws, not-owner throws |
| `TaskServiceTest` | Same pattern — CRUD + double ownership check (project belongs to user, task belongs to project) |
| `NoteServiceTest` | Same pattern as tasks |

The service test is the first thing I write for each feature. It forces me to think through the interface before any implementation exists.

---

## Integration Tests (Repository + DB)

**Tools:** JUnit 5 + Testcontainers (PostgreSQL)

These run against a real Postgres instance spun up locally in a Docker container. The point is to catch things mocked unit tests can't: SQL dialect issues, constraint violations, cascade behavior, and Flyway migration correctness.

| Test Class | What It Covers |
|---|---|
| `UserRepositoryTest` | Save + `findByEmail` with real PostgreSQL |

I chose Testcontainers over H2 because H2 silently ignores some Postgres-specific behavior — constraint edge cases, enum handling, and certain index behaviors don't surface until you're running against the real engine. The tradeoff is slower test startup and requiring Docker to be running, but the parity with production is worth it. See [ADR-006](./ADR_LOG.md#adr-006--testcontainers-over-in-memory-db-mocking).

Docker is required in the development environment for these tests to run. In CI (GitHub Actions), Docker is available by default.

---

## Controller / Security Tests

**Tools:** JUnit 5 + MockMvc + Spring Security Test

These verify HTTP-layer behavior: correct status codes, request validation returning the `ApiError` envelope, and authentication enforcement. Protected endpoints should return 401 without a token and 403 with an invalid one.

---

## Frontend Tests

Minimal. Backend is the portfolio focus.

**Tools:** React Testing Library + Vitest

Limited to 2–3 critical flows: login form submission, register form submission, and protected route redirect when unauthenticated. I'm not chasing frontend coverage — the value is proving the auth wiring works end-to-end in the UI.

---

## CI Enforcement

Tests run on every push to `main` or `dev` via GitHub Actions (`./mvnw verify`). Failing tests block the pipeline — PRs can't merge with a red build. Coverage is measured by JaCoCo and the report lives at `backend/target/site/jacoco/index.html`.

---

## Manual Verification

Every backend endpoint is Postman-verified before any frontend work starts. The Postman collection (`postman/neura-api.json`) has auto-saved tokens and environment variables for local and production. Collection-level scripts assert no 5xx responses and response times under 2 seconds.

This isn't a substitute for automated tests — it's the sanity check that catches wiring issues (wrong path prefix, missing `permitAll`, broken filter chain) before I debug across the full stack.

---

## What I Intentionally Don't Test

| Area | Reason |
|---|---|
| E2E browser tests (Playwright/Cypress) | Time tradeoff — not worth it for an MVP with 5 pages |
| Frontend component coverage | Backend is the showcase piece |
| Performance / load tests | Not relevant at current scale |
| Spring/JPA internals | Trust the framework |