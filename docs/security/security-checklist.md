# Lumora + Cypher Swift Partner Network — Security & Privacy Specification

> **Compliance Standards:** Digital Personal Data Protection Act (DPDP Act 2023), ISO/IEC 27001 Controls, OWASP Mobile & API Top 10.

---

## 1. Authentication & Session Management

| Control | Implementation | Verification Status |
| :--- | :--- | :--- |
| **Password Hashing** | Bcrypt with minimum 10 salt rounds | Enforced in `AuthService` |
| **JWT Access Tokens** | 15-minute validity signed with RS256/HS256 | Validated via `JwtStrategy` |
| **Refresh Token Rotation** | 7-day validity; each refresh generates a new token and revokes the previous token | Enforced in `auth/refresh` |
| **Session Revocation** | Explicit logout invalidates active tokens from the session store | Tested in `auth/logout` |
| **Rate Limiting** | Max 5 login attempts per 15 minutes per IP; max 3 OTP requests per 10 minutes | Enforced via NestJS Throttler |
| **OTP Security** | 6-digit cryptographic random; 5-minute expiry; 5 attempt threshold; 60s cooldown | Enforced in `OtpService` |

---

## 2. Authorization & Segregation of Duties

| Control | Implementation | Verification Status |
| :--- | :--- | :--- |
| **Server-Side RBAC** | Strict role guard checking `UserRoleType` on every protected endpoint | Enforced via `@Roles()` guard |
| **No Partner Self-Approval** | Financial rule `approvedById !== partnerId` prevents partners approving own incentives | Enforced in `CommissionsService` |
| **Record-Level Lead Isolation** | Partners can only query and mutate leads where `partnerId === currentUser.id` | Tested in `LeadsService` |
| **Financial Action Segregation** | Approval of commissions and disbursement of payout batches are separate roles | Enforced via Finance role check |
| **Super Admin Safeguards** | High-impact system actions require multi-factor confirmation and produce audit log entries | Logged in `audit_events` |

---

## 3. Financial Ledger Immutability

| Control | Implementation | Verification Status |
| :--- | :--- | :--- |
| **Append-Only Enforcement** | Prisma ORM middleware blocks `update` and `delete` operations on `commission_ledger`, `commission_adjustments`, and `audit_events` | Enforced at database service level |
| **Audit Log Trail** | All mutations record `actorId`, `action`, `entityType`, `entityId`, `beforeStateJson`, `afterStateJson`, `ipAddress`, and `timestamp` | Recorded in `audit_events` |
| **Integer Arithmetic** | All monetary values handled exclusively in integer paise (`BigInt`) to prevent float rounding exploits | Enforced across DTOs and database |
| **Idempotent Mutations** | Unique constraint on `(dealId + policyId + triggerEvent)` prevents duplicate payouts | Enforced via composite index |

---

## 4. Privacy & Data Protection (DPDP Act Compliance)

1. **Lawful Basis & Consent:** Partners explicitly accept Code of Conduct and privacy notices with IP address and user-agent logging before submitting business leads.
2. **Data Minimization:** Unnecessary PII is not collected. Government IDs are verified via authorized KYC provider adapters without storing raw Aadhaar/PAN cards unencrypted on disk.
3. **Short-Lived Signed URLs:** All client contracts, proposals, and payment receipts are stored in private Cloudflare R2 / S3 buckets accessible only via time-limited signed URLs (max 15-minute TTL).
4. **Encryption at Rest & in Transit:** All database storage encrypted with AES-256; all client-server communication strictly over TLS 1.3.
5. **No Mobile Bundle Secrets:** Mobile bundles contain zero backend API keys, JWT secrets, or cloud credentials. All external calls route through the NestJS backend API.
