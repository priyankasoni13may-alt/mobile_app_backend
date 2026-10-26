# Lumora + Cypher Swift Database Entity-Relationship Diagram

```mermaid
erDiagram
    users ||--o{ user_roles : "has"
    roles ||--o{ user_roles : "assigned"
    users ||--o| partner_profiles : "profile"
    users ||--o{ verification_records : "verifications"
    users ||--o{ agreement_acceptances : "accepts"
    agreements ||--o{ agreement_acceptances : "recorded_in"
    users ||--o{ learning_completions : "completes"
    learning_modules ||--o{ learning_completions : "completed_by"

    companies ||--o{ business_units : "owns"
    companies ||--o{ memberships : "has_members"
    business_units ||--o{ memberships : "unit_members"
    users ||--o{ memberships : "belongs_to"

    business_units ||--o{ services : "offers"
    services ||--o{ service_versions : "versions"

    companies ||--o{ leads : "registered_under"
    business_units ||--o{ leads : "scoped_to"
    users ||--o{ leads : "partner_owner"
    leads ||--o{ lead_activities : "activities"
    leads ||--o{ lead_claim_conflicts : "candidate_conflicts"
    leads ||--o{ duplicate_match_records : "duplicate_matches"
    leads ||--o{ tasks : "tasks"
    leads ||--o{ meetings : "discovery_meetings"
    meetings ||--o| meeting_outcomes : "outcome"

    leads ||--o{ deals : "converted_deals"
    services ||--o{ deals : "service_referenced"
    deals ||--o{ payment_evidences : "payments"
    deals ||--o| delivery_handoffs : "handoff"

    deals ||--o{ commission_ledger : "generates"
    commission_policies ||--o{ commission_ledger : "governed_by"
    users ||--o{ commission_ledger : "partner_earning"
    commission_ledger ||--o{ commission_adjustments : "adjustments"

    payout_batches ||--o{ payout_items : "items"
    commission_ledger ||--o| payout_items : "disbursed_in"

    bonus_periods ||--o{ bonus_evaluations : "evaluates"
    users ||--o{ bonus_evaluations : "partner_bonus"

    users ||--o{ notifications : "receives"
    users ||--o| notification_preferences : "preferences"
    users ||--o{ support_tickets : "submits"
    users ||--o{ audit_events : "actor"
```

## Entity Summary by Domain

| Category | Primary Models | Key Invariants |
| :--- | :--- | :--- |
| **Identity & Access** | `users`, `roles`, `user_roles`, `partner_profiles`, `verification_records` | Unique email and phone; bcrypt cost 10+; verification tracking |
| **Agreements & Training** | `agreements`, `agreement_acceptances`, `learning_modules`, `learning_completions` | Immutable acceptance records with client IP and user-agent |
| **Organization & Scope** | `companies`, `business_units`, `memberships` | Multi-tenant organization scoping; RBAC scoped to business units |
| **Service Catalogue** | `services`, `service_versions` | Versioned content snapshots; configurable diagnostic pricing |
| **Leads & Pipeline** | `leads`, `lead_activities`, `lead_claim_conflicts`, `duplicate_match_records` | Domain and phone unique checks; strict stage machine |
| **Meetings & Tasks** | `meetings`, `meeting_outcomes`, `tasks` | Mandatory qualification recording before deal conversion |
| **Deals & Operations** | `deals`, `payment_evidences`, `delivery_handoffs` | Evidence review workflow; BigInt integer paise |
| **Financial Ledger** | `commission_policies`, `commission_ledger`, `commission_adjustments`, `payout_batches`, `payout_items`, `bonus_periods`, `bonus_evaluations` | **Append-Only**; partner self-approval blocked; idempotent |
| **Audit & Governance** | `audit_events`, `idempotency_records`, `support_tickets`, `notifications` | Append-only system audit log with actor ID and before/after diffs |
