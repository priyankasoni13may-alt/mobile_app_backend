# Lumora + Cypher Swift Partner Network — Operations & Deployment Guide

## 1. Prerequisites & Environment Setup

- Node.js `v20.x` LTS
- Docker `24+` & Docker Compose `v2+`
- PostgreSQL `16+` (standard port 5432)
- Redis `7+` (standard port 6379)

---

## 2. Local Development Deployment

```bash
# 1. Clone repository
git clone <repo-url>
cd lumora-cypher-partner-network

# 2. Configure environment variables
cp .env.example .env

# 3. Spin up local database & redis containers
npm run docker:up

# 4. Install dependencies
npm install

# 5. Execute versioned migrations & seed demo accounts
npm run db:migrate
npm run db:seed

# 6. Start development servers
npm run dev:api     # NestJS Backend API at http://localhost:4000
npm run dev:admin   # Next.js Admin Web Console at http://localhost:3000
npm run dev:mobile  # Expo React Native App at exp://localhost:8081
```

---

## 3. Production Multi-Container Docker Deployment

The production stack orchestrates:
- `api` — NestJS Node.js 20 production container
- `admin` — Next.js 14 standalone App Router container
- `postgres` — PostgreSQL 16 Alpine with persistent volume
- `redis` — Redis 7 Alpine with persistent append-only storage

```bash
docker compose -f infra/docker/docker-compose.yml up -d --build
```

---

## 4. Database Migration & Rollback Strategy

### Forward Migration:
```bash
# Generate SQL migration from schema updates
npx prisma migrate dev --name <migration_name> --schema=./database/prisma/schema.prisma

# Apply pending migrations in production pipeline
npx prisma migrate deploy --schema=./database/prisma/schema.prisma
```

### Rollback Strategy:
1. Always take an automated snapshot before applying migrations:
   ```bash
   bash infra/scripts/db-backup.sh
   ```
2. In the event of a breaking migration:
   - Revert application container to previous image tag.
   - Run restore script to revert PostgreSQL state:
     ```bash
     bash infra/scripts/db-restore.sh /backups/lumora_backup_<timestamp>.sql
     ```

---

## 5. Automated Backup & Disaster Recovery

The project includes pre-built backup and restore shell scripts in `infra/scripts/`:
- `infra/scripts/db-backup.sh`: Dumps full PostgreSQL database using `pg_dump` with UTC timestamps.
- `infra/scripts/db-restore.sh`: Drops and safely restores database from verified SQL dump.

---

## 6. Health & Liveness Probes

The backend exposes two specialized monitoring endpoints for container orchestrators (Kubernetes / ECS):

1. **Liveness Probe:** `GET /api/v1/health`
   - Response: `200 OK` `{ "status": "ok", "timestamp": "...", "uptime": 124.5 }`
2. **Readiness Probe:** `GET /api/v1/health/ready`
   - Validates live connection to PostgreSQL database pool and Redis ping.
   - Response: `200 OK` `{ "status": "ready", "database": "connected", "redis": "connected" }`
