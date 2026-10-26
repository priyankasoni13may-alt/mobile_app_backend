-- Lumora + Cypher Swift Partner Network — Versioned Migration 0001_initial

-- CreateTable users
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "emailVerifiedAt" TIMESTAMP(3),
    "phoneVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable roles
CREATE TABLE IF NOT EXISTS "roles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable user_roles
CREATE TABLE IF NOT EXISTS "user_roles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedBy" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateTable partner_profiles
CREATE TABLE IF NOT EXISTS "partner_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "yearsExperience" INTEGER NOT NULL DEFAULT 0,
    "industries" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "languages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "profileUrl" TEXT,
    "photoUrl" TEXT,
    "onboardingStatus" TEXT NOT NULL DEFAULT 'REGISTRATION_COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "partner_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable verification_records
CREATE TABLE IF NOT EXISTS "verification_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'INTERNAL_DOC',
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "providerReference" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "notes" TEXT,
    "retentionUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "verification_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable agreements
CREATE TABLE IF NOT EXISTS "agreements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL UNIQUE,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable agreement_acceptances
CREATE TABLE IF NOT EXISTS "agreement_acceptances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    CONSTRAINT "agreement_acceptances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "agreement_acceptances_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "agreements" ("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "agreement_acceptances_userId_agreementId_key" ON "agreement_acceptances"("userId", "agreementId");

-- CreateTable learning_modules
CREATE TABLE IF NOT EXISTS "learning_modules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessUnitId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" TEXT NOT NULL DEFAULT 'ARTICLE',
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "contentVersion" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable learning_completions
CREATE TABLE IF NOT EXISTS "learning_completions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER,
    "acknowledgedVersion" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "learning_completions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "learning_completions_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "learning_modules" ("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "learning_completions_userId_moduleId_key" ON "learning_completions"("userId", "moduleId");

-- CreateTable companies
CREATE TABLE IF NOT EXISTS "companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "website" TEXT,
    "sector" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable business_units
CREATE TABLE IF NOT EXISTS "business_units" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brandPrimaryColor" TEXT NOT NULL DEFAULT '#0B192C',
    "brandAccentColor" TEXT NOT NULL DEFAULT '#FF6500',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "business_units_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE
);

-- CreateTable memberships
CREATE TABLE IF NOT EXISTS "memberships" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "businessUnitId" TEXT,
    "role" TEXT NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "assignedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "memberships_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "memberships_userId_companyId_businessUnitId_key" ON "memberships"("userId", "companyId", "businessUnitId");

-- CreateTable services
CREATE TABLE IF NOT EXISTS "services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessUnitId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icp" TEXT NOT NULL,
    "deliverablesSummary" TEXT NOT NULL,
    "inclusions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "exclusions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "pitchGuide" TEXT NOT NULL,
    "objectionHandling" JSONB NOT NULL DEFAULT '{}',
    "faqJson" JSONB NOT NULL DEFAULT '[]',
    "approvedCaseStudies" JSONB NOT NULL DEFAULT '[]',
    "qualificationQuestions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "priceMinorUnits" BIGINT NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "contentVersion" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "publishedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "services_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "business_units" ("id") ON DELETE CASCADE
);

-- CreateTable service_versions
CREATE TABLE IF NOT EXISTS "service_versions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "versionLabel" TEXT NOT NULL,
    "snapshotJson" JSONB NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    CONSTRAINT "service_versions_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE
);

-- CreateTable leads
CREATE TABLE IF NOT EXISTS "leads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "businessUnitId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyWebsite" TEXT,
    "contactName" TEXT NOT NULL,
    "contactRole" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "geography" TEXT NOT NULL DEFAULT 'India',
    "industry" TEXT NOT NULL,
    "serviceInterest" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'DIRECT_OUTREACH',
    "needSummary" TEXT NOT NULL,
    "consentBasis" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'NEW',
    "unqualifiedReason" TEXT,
    "closedLostReason" TEXT,
    "closedLostFollowUpAt" TIMESTAMP(3),
    "nextActionAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "leads_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE,
    CONSTRAINT "leads_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "business_units" ("id") ON DELETE CASCADE,
    CONSTRAINT "leads_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "leads_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "leads_companyWebsite_idx" ON "leads"("companyWebsite");
CREATE INDEX IF NOT EXISTS "leads_stage_idx" ON "leads"("stage");
CREATE INDEX IF NOT EXISTS "leads_partnerId_idx" ON "leads"("partnerId");

-- CreateTable lead_activities
CREATE TABLE IF NOT EXISTS "lead_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "notes" TEXT,
    "outcome" TEXT,
    "channel" TEXT,
    "happenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextActionAt" TIMESTAMP(3),
    CONSTRAINT "lead_activities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads" ("id") ON DELETE CASCADE,
    CONSTRAINT "lead_activities_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable meetings
CREATE TABLE IF NOT EXISTS "meetings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "scheduledAtUtc" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "mode" TEXT NOT NULL DEFAULT 'ONLINE',
    "meetingLinkOrLocation" TEXT NOT NULL,
    "inviteeEmails" JSONB NOT NULL DEFAULT '[]',
    "inviteeStatus" TEXT,
    "meetingStatus" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "cancellationReason" TEXT,
    "rescheduleCount" INTEGER NOT NULL DEFAULT 0,
    "reminderSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "meetings_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads" ("id") ON DELETE CASCADE,
    CONSTRAINT "meetings_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable meeting_outcomes
CREATE TABLE IF NOT EXISTS "meeting_outcomes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "meetingId" TEXT NOT NULL UNIQUE,
    "attendanceConfirmed" BOOLEAN NOT NULL DEFAULT true,
    "isQualified" BOOLEAN NOT NULL DEFAULT false,
    "requirementSummary" TEXT NOT NULL,
    "budgetRange" TEXT,
    "timeline" TEXT,
    "decisionProcess" TEXT,
    "objections" TEXT,
    "agreedNextAction" TEXT NOT NULL,
    "nextActionAt" TIMESTAMP(3),
    "recordedById" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "meeting_outcomes_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meetings" ("id") ON DELETE CASCADE,
    CONSTRAINT "meeting_outcomes_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable deals
CREATE TABLE IF NOT EXISTS "deals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "dealType" TEXT NOT NULL,
    "serviceId" TEXT,
    "amountMinorUnits" BIGINT NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "contractStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "billingFrequency" TEXT,
    "expectedStartDate" TIMESTAMP(3),
    "signedAt" TIMESTAMP(3),
    "firstPaymentAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "closedLostReason" TEXT,
    "closedLostFollowUpAt" TIMESTAMP(3),
    "closedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "deals_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads" ("id") ON DELETE CASCADE,
    CONSTRAINT "deals_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE SET NULL
);

-- CreateTable payment_evidences
CREATE TABLE IF NOT EXISTS "payment_evidences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL,
    "amountMinorUnits" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "paymentReference" TEXT NOT NULL,
    "evidenceUrl" TEXT,
    "rejectionReason" TEXT,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payment_evidences_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "deals" ("id") ON DELETE CASCADE,
    CONSTRAINT "payment_evidences_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users" ("id") ON DELETE SET NULL
);

-- CreateTable delivery_handoffs
CREATE TABLE IF NOT EXISTS "delivery_handoffs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dealId" TEXT NOT NULL UNIQUE,
    "approvedScope" TEXT NOT NULL,
    "contacts" JSONB NOT NULL DEFAULT '[]',
    "commitments" TEXT NOT NULL,
    "nextMeetingAt" TIMESTAMP(3),
    "documentUrls" JSONB NOT NULL DEFAULT '[]',
    "handoffNotes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "delivery_handoffs_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "deals" ("id") ON DELETE CASCADE,
    CONSTRAINT "delivery_handoffs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable commission_policies
CREATE TABLE IF NOT EXISTS "commission_policies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "policyVersion" TEXT NOT NULL UNIQUE,
    "triggerType" TEXT NOT NULL,
    "fixedAmountMinorUnits" BIGINT,
    "percentageBasisPoints" INTEGER,
    "roundingRule" TEXT NOT NULL DEFAULT 'ROUND',
    "eligibilityRulesJson" JSONB NOT NULL DEFAULT '{}',
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable commission_ledger (APPEND-ONLY)
CREATE TABLE IF NOT EXISTS "commission_ledger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partnerId" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "calculationBasis" TEXT NOT NULL,
    "grossAmountMinorUnits" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "rejectionReason" TEXT,
    "holdReason" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "paymentReference" TEXT,
    "taxWithholdingMinorUnits" BIGINT,
    "netAmountMinorUnits" BIGINT,
    "idempotencyKey" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "commission_ledger_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "commission_ledger_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "deals" ("id") ON DELETE CASCADE,
    CONSTRAINT "commission_ledger_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "commission_policies" ("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "commission_ledger_dealId_policyId_triggerEvent_key" ON "commission_ledger"("dealId", "policyId", "triggerEvent");

-- CreateTable commission_adjustments (APPEND-ONLY)
CREATE TABLE IF NOT EXISTS "commission_adjustments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalLedgerEntryId" TEXT NOT NULL,
    "adjustmentType" TEXT NOT NULL,
    "amountMinorUnits" BIGINT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "commission_adjustments_originalLedgerEntryId_fkey" FOREIGN KEY ("originalLedgerEntryId") REFERENCES "commission_ledger" ("id") ON DELETE CASCADE,
    CONSTRAINT "commission_adjustments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable bonus_periods
CREATE TABLE IF NOT EXISTS "bonus_periods" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "periodYear" INTEGER NOT NULL UNIQUE,
    "targetEligibleClients" INTEGER NOT NULL DEFAULT 15,
    "bonusAmountMinorUnits" BIGINT NOT NULL DEFAULT 10000000,
    "consistencyCriteria" JSONB NOT NULL DEFAULT '{}',
    "complianceCriteria" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable bonus_evaluations
CREATE TABLE IF NOT EXISTS "bonus_evaluations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partnerId" TEXT NOT NULL,
    "bonusPeriodId" TEXT NOT NULL,
    "actualEligibleClients" INTEGER NOT NULL DEFAULT 0,
    "isEligible" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'EVALUATING',
    "disqualificationReason" TEXT,
    "evaluatedById" TEXT,
    "evaluatedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "paymentReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bonus_evaluations_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "bonus_evaluations_bonusPeriodId_fkey" FOREIGN KEY ("bonusPeriodId") REFERENCES "bonus_periods" ("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "bonus_evaluations_partnerId_bonusPeriodId_key" ON "bonus_evaluations"("partnerId", "bonusPeriodId");

-- CreateTable payout_batches
CREATE TABLE IF NOT EXISTS "payout_batches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchReference" TEXT NOT NULL UNIQUE,
    "totalAmountMinorUnits" BIGINT NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable payout_items
CREATE TABLE IF NOT EXISTS "payout_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchId" TEXT NOT NULL,
    "commissionLedgerEntryId" TEXT NOT NULL UNIQUE,
    "amountMinorUnits" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_BATCH',
    "paymentReference" TEXT,
    "paidAt" TIMESTAMP(3),
    CONSTRAINT "payout_items_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "payout_batches" ("id") ON DELETE CASCADE,
    CONSTRAINT "payout_items_commissionLedgerEntryId_fkey" FOREIGN KEY ("commissionLedgerEntryId") REFERENCES "commission_ledger" ("id") ON DELETE CASCADE
);

-- CreateTable tasks
CREATE TABLE IF NOT EXISTS "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "taskType" TEXT NOT NULL DEFAULT 'FOLLOW_UP',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "dueAt" TIMESTAMP(3) NOT NULL,
    "snoozedUntil" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "completedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tasks_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads" ("id") ON DELETE SET NULL,
    CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable notifications
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "dataJson" JSONB,
    "channel" TEXT NOT NULL DEFAULT 'IN_APP',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "deliveryStatus" TEXT NOT NULL DEFAULT 'DELIVERED',
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable notification_preferences
CREATE TABLE IF NOT EXISTS "notification_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "meetingReminders" BOOLEAN NOT NULL DEFAULT true,
    "leadUpdates" BOOLEAN NOT NULL DEFAULT true,
    "policyChanges" BOOLEAN NOT NULL DEFAULT true,
    "payoutUpdates" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable support_tickets
CREATE TABLE IF NOT EXISTS "support_tickets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attachmentUrls" JSONB NOT NULL DEFAULT '[]',
    "assignedToId" TEXT,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "support_tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "support_tickets_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users" ("id") ON DELETE SET NULL
);

-- CreateTable audit_events (APPEND-ONLY)
CREATE TABLE IF NOT EXISTS "audit_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "beforeStateJson" JSONB,
    "afterStateJson" JSONB,
    "reason" TEXT,
    "ipAddress" TEXT,
    "requestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_events_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable idempotency_records
CREATE TABLE IF NOT EXISTS "idempotency_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "responseStatusCode" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL
);
