# Lumora + Cypher Swift Partner Network — Technical Limitations & Commercial Clearances

This document transparently itemizes the production boundaries, external third-party credential dependencies, and business terms requiring formal corporate approval.

---

## 1. Features Requiring External Third-Party Credentials

| Provider / Integration | Required Production Secrets | Development Local Adapter |
| :--- | :--- | :--- |
| **SMS OTP Verification** | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` (or MSG91) | `ConsoleAdapter` (logs 6-digit OTP directly to server terminal stdout) |
| **Transactional Email** | `SMTP_USER`, `SMTP_PASS`, `RESEND_API_KEY` | `ConsoleEmailAdapter` (prints HTML and text body to server terminal stdout) |
| **Push Notifications** | `FCM_PROJECT_ID`, `FCM_PRIVATE_KEY` | `ConsolePushAdapter` + in-app notification inbox fallback |
| **Private Document Storage** | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_KEY` | `LocalFilesystemAdapter` (stores files in local media directory with authenticated static serve) |
| **Govt / KYC Verification** | `SUREPASS_API_TOKEN` / `HYPERVERGE_APP_ID` | `MockKycAdapter` (returns deterministic simulated KYC response) |

---

## 2. Items Requiring Formal Business & Legal Approval

1. **Commercial Price of Shared Business Diagnostic (₹37,000 / 3,700,000 paise):**
   - The proposed ₹37,000 price point, 18% GST applicability, scope of deliverables, payment milestones, and refund policies are configured as proposal data and require final board and finance signatory approval before executing binding client contracts.
2. **Fixed Commission Policy Terms:**
   - ₹1,000 fixed payout on Diagnostic Closure.
   - ₹10,000 fixed payout on Core Service First Milestone.
   - ₹1,00,000 annual performance reward upon reaching 15 client closures.
   - *These incentive structures are governed by versioned database policy entries (`commission_policies`) and require formal execution by authorized commercial directors.*
3. **Master Partner Agreement & Code of Conduct:**
   - Version 2.0 text in `agreements` table contains standard non-circumvention, confidentiality, and anti-bribery covenants that must receive formal clearance from Lumora and Cypher Swift legal counsel.
4. **TDS Withholding Structure (Section 194H):**
   - Payout calculations support configurable withholding tax rates (500 basis points / 5%). Tax advisory must verify PAN and GSTIN collection rules for individual versus corporate partner entities.

---

## 3. Operational & Platform Boundaries

1. **Self-Approval Barrier:**
   - Partners can never approve their own incentives or mark payments as received. This is hard-enforced in database middleware.
2. **Append-Only Immutability:**
   - Commission and audit ledger entries cannot be edited or deleted. Adjustments and reversals must be recorded as compensatory entries with documented business justification.
3. **Data Loss Prevention:**
   - On the mobile application, client drafts are stored in persistent local key-value storage. An app restart or intermittent network disconnection will not erase unsubmitted lead or meeting data.
