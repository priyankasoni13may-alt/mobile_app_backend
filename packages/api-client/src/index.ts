// ==============================================================================
// Lumora + Cypher Swift Partner Network — Shared API Client
// ==============================================================================

import {
  ApiResponse,
  ApiErrorResponse,
  UserDto,
  PartnerProfileDto,
  CompanyDto,
  BusinessUnitDto,
  ServiceDto,
  LeadDto,
  LeadActivityDto,
  MeetingDto,
  MeetingOutcomeDto,
  DealDto,
  PaymentEvidenceDto,
  CommissionLedgerDto,
  CommissionAdjustmentDto,
  PayoutBatchDto,
  BonusEvaluationDto,
  TaskDto,
  NotificationDto,
  SupportTicketDto,
  AuditEventDto
} from '@lumora/shared-types';

export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null | Promise<string | null>;
  getRefreshToken?: () => string | null | Promise<string | null>;
  onTokenRefresh?: (newAccessToken: string, newRefreshToken?: string) => void | Promise<void>;
  onAuthError?: () => void;
}

export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public fieldErrors?: Array<{ field: string; message: string }>;
  public requestId?: string;

  constructor(errorResponse: ApiErrorResponse) {
    super(errorResponse.message);
    this.name = 'ApiError';
    this.statusCode = errorResponse.statusCode;
    this.code = errorResponse.code;
    this.fieldErrors = errorResponse.field_errors;
    this.requestId = errorResponse.request_id;
  }
}

export class LumoraApiClient {
  private baseUrl: string;
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    customHeaders: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Request-Id': `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...customHeaders
    };

    if (this.config.getAccessToken) {
      const token = await this.config.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        signal: options.signal || controller.signal,
        headers: {
          ...headers,
          ...(options.headers as Record<string, string>)
        }
      });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new ApiError({
          statusCode: 408,
          code: 'REQUEST_TIMEOUT',
          message: 'Server connection timed out. Please check connection and retry.',
          request_id: headers['X-Request-Id'],
          timestamp: new Date().toISOString()
        });
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }

    // Check for 401 and try refresh if configured
    if (response.status === 401 && this.config.getRefreshToken && this.config.onTokenRefresh) {
      const refreshToken = await this.config.getRefreshToken();
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${this.baseUrl}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          if (refreshRes.ok) {
            const refreshData = (await refreshRes.json()) as any;
            const newAccess = refreshData.data?.accessToken;
            const newRefresh = refreshData.data?.refreshToken;
            if (newAccess) {
              await this.config.onTokenRefresh(newAccess, newRefresh);
              // Retry initial request with new access token
              headers['Authorization'] = `Bearer ${newAccess}`;
              response = await fetch(url, {
                ...options,
                headers: {
                  ...headers,
                  ...(options.headers as Record<string, string>)
                }
              });
            }
          } else {
            if (this.config.onAuthError) this.config.onAuthError();
          }
        } catch {
          if (this.config.onAuthError) this.config.onAuthError();
        }
      }
    }

    const data = (await response.json().catch(() => ({}))) as any;

    if (!response.ok) {
      const errRes: ApiErrorResponse = {
        statusCode: response.status,
        code: data?.code || `HTTP_${response.status}`,
        message: data?.message || response.statusText || 'Unknown API Error',
        field_errors: data?.field_errors,
        request_id: headers['X-Request-Id'],
        timestamp: new Date().toISOString()
      };
      throw new ApiError(errRes);
    }

    return data as ApiResponse<T>;
  }

  // --- Auth Module ---

  async register(payload: Record<string, unknown>) {
    return this.request<{ user: UserDto; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async login(payload: Record<string, unknown>) {
    return this.request<{ user: UserDto; accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async verifyOtp(payload: { identifier: string; otp: string }) {
    return this.request<{ verified: boolean; token?: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async requestOtp(payload: { identifier: string; channel: 'sms' | 'email' }) {
    return this.request<{ success: boolean; message: string }>('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async forgotPassword(payload: { email: string }) {
    return this.request<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async resetPassword(payload: { token: string; newPassword: string }) {
    return this.request<{ success: boolean }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async me() {
    return this.request<{ user: UserDto; profile?: PartnerProfileDto }>('/me');
  }

  async updateProfile(payload: Record<string, unknown>) {
    return this.request<PartnerProfileDto>('/me', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  async getOnboardingStatus() {
    return this.request<{
      profileCompleted: boolean;
      verificationStatus: string;
      agreementAccepted: boolean;
      trainingCompleted: boolean;
      applicationStatus: string;
      canAccessDashboard: boolean;
    }>('/me/onboarding-status');
  }

  // --- Verification & Agreements ---

  async getVerificationStatus() {
    return this.request<{ status: string; notes?: string }>('/verification/status');
  }

  async startVerificationSession() {
    return this.request<{ sessionId: string; redirectUrl?: string }>('/verification/session', {
      method: 'POST'
    });
  }

  async listAgreements() {
    return this.request<Array<{ id: string; title: string; version: string; content: string; effectiveDate: string }>>('/agreements');
  }

  async acceptAgreement(agreementId: string) {
    return this.request<{ accepted: boolean }>('/agreements/' + agreementId + '/accept', {
      method: 'POST'
    });
  }

  // --- Learning & Training ---

  async listLearningModules() {
    return this.request<Array<{
      id: string;
      title: string;
      description: string;
      contentType: string;
      content: string;
      isMandatory: boolean;
      completed: boolean;
    }>>('/learning/modules');
  }

  async completeLearningModule(moduleId: string, score?: number) {
    return this.request<{ success: boolean }>(`/learning/modules/${moduleId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ score })
    });
  }

  // --- Services Catalogue ---

  async listServices(params?: { businessUnitId?: string }) {
    const qs = params?.businessUnitId ? `?businessUnitId=${encodeURIComponent(params.businessUnitId)}` : '';
    return this.request<ServiceDto[]>(`/services${qs}`);
  }

  async getService(id: string) {
    return this.request<ServiceDto>(`/services/${id}`);
  }

  // --- Leads & Pipeline ---

  async listLeads(params?: { page?: number; limit?: number; stage?: string; partnerId?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.stage) query.set('stage', params.stage);
    if (params?.partnerId) query.set('partnerId', params.partnerId);
    return this.request<LeadDto[]>(`/leads?${query.toString()}`);
  }

  async getLead(id: string) {
    return this.request<LeadDto>(`/leads/${id}`);
  }

  async createLead(payload: Record<string, unknown>) {
    return this.request<LeadDto>('/leads', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateLead(id: string, payload: Record<string, unknown>) {
    return this.request<LeadDto>(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  async approveLead(id: string) {
    return this.request<LeadDto>(`/leads/${id}/approve`, {
      method: 'POST'
    });
  }

  async rejectLead(id: string, reason?: string) {
    return this.request<LeadDto>(`/leads/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  async deleteLead(id: string) {
    return this.request<{ success: boolean; message: string }>(`/leads/${id}`, {
      method: 'DELETE'
    });
  }

  async checkDuplicateLead(params: { companyWebsite?: string; contactEmail?: string; contactPhone?: string; companyName?: string }) {
    const query = new URLSearchParams();
    if (params.companyWebsite) query.set('companyWebsite', params.companyWebsite);
    if (params.contactEmail) query.set('contactEmail', params.contactEmail);
    if (params.contactPhone) query.set('contactPhone', params.contactPhone);
    if (params.companyName) query.set('companyName', params.companyName);
    return this.request<{ hasDuplicate: boolean; matches: Array<{ matchedLeadId: string; companyName: string; stage: string; matchType: string }> }>(
      `/leads/check-duplicate?${query.toString()}`
    );
  }

  async addLeadActivity(leadId: string, payload: { activityType: string; notes?: string; channel?: string }) {
    return this.request<LeadActivityDto>(`/leads/${leadId}/activities`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async claimLeadConflict(payload: { existingLeadId: string; reason: string }) {
    return this.request<{ conflictId: string; status: string }>('/leads/claim-conflict', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // --- Tasks ---

  async listTasks(params?: { status?: string; leadId?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.leadId) query.set('leadId', params.leadId);
    return this.request<TaskDto[]>(`/tasks?${query.toString()}`);
  }

  async createTask(payload: Record<string, unknown>) {
    return this.request<TaskDto>('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateTask(id: string, payload: Record<string, unknown>) {
    return this.request<TaskDto>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  // --- Meetings ---

  async listMeetings(params?: { status?: string; leadId?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.leadId) query.set('leadId', params.leadId);
    return this.request<MeetingDto[]>(`/meetings?${query.toString()}`);
  }

  async createMeeting(payload: Record<string, unknown>) {
    return this.request<MeetingDto>('/meetings', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getMeeting(id: string) {
    return this.request<MeetingDto>(`/meetings/${id}`);
  }

  async updateMeeting(id: string, payload: Record<string, unknown>) {
    return this.request<MeetingDto>(`/meetings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  async recordMeetingOutcome(meetingId: string, payload: Record<string, unknown>) {
    return this.request<MeetingOutcomeDto>(`/meetings/${meetingId}/outcome`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // --- Deals & Payments ---

  async listDeals(params?: { leadId?: string; stage?: string }) {
    const query = new URLSearchParams();
    if (params?.leadId) query.set('leadId', params.leadId);
    return this.request<DealDto[]>(`/deals?${query.toString()}`);
  }

  async getDeal(id: string) {
    return this.request<DealDto>(`/deals/${id}`);
  }

  async createDeal(payload: Record<string, unknown>) {
    return this.request<DealDto>('/deals', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async submitPaymentEvidence(dealId: string, payload: Record<string, unknown>) {
    return this.request<PaymentEvidenceDto>(`/deals/${dealId}/payment-evidence`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async verifyPayment(dealId: string, payload: { approved: boolean; rejectionReason?: string }) {
    return this.request<{ success: boolean; deal: DealDto }>(`/deals/${dealId}/verify-payment`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  async submitClosure(dealId: string) {
    return this.request<{ success: boolean; commissionLedgerId?: string }>(`/deals/${dealId}/submit-closure`, {
      method: 'POST'
    });
  }

  async createDeliveryHandoff(dealId: string, payload: Record<string, unknown>) {
    return this.request<any>(`/deals/${dealId}/handoff`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // --- Earnings & Commissions ---

  async getEarningsSummary() {
    return this.request<{
      totalEarnedPaise: string;
      pendingPaise: string;
      approvedPaise: string;
      paidPaise: string;
      diagnosticCount: number;
      serviceCount: number;
      bonusProgress: { target: number; actual: number; bonusPaise: string };
    }>('/earnings/summary');
  }

  async getEarningsLedger() {
    return this.request<CommissionLedgerDto[]>('/earnings/ledger');
  }

  async raiseDispute(ledgerId: string, payload: { reason: string }) {
    return this.request<SupportTicketDto>(`/earnings/${ledgerId}/dispute`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // --- Admin & Finance Operations ---

  async adminListPartners() {
    return this.request<Array<UserDto & { profile: PartnerProfileDto }>>('/admin/partners');
  }

  async adminPartnerDecision(partnerId: string, payload: { decision: 'APPROVE' | 'REJECT' | 'SUSPEND'; reason?: string }) {
    return this.request<{ success: boolean }>(`/admin/partners/${partnerId}/decision`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async adminListPendingCommissions() {
    return this.request<CommissionLedgerDto[]>('/admin/commissions');
  }

  async adminReviewCommission(commissionId: string, payload: { approved: boolean; reason?: string }, idempotencyKey?: string) {
    const headers: Record<string, string> = {};
    if (idempotencyKey) headers['X-Idempotency-Key'] = idempotencyKey;
    return this.request<{ success: boolean }>(`/admin/commissions/${commissionId}/review`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }, headers);
  }

  async adminCreateAdjustment(payload: Record<string, unknown>) {
    return this.request<CommissionAdjustmentDto>('/admin/commissions/adjustments', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async adminListPayoutBatches() {
    return this.request<PayoutBatchDto[]>('/admin/payouts/batches');
  }

  async adminCreatePayoutBatch(payload: { commissionLedgerEntryIds: string[]; notes?: string }) {
    return this.request<PayoutBatchDto>('/admin/payouts/batches', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async adminApprovePayoutBatch(batchId: string) {
    return this.request<PayoutBatchDto>(`/admin/payouts/batches/${batchId}/approve`, {
      method: 'PATCH'
    });
  }

  async adminRecordBatchPayments(batchId: string, payload: { paymentReference: string }) {
    return this.request<PayoutBatchDto>(`/admin/payouts/batches/${batchId}/record-payments`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async adminListAuditEvents() {
    return this.request<AuditEventDto[]>('/admin/audit-events');
  }

  async adminGetPerformanceReports() {
    return this.request<any>('/admin/reports/performance');
  }

  // --- Notifications ---

  async listNotifications() {
    return this.request<NotificationDto[]>('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'PATCH'
    });
  }

  // --- Support Tickets ---

  async listSupportTickets() {
    return this.request<SupportTicketDto[]>('/support/tickets');
  }

  async createSupportTicket(payload: Record<string, unknown>) {
    return this.request<SupportTicketDto>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // --- Health ---

  async getHealth() {
    return this.request<{ status: string; uptime: number; timestamp: string }>('/health');
  }

  async getHealthReady() {
    return this.request<{ status: string; database: boolean; redis: boolean }>('/health/ready');
  }
}
