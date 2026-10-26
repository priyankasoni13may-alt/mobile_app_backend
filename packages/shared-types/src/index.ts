// ==============================================================================
// Lumora + Cypher Swift Partner Network — Shared TypeScript Types
// ==============================================================================

// --- 1. RBAC & User Roles ---

export enum UserRoleType {
  PARTNER = 'PARTNER',
  SALES = 'SALES',
  OPERATIONS = 'OPERATIONS',
  FINANCE = 'FINANCE',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum UserStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ONBOARDING = 'ONBOARDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED'
}

export enum OnboardingStatus {
  REGISTRATION_COMPLETED = 'REGISTRATION_COMPLETED',
  VERIFICATION_SUBMITTED = 'VERIFICATION_SUBMITTED',
  VERIFIED = 'VERIFIED',
  AGREEMENT_ACCEPTED = 'AGREEMENT_ACCEPTED',
  TRAINING_COMPLETED = 'TRAINING_COMPLETED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum VerificationStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  VERIFIED = 'VERIFIED',
  NEEDS_REVIEW = 'NEEDS_REVIEW',
  FAILED = 'FAILED'
}

// --- 2. Lead & Sales Pipeline ---

export enum LeadStage {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  UNQUALIFIED = 'UNQUALIFIED',
  MEETING_SCHEDULED = 'MEETING_SCHEDULED',
  MEETING_COMPLETED = 'MEETING_COMPLETED',
  DIAGNOSTIC_PROPOSED = 'DIAGNOSTIC_PROPOSED',
  DIAGNOSTIC_IN_PROGRESS = 'DIAGNOSTIC_IN_PROGRESS',
  DIAGNOSTIC_WON = 'DIAGNOSTIC_WON',
  SERVICE_PROPOSED = 'SERVICE_PROPOSED',
  SERVICE_WON = 'SERVICE_WON',
  CLOSED_LOST = 'CLOSED_LOST'
}

export enum LeadSource {
  DIRECT_OUTREACH = 'DIRECT_OUTREACH',
  REFERRAL = 'REFERRAL',
  NETWORKING_EVENT = 'NETWORKING_EVENT',
  INBOUND = 'INBOUND',
  LINKEDIN = 'LINKEDIN',
  OTHER = 'OTHER'
}

export enum DuplicateMatchType {
  DOMAIN = 'DOMAIN',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  COMPANY_NAME = 'COMPANY_NAME'
}

export enum LeadConflictDecision {
  PENDING = 'PENDING',
  ORIGINAL_OWNER = 'ORIGINAL_OWNER',
  NEW_CLAIMANT = 'NEW_CLAIMANT',
  SPLIT = 'SPLIT',
  REJECTED = 'REJECTED'
}

// --- 3. Meetings ---

export enum MeetingMode {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON'
}

export enum MeetingStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  RESCHEDULED = 'RESCHEDULED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

// --- 4. Deals & Payments ---

export enum DealType {
  DIAGNOSTIC = 'DIAGNOSTIC',
  SERVICE = 'SERVICE'
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  SIGNED = 'SIGNED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  EVIDENCE_SUBMITTED = 'EVIDENCE_SUBMITTED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentEvidenceStatus {
  SUBMITTED = 'SUBMITTED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

// --- 5. Commission & Financial Ledger ---

export enum CommissionTriggerType {
  DIAGNOSTIC_CLOSURE = 'DIAGNOSTIC_CLOSURE',
  SERVICE_MILESTONE = 'SERVICE_MILESTONE',
  ANNUAL_BONUS = 'ANNUAL_BONUS'
}

export enum CommissionStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  HELD = 'HELD',
  BATCHED = 'BATCHED',
  PAID = 'PAID'
}

export enum RoundingRule {
  FLOOR = 'FLOOR',
  CEIL = 'CEIL',
  ROUND = 'ROUND'
}

export enum CommissionAdjustmentType {
  REVERSAL = 'REVERSAL',
  CORRECTION = 'CORRECTION',
  CLAWBACK = 'CLAWBACK',
  REFUND_ADJUSTMENT = 'REFUND_ADJUSTMENT'
}

export enum PayoutBatchStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED'
}

export enum BonusStatus {
  EVALUATING = 'EVALUATING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  DISQUALIFIED = 'DISQUALIFIED'
}

// --- 6. Tasks, Training & Notifications ---

export enum TaskType {
  OUTREACH = 'OUTREACH',
  MEETING_PREP = 'MEETING_PREP',
  FOLLOW_UP = 'FOLLOW_UP',
  PROPOSAL_CHECK = 'PROPOSAL_CHECK',
  PAYMENT_FOLLOW_UP = 'PAYMENT_FOLLOW_UP',
  OTHER = 'OTHER'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ContentType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
  QUIZ = 'QUIZ',
  POLICY = 'POLICY'
}

export enum NotificationType {
  APPLICATION_STATUS = 'APPLICATION_STATUS',
  LEAD_ASSIGNED = 'LEAD_ASSIGNED',
  MEETING_REMINDER = 'MEETING_REMINDER',
  MEETING_UPDATE = 'MEETING_UPDATE',
  COMMISSION_STATUS = 'COMMISSION_STATUS',
  PAYOUT_STATUS = 'PAYOUT_STATUS',
  POLICY_CHANGE = 'POLICY_CHANGE',
  TASK_OVERDUE = 'TASK_OVERDUE',
  SUPPORT_UPDATE = 'SUPPORT_UPDATE'
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  PUSH = 'PUSH',
  EMAIL = 'EMAIL'
}

export enum SupportTicketCategory {
  PAYOUT_DISPUTE = 'PAYOUT_DISPUTE',
  LEAD_CLAIM = 'LEAD_CLAIM',
  TECHNICAL_ISSUE = 'TECHNICAL_ISSUE',
  ACCOUNT_SETTINGS = 'ACCOUNT_SETTINGS',
  TRAINING_SUPPORT = 'TRAINING_SUPPORT',
  OTHER = 'OTHER'
}

export enum SupportTicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_ON_USER = 'WAITING_ON_USER',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

// --- 7. Core Interfaces ---

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: UserStatus;
  roles: UserRoleType[];
  emailVerifiedAt?: string | null;
  phoneVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerProfileDto {
  id: string;
  userId: string;
  title: string;
  yearsExperience: number;
  industries: string[];
  languages: string[];
  timezone: string;
  profileUrl?: string | null;
  photoUrl?: string | null;
  onboardingStatus: OnboardingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyDto {
  id: string;
  name: string;
  legalName: string;
  website?: string | null;
  sector?: string | null;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessUnitDto {
  id: string;
  companyId: string;
  name: string;
  brandPrimaryColor: string;
  brandAccentColor: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDto {
  id: string;
  businessUnitId: string;
  businessUnitName?: string;
  name: string;
  description: string;
  icp: string;
  deliverablesSummary: string;
  inclusions: string[];
  exclusions: string[];
  pitchGuide: string;
  objectionHandling: Record<string, string>;
  faqJson: Array<{ question: string; answer: string }>;
  approvedCaseStudies: Array<{ title: string; metric: string; description: string }>;
  qualificationQuestions: string[];
  priceMinorUnits: string; // BigInt as string
  priceFormatted?: string;
  currency: string;
  contentVersion: number;
  isActive: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadDto {
  id: string;
  companyId: string;
  businessUnitId: string;
  partnerId: string;
  ownerId: string;
  partnerName?: string;
  ownerName?: string;
  businessUnitName?: string;
  companyName: string;
  companyWebsite?: string | null;
  contactName: string;
  contactRole?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  geography: string;
  industry: string;
  serviceInterest: string;
  source: LeadSource;
  needSummary: string;
  consentBasis: string;
  stage: LeadStage;
  unqualifiedReason?: string | null;
  closedLostReason?: string | null;
  closedLostFollowUpAt?: string | null;
  nextActionAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivityDto {
  id: string;
  leadId: string;
  actorId: string;
  actorName?: string;
  activityType: string;
  notes?: string | null;
  outcome?: string | null;
  channel?: string | null;
  happenedAt: string;
  nextActionAt?: string | null;
}

export interface MeetingDto {
  id: string;
  leadId: string;
  leadCompanyName?: string;
  contactName?: string;
  organizerId: string;
  organizerName?: string;
  title: string;
  purpose: string;
  scheduledAtUtc: string;
  timezone: string;
  durationMinutes: number;
  mode: MeetingMode;
  meetingLinkOrLocation: string;
  inviteeEmails: string[];
  inviteeStatus?: string | null;
  meetingStatus: MeetingStatus;
  cancellationReason?: string | null;
  rescheduleCount: number;
  outcome?: MeetingOutcomeDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingOutcomeDto {
  id: string;
  meetingId: string;
  attendanceConfirmed: boolean;
  isQualified: boolean;
  requirementSummary: string;
  budgetRange?: string | null;
  timeline?: string | null;
  decisionProcess?: string | null;
  objections?: string | null;
  agreedNextAction: string;
  nextActionAt?: string | null;
  recordedById: string;
  recordedByName?: string;
  recordedAt: string;
}

export interface DealDto {
  id: string;
  leadId: string;
  leadCompanyName?: string;
  partnerId?: string;
  dealType: DealType;
  serviceId?: string | null;
  serviceName?: string | null;
  amountMinorUnits: string; // BigInt
  amountFormatted?: string;
  currency: string;
  contractStatus: ContractStatus;
  paymentStatus: PaymentStatus;
  billingFrequency?: string | null;
  expectedStartDate?: string | null;
  signedAt?: string | null;
  firstPaymentAt?: string | null;
  closedAt?: string | null;
  closedLostReason?: string | null;
  closedBy?: string | null;
  paymentEvidences?: PaymentEvidenceDto[];
  deliveryHandoff?: DeliveryHandoffDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentEvidenceDto {
  id: string;
  dealId: string;
  amountMinorUnits: string;
  currency: string;
  status: PaymentEvidenceStatus;
  receivedAt: string;
  paymentReference: string;
  evidenceUrl?: string | null;
  rejectionReason?: string | null;
  verifiedById?: string | null;
  verifiedByName?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
}

export interface DeliveryHandoffDto {
  id: string;
  dealId: string;
  approvedScope: string;
  contacts: Array<{ name: string; role: string; email: string; phone?: string }>;
  commitments: string;
  nextMeetingAt?: string | null;
  documentUrls: string[];
  handoffNotes?: string | null;
  createdById: string;
  createdAt: string;
}

export interface CommissionLedgerDto {
  id: string;
  partnerId: string;
  partnerName?: string;
  dealId: string;
  dealType?: DealType;
  policyId: string;
  policyVersion?: string;
  triggerEvent: CommissionTriggerType;
  calculationBasis: string;
  grossAmountMinorUnits: string;
  grossFormatted?: string;
  currency: string;
  status: CommissionStatus;
  rejectionReason?: string | null;
  holdReason?: string | null;
  approvedById?: string | null;
  approvedByName?: string | null;
  approvedAt?: string | null;
  paidAt?: string | null;
  paymentReference?: string | null;
  taxWithholdingMinorUnits?: string | null;
  netAmountMinorUnits?: string | null;
  idempotencyKey: string;
  createdAt: string;
}

export interface CommissionAdjustmentDto {
  id: string;
  originalLedgerEntryId: string;
  adjustmentType: CommissionAdjustmentType;
  amountMinorUnits: string;
  amountFormatted?: string;
  reason: string;
  createdById: string;
  createdByName?: string;
  createdAt: string;
}

export interface PayoutBatchDto {
  id: string;
  batchReference: string;
  totalAmountMinorUnits: string;
  totalFormatted?: string;
  currency: string;
  itemCount: number;
  status: PayoutBatchStatus;
  approvedById?: string | null;
  approvedByName?: string | null;
  approvedAt?: string | null;
  processedAt?: string | null;
  notes?: string | null;
  createdById: string;
  createdAt: string;
  items?: PayoutItemDto[];
}

export interface PayoutItemDto {
  id: string;
  batchId: string;
  commissionLedgerEntryId: string;
  partnerName?: string;
  amountMinorUnits: string;
  status: string;
  paymentReference?: string | null;
  paidAt?: string | null;
}

export interface BonusEvaluationDto {
  id: string;
  partnerId: string;
  partnerName?: string;
  bonusPeriodId: string;
  periodYear: number;
  targetEligibleClients: number;
  bonusAmountMinorUnits: string;
  actualEligibleClients: number;
  isEligible: boolean;
  status: BonusStatus;
  disqualificationReason?: string | null;
  evaluatedById?: string | null;
  evaluatedByName?: string | null;
  evaluatedAt?: string | null;
  paidAt?: string | null;
  paymentReference?: string | null;
  createdAt: string;
}

export interface TaskDto {
  id: string;
  leadId?: string | null;
  leadCompanyName?: string;
  userId: string;
  title: string;
  description?: string | null;
  taskType: TaskType;
  priority: TaskPriority;
  dueAt: string;
  snoozedUntil?: string | null;
  completedAt?: string | null;
  completedBy?: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationDto {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  dataJson?: Record<string, unknown> | null;
  channel: NotificationChannel;
  sentAt: string;
  readAt?: string | null;
  deliveryStatus: string;
}

export interface SupportTicketDto {
  id: string;
  userId: string;
  userName?: string;
  category: SupportTicketCategory;
  status: SupportTicketStatus;
  subject: string;
  description: string;
  attachmentUrls: string[];
  assignedToId?: string | null;
  assignedToName?: string | null;
  resolution?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEventDto {
  id: string;
  actorId: string;
  actorName?: string;
  action: string;
  entityType: string;
  entityId: string;
  beforeStateJson?: Record<string, unknown> | null;
  afterStateJson?: Record<string, unknown> | null;
  reason?: string | null;
  ipAddress?: string | null;
  requestId?: string | null;
  createdAt: string;
}

// --- 8. API Response Standards ---

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  requestId?: string;
  timestamp?: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  field_errors?: FieldError[];
  request_id?: string;
  timestamp: string;
}

// --- 9. Currency & Money Helpers ---

export function paiseToRupees(paise: bigint | string | number): number {
  const p = typeof paise === 'bigint' ? Number(paise) : Number(paise);
  return p / 100;
}

export function rupeesToPaise(rupees: number): bigint {
  return BigInt(Math.round(rupees * 100));
}

export function formatINR(paise: bigint | string | number): string {
  const rs = paiseToRupees(paise);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(rs);
}
