# Deployment Guide

## Infrastructure

Everything runs on a single Digital Ocean droplet. The stack:

- **Platform:** Digital Ocean Droplet ($6/month)
- **Containers:** Docker Compose (3 services: PostgreSQL, Spring Boot, Nginx)
- **Reverse proxy:** Nginx — serves the React build as static files, proxies `/api/*` to Spring Boot
- **SSL:** Let's Encrypt (auto-renewing via Certbot)
- **Domain:** `neura.yourdomain.com`

---

## Docker Compose

Three services in production:

```yaml
services:
  db:        # PostgreSQL 15 — persistent volume for data
  backend:   # Spring Boot JAR — connects to db, exposes 8080
  nginx:     # Serves React build + reverse proxy to backend
```

Multi-stage Dockerfiles keep the images small. The backend Dockerfile runs `mvn package` in a build stage and copies just the JAR into a slim runtime image. The frontend Dockerfile builds the Vite production bundle and copies the output into an Nginx image.

---

## CI/CD Pipeline

GitHub Actions runs on every push to `main` or `dev`:

```
Push to main/dev
  → Maven verify (compile + run all tests)
  → TypeScript check + ESLint + production build
  → Build Docker images
  → SSH to droplet
  → docker-compose pull && docker-compose up -d
```

Tests are blocking — if Maven verify or the frontend build fails, nothing gets deployed. The pipeline file lives at `.github/workflows/deploy.yml`.

---

## Deployment Process

On a push to `main`:

1. CI runs the full test suite and builds Docker images
2. Images are pushed to the container registry
3. GitHub Actions SSHs into the droplet
4. Pulls the new images and restarts the containers with `docker-compose up -d`
5. Nginx picks up the new frontend build and backend automatically

Zero-downtime deployment isn't a goal for this project — the containers restart in a few seconds and that's fine for a portfolio demo.

---

## Environment Variables

Secrets are injected via environment variables, never hardcoded. The `.env.example` in the repo documents what's needed:

- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` — PostgreSQL connection
- `JWT_SECRET` — signing key for JWT tokens
- `SPRING_PROFILES_ACTIVE` — `dev` or `prod`
- `ALLOWED_ORIGINS` — CORS whitelist (per-profile)

On the droplet, these live in a `.env` file that's not in version control.

---

## Monitoring

Minimal, but enough to know if something breaks:

- **Health check:** Spring Boot Actuator exposes `/actuator/health` on a separate port (8081), isolated from the public API. It verifies DB connectivity.
- **Logs:** Standard Docker logs via `docker-compose logs -f`. Structured logging with SLF4J on the backend.
- **SSL:** Certbot auto-renews. If it fails, Nginx will still serve but browsers will show a certificate warning.

This is a portfolio project, not a production SaaS — Prometheus/Grafana monitoring is out of scope. If I needed it, I'd add it as a future improvement.

---

## Local Development vs Production

| | Local Dev | Production |
|---|---|---|
| Database | Docker container on port **5433** | Docker container on default port |
| Backend | `./mvnw spring-boot:run` on port **8085** | Docker container on 8080 |
| Frontend | Vite dev server on **5173** with HMR | Static build served by Nginx |
| Actuator | Port **8081** | Port **8081** (not exposed publicly) |
| SSL | None | Let's Encrypt |
| Config | `application-dev.properties` | `application-prod.properties` + env vars |

The port numbers are non-standard (especially 5433 and 8085) to avoid collisions with anything else running locally. See the [Development Guide](./DEVELOPMENT.md) for full local setup.