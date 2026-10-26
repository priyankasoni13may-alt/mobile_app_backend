# Lumora + Cypher Swift — Admin, Operations & Finance Operations Manual

This document details internal workflows for Operations Managers, Sales Directors, and Finance Heads using the **Next.js Administrative Web Console (`http://localhost:3000`)**.

---

## 1. Role Responsibilities Matrix

| Action | Operations | Sales | Finance | Super Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Review & Approve Partner Applications** | Yes | View | View | Yes |
| **Arbitrate Duplicate Lead Conflicts** | Yes | Request | No | Yes |
| **Verify Meeting Outcomes & Stage Transitions** | Yes | Yes | View | Yes |
| **Review Payment Evidence & Sign-offs** | View | Yes | Yes | Yes |
| **Approve / Reject Commissions** | No | No | **Yes** | Yes |
| **Create Payout Batches & Record Transfers** | No | No | **Yes** | Yes |
| **Trigger Annual Bonus Evaluations** | View | No | **Yes** | Yes |
| **System Settings & Audit Log Queries** | View | View | View | **Yes** |

---

## 2. Operations Workflows

### 2.1 Partner Review & Verification Queue (`/partners`)
1. Review partner credentials, years of experience, and ID verification status.
2. Verify that the mandatory Code of Conduct agreement has been accepted and all training quizzes scored >80%.
3. Action options: **Approve Application**, **Request Additional Info**, or **Reject** with audit reason.

### 2.2 Duplicate Lead Conflict Arbitration (`/leads`)
1. When two partners register the same corporate domain or decision-maker phone, the system generates a conflict item.
2. Operations inspects registration timestamps, client meeting invites, and correspondence evidence.
3. Decision: Assign full ownership to Primary Partner, Reassign to Contender with documented justification, or Split Attribution (e.g. 50/50).

---

## 3. Sales Workflows

### 3.1 Meeting Review & Deal Conversion (`/meetings`, `/deals`)
1. Review partner-submitted meeting outcomes.
2. Confirm qualification answers (Decision-maker present, active budget, clear timeline).
3. Generate Shared Business Diagnostic proposal (₹37,000) or Core Service contract.

---

## 4. Finance Workflows

### 4.1 Payment Evidence Verification (`/deals`)
1. Partner submits bank deposit slip or transaction UTR.
2. Finance cross-references deposit with corporate bank statements (HDFC/ICICI).
3. Tap **Verify Payment**. Deal stage updates to `WON`, automatically dispatching an event to the incentive engine.

### 4.2 Commission Approval Queue (`/commissions`)
1. Review pending commission entries. Inspect deal value, policy version, and calculation basis.
2. Tap **Approve Commission** or **Reject with Reason**.
3. **Immutability Invariant:** Once approved, commissions cannot be deleted. If a client refund or clawback occurs, Finance issues a compensatory entry via **Commission Adjustments**.

### 4.3 Payout Batch Disbursement & CSV Export (`/payouts`)
1. Tap **Generate New Payout Batch** to bundle all approved commissions.
2. Download bank-formatted NEFT/RTGS CSV for processing through corporate banking portal.
3. Once processed by bank, enter transaction reference (e.g. `HDFC-BULK-91823901`) and tap **Record Payments**. All ledger items transition to `PAID` with timestamp.

### 4.4 Annual Bonus Evaluation (`/bonus`)
1. Select partner and evaluation year.
2. System evaluates closed client threshold (15 clients) and checks for compliance infractions.
3. Tap **Approve Bonus (₹1,00,000)** to disburse annual performance reward.
