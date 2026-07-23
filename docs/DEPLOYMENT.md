# Deployment Guide

## Infrastructure

Everything runs on a single Azure Virtual Machine. The stack:

- **Platform:** Azure VM (Standard B2ls_v2, 2 vCPUs, 4GB RAM — funded via Azure Student Pack credits)
- **Containers:** Docker Compose (3 services: PostgreSQL, Spring Boot, Nginx)
- **Reverse proxy:** Nginx — serves the React build as static files, proxies `/api/v1/*` to Spring Boot
- **SSL:** Let's Encrypt (auto-renewing via Certbot)
- **Domain:** `neura.zackaad.com` (IP: `74.241.129.17`)

---

## Docker Compose & Container Security

Three services in production:

```yaml
services:
  db:        # PostgreSQL 15 — persistent volume for data
  backend:   # Spring Boot JAR — connects to db, exposes internal 8080
  nginx:     # Serves React build + reverse proxy & TLS termination on ports 80/443
```

- **Container Port Isolation:** The `backend` service uses `expose: 8080` (internal container-to-container network only), ensuring Tomcat is not exposed to the public host interface. All public traffic must pass through Nginx.
- **Nginx Routing:** `proxy_pass http://neura-backend:8080/api/v1/;` proxies API requests while preserving full URL path prefixes.

---

## SSL & Two-Phase Nginx Bootstrap

To handle Let's Encrypt SSL bootstrap on a fresh VM without pre-existing certificates:

1. **Phase 1 (Bootstrap):** Launch using `nginx.http-only.conf` exposing standard HTTP (port 80) and `/.well-known/acme-challenge/` for Certbot validation.
2. **Certificate Issuance:** Run Certbot standalone to request and generate Let's Encrypt SSL certs under `/etc/letsencrypt`.
3. **Phase 2 (HTTPS Live):** Switch to `nginx.https.conf` for full TLS termination, HTTP → HTTPS redirection, and persistent certificate renewal mapping.

### Cert Renewal Cron Job

Certs are automatically renewed via a cron job on the Azure VM:

```bash
0 3 * * * docker run --rm -v /etc/letsencrypt:/etc/letsencrypt -v /var/www/certbot:/var/www/certbot certbot/certbot renew --quiet && docker compose -f /root/neura-fullstack/docker-compose.yml restart frontend
```

---

## CI/CD Pipeline

GitHub Actions runs on every push to `main` or `dev`:

```
Push to main/dev
  → Maven verify (compile + run all tests)
  → TypeScript check + ESLint + production build
  → SSH to Azure VM (via AZURE_HOST, AZURE_USER, AZURE_SSH_KEY)
  → docker-compose pull && docker-compose up -d
```

Tests are blocking — if Maven verify or the frontend build fails, nothing gets deployed. The pipeline file lives at `.github/workflows/deploy.yml`.

### Required GitHub Repository Secrets

Configure in GitHub Settings → Secrets and variables → Actions:
- `AZURE_HOST` — Public IP address of the Azure VM (`74.241.129.17`)
- `AZURE_USER` — SSH user for deployment
- `AZURE_SSH_KEY` — Private SSH key for Azure VM access

---

## Environment Variables

Secrets are injected via environment variables, never hardcoded. The `.env.example` in the repo documents what's needed:

- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` — PostgreSQL connection
- `JWT_SECRET` — signing key for JWT tokens
- `SPRING_PROFILES_ACTIVE` — `dev` or `prod`
- `ALLOWED_ORIGINS` — CORS whitelist (per-profile)

On the Azure VM, these live in a `.env` file outside version control.

---

## Monitoring

Minimal, but enough to know if something breaks:

- **Health check:** Spring Boot Actuator exposes `/actuator/health` on a separate port (8081), isolated from the public API. It verifies DB connectivity.
- **Logs:** Backend uses `@Slf4j` in `GlobalExceptionHandler` to record unexpected 500 errors. Container logs monitored via `docker compose logs -f`.
- **SSL:** Certbot auto-renews.

---

## Local Development vs Production

| | Local Dev | Production (Azure VM) |
|---|---|---|
| Platform | Local Docker / Workstation | Azure VM (B2ls_v2, 4GB RAM) |
| Database | Docker container on port **5433** | Docker container on internal network |
| Backend | `./mvnw spring-boot:run` on port **8085** | Docker container (`expose: 8080`) |
| Frontend | Vite dev server on **5173** with HMR | Static build served by Nginx (ports 80/443) |
| Actuator | Port **8081** | Port **8081** (internal only) |
| SSL | None | Let's Encrypt (HTTPS) |
| Config | `application-dev.properties` | `application-prod.properties` + env vars |

The port numbers are non-standard in dev (especially 5433 and 8085) to avoid collisions locally. See [DEVELOPMENT.md](./DEVELOPEMENT.md) for full local setup.