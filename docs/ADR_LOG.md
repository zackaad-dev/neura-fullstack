# Architecture Decision Records — Neura

This log tracks all architectural decisions made during the development of Neura.
Each ADR is stored in `/docs/adr/` using the [Nygard format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).
This file serves as the master index.

---

## ADR Index

| # | Title | Status | Date |
|---|-------|--------|------|
| [001](./adr/001-use-postgresql-over-nosql.md) | Use PostgreSQL over a NoSQL option | Accepted | 2026-02-20 |
| [002](./adr/002-layered-architecture.md) | Use Layered Architecture over Hexagonal | Accepted | 2026-02-20 |
| [003](./adr/003-jwt-stateless-auth.md) | Use JWT (Stateless) over Session-Based Auth | Accepted | 2026-02-20 |
| [004](./adr/004-no-refresh-tokens-mvp.md) | No Refresh Tokens for MVP | Accepted | 2026-02-20 |
| [005](./adr/005-flyway-over-hibernate-ddl.md) | Use Flyway for Schema Management over Hibernate DDL | Accepted | 2026-02-20 |
| [006](./adr/006-testcontainers-over-mocking.md) | Use Testcontainers over In-Memory DB Mocking | Accepted | 2026-02-20 |
| [007](./adr/007-manual-dto-mapping.md) | Manual DTO Mapping over MapStruct | Accepted | 2026-02-20 |

---

## ADR Status Definitions

- **Proposed** — Under consideration, not yet decided
- **Accepted** — Decision made and in effect
- **Deprecated** — Was accepted but is no longer relevant
- **Superseded** — Replaced by a newer ADR (link to replacement)

---

## How to Add a New ADR

1. Create a new file in `/docs/adr/` following the naming convention: `NNN-short-title.md`
2. Use the template below
3. Add an entry to the index table above

### ADR Template

```markdown
# ADR-NNN: Title

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-NNN

## Context
What situation prompted this decision? What forces are at play?

## Decision
What was decided?

## Alternatives Considered
- **Alternative A** — Why it was not chosen
- **Alternative B** — Why it was not chosen

## Consequences
What are the trade-offs of this decision? What becomes easier or harder?
```

---

## Individual ADR Summaries

### ADR-001 — PostgreSQL over NoSQL
Relational data with clear foreign key relationships (users → projects → tasks/notes) is a natural fit for a relational DB. NoSQL would add operational complexity with no benefit for this domain. Trade-off: less flexibility for schema evolution, mitigated by Flyway migrations.

### ADR-002 — Layered Architecture over Hexagonal
Layered (Controller → Service → Repository) is well-understood, widely recognized in enterprise codebases, and sufficient for this project's scope. Hexagonal/ports-and-adapters would be appropriate if infrastructure swapping were a real concern, which it is not here. Trade-off: tighter coupling to Spring than hexagonal would allow.

### ADR-003 — JWT Stateless Auth over Sessions
JWT avoids server-side session storage, making the backend stateless and horizontally scalable. Sessions would require shared session storage (e.g. Redis) between instances. Trade-off: tokens cannot be invalidated server-side before expiry without additional infrastructure (a blacklist or Redis).

### ADR-004 — No Refresh Tokens for MVP
Refresh token rotation adds meaningful complexity (rotation logic, storage, revocation). A 24-hour access token is sufficient for a portfolio demo. Trade-off: users must re-authenticate daily. Noted as a future improvement.

### ADR-005 — Flyway over Hibernate DDL Auto
Flyway gives explicit, versioned, auditable schema migrations that are safe in production. `ddl-auto=update` is unpredictable and dangerous outside development. Trade-off: slightly more upfront effort to write migration files.

### ADR-006 — Testcontainers over In-Memory DB Mocking
Testcontainers runs integration tests against a real PostgreSQL instance, catching SQL dialect issues and constraint behavior that H2 in-memory databases silently swallow. Trade-off: slower test startup, requires Docker in the CI environment.

### ADR-007 — Manual DTO Mapping over MapStruct
Manual mapping makes the transformation logic explicit and immediately readable to any reviewer without needing to understand an annotation processor. MapStruct would reduce boilerplate at the cost of "magic" that is harder to debug. Trade-off: more verbose code, acceptable for the scale of this project.

