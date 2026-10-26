// ==============================================================================
// Lumora + Cypher Swift Partner Network — Shared Zod Validation Schemas
// ==============================================================================

import { z } from 'zod';
import {
  UserRoleType,
  LeadStage,
  LeadSource,
  MeetingMode,
  DealType,
  ContractStatus,
  PaymentStatus,
  TaskPriority,
  TaskType,
  SupportTicketCategory,
  CommissionAdjustmentType,
  ContentType
} from '@lumora/shared-types';

// --- 1. Auth Schemas ---

export const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').regex(/^\+?[0-9\s\-()]+$/, 'Invalid phone number format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  role: z.nativeEnum(UserRoleType).default(UserRoleType.PARTNER),
  consentGiven: z.boolean().refine(val => val === true, 'You must accept the terms and consent')
});

export const LoginSchema = z.object({
  identifier: z.string().min(3, 'Email or phone number is required'),
  password: z.string().min(1, 'Password is required')
});

export const OtpVerifySchema = z.object({
  identifier: z.string().min(3, 'Email or phone is required'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^[0-9]+$/, 'OTP must be numeric')
});

export const RequestOtpSchema = z.object({
  identifier: z.string().min(3, 'Email or phone is required'),
  channel: z.enum(['email', 'sms']).default('sms')
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(10, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number')
});

// --- 2. Profile & Onboarding ---

export const UpdateProfileSchema = z.object({
  title: z.string().min(2, 'Professional title is required').max(100),
  yearsExperience: z.number().int().min(0, 'Years of experience cannot be negative').max(60),
  industries: z.array(z.string()).min(1, 'Select at least one industry'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  timezone: z.string().min(2, 'Timezone is required'),
  profileUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  photoUrl: z.string().url('Invalid photo URL').optional().or(z.literal(''))
});

export const AcceptAgreementSchema = z.object({
  agreementId: z.string().uuid('Invalid agreement ID')
});

// --- 3. Leads & Pipeline ---

export const CreateLeadSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  companyWebsite: z.string().optional().or(z.literal('')),
  contactName: z.string().min(2, 'Contact name is required'),
  contactRole: z.string().min(2, 'Contact role/designation is required'),
  contactEmail: z.string().email('Invalid contact email').optional().or(z.literal('')),
  contactPhone: z.string().min(8, 'Invalid contact phone').optional().or(z.literal('')),
  geography: z.string().min(2, 'Geography is required'),
  industry: z.string().min(2, 'Industry is required'),
  businessUnitId: z.string().uuid('Business unit is required'),
  serviceInterest: z.string().min(2, 'Service interest is required'),
  source: z.nativeEnum(LeadSource).default(LeadSource.DIRECT_OUTREACH),
  needSummary: z.string().min(10, 'Please describe client need in at least 10 characters'),
  consentBasis: z.string().min(2, 'Consent basis is required (e.g., direct discussion, event)')
});

export const UpdateLeadSchema = CreateLeadSchema.partial().extend({
  stage: z.nativeEnum(LeadStage).optional(),
  unqualifiedReason: z.string().optional(),
  closedLostReason: z.string().optional(),
  nextActionAt: z.string().datetime().optional().nullable()
});

export const DuplicateCheckQuerySchema = z.object({
  companyWebsite: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  companyName: z.string().optional()
});

export const LeadClaimConflictSchema = z.object({
  existingLeadId: z.string().uuid(),
  candidateLeadId: z.string().uuid().optional(),
  reason: z.string().min(10, 'Provide at least 10 characters justifying your claim')
});

export const ResolveLeadConflictSchema = z.object({
  decision: z.enum(['ORIGINAL_OWNER', 'NEW_CLAIMANT', 'SPLIT', 'REJECTED']),
  reason: z.string().min(5, 'Reason for decision is required'),
  splitPercentage: z.number().min(1).max(99).optional()
});

// --- 4. Meetings ---

export const CreateMeetingSchema = z.object({
  leadId: z.string().uuid('Lead ID is required'),
  title: z.string().min(3, 'Meeting title is required'),
  purpose: z.string().min(5, 'Meeting purpose is required'),
  scheduledAtUtc: z.string().datetime('Must be valid ISO-8601 UTC timestamp'),
  timezone: z.string().default('Asia/Kolkata'),
  durationMinutes: z.number().int().min(15).max(240).default(30),
  mode: z.nativeEnum(MeetingMode).default(MeetingMode.ONLINE),
  meetingLinkOrLocation: z.string().min(3, 'Meeting link or location is required'),
  inviteeEmails: z.array(z.string().email()).default([])
});

export const RecordMeetingOutcomeSchema = z.object({
  attendanceConfirmed: z.boolean(),
  isQualified: z.boolean(),
  requirementSummary: z.string().min(10, 'Summary of discussion and requirements is required'),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  decisionProcess: z.string().optional(),
  objections: z.string().optional(),
  agreedNextAction: z.string().min(3, 'Agreed next action is required'),
  nextActionAt: z.string().datetime().optional().nullable()
});

// --- 5. Deals & Payments ---

export const CreateDealSchema = z.object({
  leadId: z.string().uuid('Lead ID is required'),
  dealType: z.nativeEnum(DealType),
  serviceId: z.string().uuid().optional().nullable(),
  amountMinorUnits: z.string().regex(/^\d+$/, 'Amount must be integer paise as string'),
  currency: z.string().length(3).default('INR'),
  expectedStartDate: z.string().datetime().optional().nullable()
});

export const SubmitPaymentEvidenceSchema = z.object({
  dealId: z.string().uuid(),
  amountMinorUnits: z.string().regex(/^\d+$/, 'Amount must be integer paise'),
  currency: z.string().length(3).default('INR'),
  paymentReference: z.string().min(3, 'Payment reference or UTR is required'),
  evidenceUrl: z.string().url().optional(),
  receivedAt: z.string().datetime()
});

export const VerifyPaymentSchema = z.object({
  approved: z.boolean(),
  rejectionReason: z.string().optional()
});

export const DeliveryHandoffSchema = z.object({
  dealId: z.string().uuid(),
  approvedScope: z.string().min(10, 'Approved scope is required'),
  contacts: z.array(z.object({
    name: z.string().min(2),
    role: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional()
  })).min(1, 'At least one contact is required'),
  commitments: z.string().min(5, 'Key commitments are required'),
  nextMeetingAt: z.string().datetime().optional().nullable(),
  documentUrls: z.array(z.string().url()).default([]),
  handoffNotes: z.string().optional()
});

// --- 6. Commissions & Finance ---

export const ReviewCommissionSchema = z.object({
  approved: z.boolean(),
  reason: z.string().optional()
});

export const CommissionAdjustmentSchema = z.object({
  originalLedgerEntryId: z.string().uuid(),
  adjustmentType: z.nativeEnum(CommissionAdjustmentType),
  amountMinorUnits: z.string().regex(/^\d+$/, 'Amount must be integer paise'),
  reason: z.string().min(10, 'Audit reason is required for adjustments')
});

export const CreatePayoutBatchSchema = z.object({
  commissionLedgerEntryIds: z.array(z.string().uuid()).min(1, 'Select at least one commission entry'),
  notes: z.string().optional()
});

export const RecordBatchPaymentsSchema = z.object({
  paymentReference: z.string().min(3, 'Master payment reference is required')
});

// --- 7. Tasks ---

export const CreateTaskSchema = z.object({
  leadId: z.string().uuid().optional().nullable(),
  title: z.string().min(2, 'Task title is required'),
  description: z.string().optional(),
  taskType: z.nativeEnum(TaskType).default(TaskType.FOLLOW_UP),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  dueAt: z.string().datetime()
});

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  snoozedUntil: z.string().datetime().optional().nullable()
});

// --- 8. Services CMS ---

export const CreateServiceSchema = z.object({
  businessUnitId: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().min(10),
  icp: z.string().min(5),
  deliverablesSummary: z.string().min(10),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  pitchGuide: z.string().min(10),
  objectionHandling: z.record(z.string()).default({}),
  faqJson: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  approvedCaseStudies: z.array(z.object({ title: z.string(), metric: z.string(), description: z.string() })).default([]),
  qualificationQuestions: z.array(z.string()).default([]),
  priceMinorUnits: z.string().regex(/^\d+$/),
  currency: z.string().default('INR')
});

export const UpdateServiceSchema = CreateServiceSchema.partial().extend({
  reasonForChange: z.string().min(5, 'Please provide reason for version increment')
});

// --- 9. Support Tickets ---

export const CreateSupportTicketSchema = z.object({
  category: z.nativeEnum(SupportTicketCategory),
  subject: z.string().min(3, 'Subject is required'),
  description: z.string().min(10, 'Provide details in at least 10 characters'),
  attachmentUrls: z.array(z.string().url()).default([])
});

export const UpdateSupportTicketSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'WAITING_ON_USER', 'RESOLVED', 'CLOSED']).optional(),
  assignedToId: z.string().uuid().optional().nullable(),
  resolution: z.string().optional()
});
