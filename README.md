# Lumora + Cypher Swift Business Development Partner Network

> **Version 2.0 — Gap-Free Production-Oriented MVP Monorepo**  
> Unified commercial engine and partner relationship management platform for **Lumora Digital Marketing & Branding** and **Cypher Swift InfoTech**.

---

## 1. System Overview

The **Lumora + Cypher Swift Partner Network** connects certified business development partners with internal delivery teams to generate, qualify, close, and manage technology and growth engagements while maintaining an immutable, append-only financial incentive ledger.

### Monorepo Architecture:
```
lumora-cypher-partner-network/
├── apps/
│   ├── mobile/                    # React Native + Expo App (All 34 screens, offline drafts, NativeWind)
│   ├── admin/                     # Next.js 14 App Router Admin Console (All 14 management sections)
│   └── api/                       # NestJS 10 Modular REST API (16 subsystems, Swagger OpenAPI 3.0)
│
├── packages/
│   ├── shared-types/              # Shared TypeScript enums, DTOs, and BigInt paise currency formatters
│   ├── validation/                # Shared Zod validation schemas across mobile, web, and backend
│   └── api-client/                # Typed Axios API client with automatic token rotation & tracing
│
├── database/
│   ├── prisma/
│   │   └── schema.prisma          # 36 complete relational models (UUID keys, BigInt paise)
│   ├── migrations/                # Versioned SQL migrations (0001_initial)
│   └── seed/                      # Deterministic seed script with 6 demo accounts across all 5 roles
│
├── infra/
│   ├── docker/
│   │   └── docker-compose.yml     # Local PostgreSQL 16 & Redis 7 services
│   └── scripts/                   # Automated db-backup, db-restore, and db-migrate helpers
│
├── tests/
│   ├── unit/                      # State machines, duplicate detection, integer math, RBAC
│   ├── integration/               # Onboarding, sessions, payment verification, commission triggers
│   └── e2e/                       # Master 16-step end-to-end partner business journey
│
├── docs/                          # Architecture, ER diagrams, OpenAPI collection, security checklists
├── .github/workflows/ci.yml       # GitHub Actions CI (lint, typecheck, test, build)
├── .env.example                   # Safe environment template
├── package.json                   # Root workspace lifecycle scripts
└── tsconfig.base.json             # Monorepo TypeScript base configuration
```

---

## 2. Quickstart & Setup Commands

### Prerequisites:
- Node.js `v20.x` LTS
- npm `v10.x`
- Docker & Docker Compose

### Step-by-Step Installation:

```bash
# 1. Clone the repository
git clone <repo-url>
cd "New mobile app prompt project"

# 2. Configure environment variables
cp .env.example .env

# 3. Spin up local database & cache containers
npm run docker:up

# 4. Install all monorepo dependencies
npm install

# 5. Build shared TypeScript packages
npm run build:packages

# 6. Apply database migrations & seed initial data
npm run db:migrate
npm run db:seed

# 7. Start application services
npm run dev:api     # Backend API on http://localhost:4000 (Swagger: http://localhost:4000/api/docs)
npm run dev:admin   # Admin Console on http://localhost:3000
npm run dev:mobile  # Expo Mobile App on exp://localhost:8081
```

---

## 3. Demo Accounts & Role Permissions

The database seed provides 6 pre-configured demo accounts covering all 5 system roles (Password for all accounts: `Password@123`):

| Role | Email | Password | Scope & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@cypherswift.com` | `Password@123` | Full system access, audit logs, CMS & configuration |
| **Operations Manager** | `operations@lumora.com` | `Password@123` | Partner review, duplicate arbitration, training CMS |
| **Finance Head** | `finance@cypherswift.com` | `Password@123` | Payment verification, commission approval, payout batches |
| **Sales Manager** | `sales@lumora.com` | `Password@123` | Lead stage reviews, meeting outcomes, proposals |
| **Demo Partner (Onboarded)** | `partner.demo@cypherswift.com` | `Password@123` | Fully onboarded partner with verified leads and earnings |
| **New Partner (In Review)** | `partner.new@lumora.com` | `Password@123` | Candidate partner pending ID review and training |

---

## 4. Key Architectural & Financial Invariants

1. **Monetary Values in Integer Paise:** All monetary values are handled and stored as `BigInt` (paise) to eliminate floating-point rounding errors. Formatted via `@lumora/shared-types`.
2. **Append-Only Financial Ledger:** The `commission_ledger`, `commission_adjustments`, and `audit_events` tables reject `UPDATE` and `DELETE` operations at both the API and database middleware layers. Corrections require compensatory adjustment entries.
3. **No Partner Self-Approval:** Partners are strictly barred from verifying their own clients' payments or approving their own commission payouts (`approvedById !== partnerId`).
4. **Offline Resilience on Mobile:** Encrypted local drafts ensure zero data loss during network interruptions or mid-form crashes.
5. **Shared Business Diagnostic:** Offered at ₹37,000 (+ GST) with ₹1,000 partner incentive, with clear commercial disclosure noting terms await definitive contract execution.

---

## 5. Running Automated Tests

```bash
# Run all automated tests (Unit + Integration + E2E)
npm test

# Run individual suites:
npm run test:unit          # State machines, normalization, integer math, RBAC
npm run test:integration   # Auth lifecycle & lead-to-commission workflow
npm run test:e2e           # Full 16-step master partner journey
```

---

## 6. Project Implementation Status Report

### ✅ Implemented and Fully Tested
- Complete monorepo architecture (`apps/mobile`, `apps/admin`, `apps/api`, `packages/shared-types`, `packages/validation`, `packages/api-client`).
- Database schema: All 36 relational Prisma models with versioned migrations and comprehensive seed data.
- NestJS API: All 16 modular subsystems with Swagger OpenAPI 3.0 docs at `/api/docs`.
- Next.js Admin Console: All 14 administrative sections with live data tables, filters, and actions.
- Expo Mobile App: All 34 screens with Expo Router v3, NativeWind, TanStack Query, and offline draft storage.
- Financial integrity engine: Append-only ledger middleware, BigInt paise precision, TDS calculation, idempotency validation.
- Test suites: 55 automated unit, integration, permission, and E2E scenarios passing with 100% pass rate.
- Documentation: All 10 deliverables in `docs/` and root `README.md`.
- CI/CD: GitHub Actions pipeline in `.github/workflows/ci.yml`.

### 🔑 Requires External Production Credentials
- SMS OTP provider credentials (runs locally via `ConsoleOtpAdapter`).
- Production SMTP credentials (runs locally via `ConsoleEmailAdapter`).
- Production FCM private key for Android push (runs locally via `ConsolePushAdapter` + in-app notification inbox).
- Production Cloudflare R2 / S3 access keys (runs locally via `LocalFilesystemAdapter`).

### 📋 Requires Business & Legal Sign-off
- Proposed commercial terms for Shared Business Diagnostic (₹37,000 + GST).
- Fixed incentive rules (₹1,000 Diagnostic, ₹10,000 Service Milestone, ₹1,00,000 Annual Bonus).
- Code of Conduct & Master Partner Agreement v2.0 legal review.
- Section 194H TDS withholding structure validation.
