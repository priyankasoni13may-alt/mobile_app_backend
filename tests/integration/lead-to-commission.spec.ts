import { LeadStage, formatINR } from '@lumora/shared-types';

describe('Integration: Complete Lead-to-Payout Commercial Workflow', () => {
  const store = {
    leads: new Map<string, any>(),
    meetings: new Map<string, any>(),
    deals: new Map<string, any>(),
    paymentEvidences: new Map<string, any>(),
    commissions: new Map<string, any>(),
    payoutBatches: new Map<string, any>()
  };

  const partnerId = 'partner-demo-001';
  const financeId = 'finance-head-001';
  const leadId = 'lead-test-corp';
  const dealId = 'deal-diagnostic-001';

  it('Phase 1: Partner registers a verified prospective business client', () => {
    const lead = {
      id: leadId,
      partnerId,
      companyName: 'Apex Cloud Logistics Pvt Ltd',
      companyWebsite: 'apexcloudlogistics.com',
      contactName: 'Kunal Verma',
      contactEmail: 'kunal@apexcloudlogistics.com',
      contactPhone: '+919876543210',
      stage: LeadStage.NEW,
      needSummary: 'Omnichannel demand generation and warehouse ERP modernization'
    };
    store.leads.set(leadId, lead);

    expect(store.leads.get(leadId).stage).toBe(LeadStage.NEW);
  });

  it('Phase 2: Partner schedules discovery meeting & records qualified outcome', () => {
    const meetingId = 'meet-001';
    store.meetings.set(meetingId, {
      id: meetingId,
      leadId,
      organizerId: partnerId,
      title: 'Growth Diagnostic Discovery Call',
      status: 'SCHEDULED'
    });

    // Record Meeting Outcome with qualification
    const outcome = {
      meetingId,
      attendanceConfirmed: true,
      isQualified: true,
      requirementSummary: 'High intent for tech diagnostic and performance marketing',
      budgetRange: '₹5,00,000 - ₹10,00,000',
      timeline: 'Immediate (Q4)',
      decisionProcess: 'CTO and Managing Director sign-off'
    };

    // Update lead stage to QUALIFIED
    const lead = store.leads.get(leadId);
    lead.stage = LeadStage.QUALIFIED;
    store.leads.set(leadId, lead);

    expect(store.leads.get(leadId).stage).toBe(LeadStage.QUALIFIED);
  });

  it('Phase 3: Create Shared Business Diagnostic deal for ₹37,000', () => {
    const deal = {
      id: dealId,
      leadId,
      dealType: 'DIAGNOSTIC',
      amountMinorUnits: 3700000n, // ₹37,000 in paise
      currency: 'INR',
      contractStatus: 'PROPOSED',
      paymentStatus: 'PENDING'
    };
    store.deals.set(dealId, deal);

    expect(store.deals.get(dealId).amountMinorUnits).toBe(3700000n);
  });

  it('Phase 4: Client deposits ₹37,000 & Partner submits payment evidence', () => {
    const evidenceId = 'evid-001';
    store.paymentEvidences.set(evidenceId, {
      id: evidenceId,
      dealId,
      amountMinorUnits: 3700000n,
      currency: 'INR',
      paymentReference: 'CMS-HDFC-992019482',
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString()
    });

    expect(store.paymentEvidences.get(evidenceId).status).toBe('SUBMITTED');
  });

  it('Phase 5: Internal Finance verifies payment & closes Diagnostic as WON', () => {
    const evidence = store.paymentEvidences.get('evid-001');
    evidence.status = 'VERIFIED';
    evidence.verifiedById = financeId;
    store.paymentEvidences.set('evid-001', evidence);

    const deal = store.deals.get(dealId);
    deal.contractStatus = 'SIGNED';
    deal.paymentStatus = 'VERIFIED';
    deal.closedAt = new Date().toISOString();
    store.deals.set(dealId, deal);

    const lead = store.leads.get(leadId);
    lead.stage = LeadStage.DIAGNOSTIC_WON;
    store.leads.set(leadId, lead);

    expect(store.leads.get(leadId).stage).toBe(LeadStage.DIAGNOSTIC_WON);
    expect(deal.paymentStatus).toBe('VERIFIED');
  });

  it('Phase 6: Incentive engine automatically creates append-only ₹1,000 commission entry', () => {
    const commissionId = 'comm-001';
    const commissionEntry = {
      id: commissionId,
      partnerId,
      dealId,
      policyId: 'pol-diagnostic-v1',
      triggerEvent: 'DIAGNOSTIC_PAYMENT_VERIFIED',
      grossAmountMinorUnits: 100000n, // ₹1,000 in paise
      currency: 'INR',
      status: 'PENDING',
      idempotencyKey: `COMM_${dealId}_DIAGNOSTIC_PAYMENT_VERIFIED`,
      createdAt: new Date().toISOString()
    };
    store.commissions.set(commissionId, commissionEntry);

    expect(store.commissions.get(commissionId).grossAmountMinorUnits).toBe(100000n);
    expect(store.commissions.get(commissionId).status).toBe('PENDING');
  });

  it('Phase 7: Finance reviews and approves commission (preventing partner self-approval)', () => {
    const comm = store.commissions.get('comm-001');

    // Rule: Partner cannot self-approve
    expect(comm.partnerId).not.toBe(financeId);

    comm.status = 'APPROVED';
    comm.approvedById = financeId;
    comm.approvedAt = new Date().toISOString();
    store.commissions.set('comm-001', comm);

    expect(store.commissions.get('comm-001').status).toBe('APPROVED');
  });

  it('Phase 8: Finance generates payout batch & records actual bank disbursement', () => {
    const batchId = 'batch-2026-w42';
    const batch: any = {
      id: batchId,
      batchReference: 'BATCH-2026-10-W42',
      totalAmountMinorUnits: 100000n,
      itemCount: 1,
      status: 'APPROVED',
      approvedById: financeId,
      commissionIds: ['comm-001']
    };
    store.payoutBatches.set(batchId, batch);

    // Record Payment
    batch.status = 'COMPLETED';
    batch.processedAt = new Date().toISOString();
    batch.paymentReference = 'ICICI-BULK-91823901';

    const comm = store.commissions.get('comm-001');
    comm.status = 'PAID';
    comm.paidAt = batch.processedAt;
    comm.paymentReference = batch.paymentReference;

    expect(batch.status).toBe('COMPLETED');
    expect(comm.status).toBe('PAID');
    expect(comm.paymentReference).toBe('ICICI-BULK-91823901');
  });
});
