# Lumora + Cypher Swift REST API Reference

> **Base URL:** `http://localhost:4000/api/v1`  
> **Interactive Swagger / OpenAPI 3.0 Documentation:** `http://localhost:4000/api/docs`  
> **Authentication Header:** `Authorization: Bearer <access_token>`  
> **Idempotency Header:** `X-Idempotency-Key: <unique-uuid-or-string>` (required for financial mutations)

---

## 1. Authentication & Identity (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new partner (fullName, email, phone, password) | None |
| `POST` | `/auth/login` | Sign in with email/phone & password | None |
| `POST` | `/auth/otp/send` | Request 6-digit OTP to phone or email (60s cooldown) | None |
| `POST` | `/auth/otp/verify` | Verify OTP and mark email/phone as confirmed | None |
| `POST` | `/auth/refresh` | Rotate refresh token and issue new 15-minute access token | Bearer (Refresh) |
| `POST` | `/auth/logout` | Revoke active session tokens | Bearer |
| `POST` | `/auth/forgot-password` | Request password reset token | None |
| `POST` | `/auth/reset-password` | Set new password with verified reset token | None |

---

## 2. Profiles & Onboarding Gate (`/me`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/me` | Get current authenticated user profile, roles, and status | Bearer |
| `PATCH` | `/me` | Update personal details, industries, languages, timezone | Bearer |
| `GET` | `/me/onboarding-status` | Evaluates the 5 mandatory gates: profile, verification, agreement, training, approval | Bearer |
| `POST` | `/me/photo` | Upload profile image | Bearer |

---

## 3. Verification & Agreements (`/verification`, `/agreements`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/verification/session` | Initiate automated ID verification session | Bearer |
| `GET` | `/verification/status` | Get current verification status (VERIFIED, NEEDS_REVIEW, etc.) | Bearer |
| `GET` | `/agreements` | List active policies & Code of Conduct | Bearer |
| `GET` | `/agreements/:id` | Get agreement full text and effective date | Bearer |
| `POST` | `/agreements/:id/accept` | Accept agreement with version, IP address, and user-agent | Bearer |

---

## 4. Learning & Training (`/learning`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/learning/modules` | List learning modules for user's assigned business units | Bearer |
| `GET` | `/learning/modules/:id` | Get module content and quiz questions | Bearer |
| `POST` | `/learning/modules/:id/complete` | Record completion, acknowledged version, and quiz score | Bearer |
| `GET` | `/learning/progress` | User's overall training completion percentage | Bearer |
| `POST` | `/admin/learning/modules` | Create or update training module (Admin CMS) | Bearer (Admin) |

---

## 5. Service Catalogue (`/services`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/services` | List published services with business unit filter | Bearer |
| `GET` | `/services/:id` | Get full pitch guide, ICP, objection handling, FAQs | Bearer |
| `POST` | `/services` | Create new service catalogue item | Bearer (Admin) |
| `PATCH` | `/services/:id` | Update service and generate version snapshot | Bearer (Admin) |

---

## 6. Leads & Pipeline (`/leads`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/leads` | List user's authorized leads with pagination & stage filters | Bearer |
| `POST` | `/leads` | Create new lead with automated duplicate check | Bearer |
| `GET` | `/leads/:id` | Lead details, contact info, and activity timeline | Bearer |
| `PATCH` | `/leads/:id/stage` | Update stage (enforces state machine transition matrix) | Bearer |
| `POST` | `/leads/:id/activities` | Append activity note (CALL, EMAIL, MEETING, NOTE) | Bearer |
| `POST` | `/leads/check-duplicate` | Pre-submission duplicate check by domain, phone, or email | Bearer |
| `POST` | `/leads/conflicts/:id/resolve` | Arbitrate duplicate ownership claim | Bearer (Ops/Admin) |

---

## 7. Meetings & Calendar (`/meetings`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/meetings` | List upcoming and past discovery meetings | Bearer |
| `POST` | `/meetings` | Book new discovery meeting with client | Bearer |
| `PATCH` | `/meetings/:id` | Reschedule or cancel meeting with reason | Bearer |
| `POST` | `/meetings/:id/outcome` | Record meeting attendance, qualification, and next action | Bearer |

---

## 8. Deals & Payment Evidence (`/deals`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/deals` | List deals linked to authorized leads | Bearer |
| `POST` | `/deals` | Create diagnostic or core service deal | Bearer |
| `POST` | `/deals/:id/payment-evidence` | Partner submits client payment receipt / UTR | Bearer |
| `PATCH` | `/deals/:id/verify-payment` | Finance verifies bank receipt & marks deal WON | Bearer (Finance) |
| `POST` | `/deals/:id/handoff` | Create delivery handoff record for operations | Bearer |

---

## 9. Commission Ledger & Incentives (`/commissions`, `/earnings`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/earnings/summary` | Partner's earnings overview (pending, approved, paid) | Bearer |
| `GET` | `/earnings/ledger` | Partner's immutable append-only commission entries | Bearer |
| `POST` | `/earnings/:id/dispute` | Partner lodges calculation discrepancy dispute | Bearer |
| `GET` | `/admin/commissions` | All pending commissions awaiting Finance review | Bearer (Finance) |
| `POST` | `/admin/commissions/:id/review` | Approve or reject incentive with audit reason | Bearer (Finance) |
| `POST` | `/admin/commissions/adjustments` | Create reversal or correction adjustment entry | Bearer (Finance) |

---

## 10. Finance & Payout Batches (`/admin/payouts`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/payouts/batches` | List payout batches | Bearer (Finance) |
| `POST` | `/admin/payouts/batches` | Bundle approved commissions into draft batch | Bearer (Finance) |
| `PATCH` | `/admin/payouts/batches/:id/approve` | Approve batch for bank processing | Bearer (Finance) |
| `POST` | `/admin/payouts/batches/:id/record-payments` | Record bank UTR / NEFT reference and complete batch | Bearer (Finance) |
| `GET` | `/admin/payouts/export` | Download audited CSV export of payout records | Bearer (Finance) |

---

## 11. Health & Readiness (`/health`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Application status, uptime, node environment |
| `GET` | `/health/ready` | Database (PostgreSQL) and Cache (Redis) live connectivity checks |
