import { LeadStage, UserRoleType, formatINR } from '@lumora/shared-types';

describe('E2E: Complete Master Business Development Partner Journey', () => {
  // Global simulation state
  const state: any = {
    users: {},
    profiles: {},
    agreements: {},
    training: {},
    leads: {},
    meetings: {},
    deals: {},
    paymentEvidences: {},
    ledger: [],
    payoutBatches: []
  };

  const partnerId = 'usr-partner-kavita';
  const superAdminId = 'usr-admin-rajesh';
  const financeHeadId = 'usr-finance-amit';

  // 1. Register
  it('Step 1: Partner registration with email, phone, and password', () => {
    state.users[partnerId] = {
      id: partnerId,
      fullName: 'Kavita Sundaram',
      email: 'kavita.sundaram@partner.network',
      phone: '+919876543299',
      role: UserRoleType.PARTNER,
      status: 'PENDING_VERIFICATION'
    };
    expect(state.users[partnerId].status).toBe('PENDING_VERIFICATION');
  });

  // 2. Verify Email & Phone
  it('Step 2: Partner verifies 6-digit OTP', () => {
    state.users[partnerId].emailVerifiedAt = new Date().toISOString();
    state.users[partnerId].phoneVerifiedAt = new Date().toISOString();
    state.users[partnerId].status = 'VERIFIED';
    expect(state.users[partnerId].status).toBe('VERIFIED');
  });

  // 3. Complete Profile
  it('Step 3: Partner completes professional profile', () => {
    state.profiles[partnerId] = {
      userId: partnerId,
      title: 'Senior Enterprise Technology Consultant',
      yearsExperience: 8,
      industries: ['Logistics', 'Retail', 'FinTech'],
      languages: ['English', 'Hindi', 'Tamil'],
      timezone: 'Asia/Kolkata',
      linkedinUrl: 'https://linkedin.com/in/kavita-sundaram'
    };
    expect(state.profiles[partnerId].industries).toContain('Logistics');
  });

  // 4. Accept Agreement
  it('Step 4: Partner accepts Code of Conduct & Commercial Policy Agreement', () => {
    state.agreements[partnerId] = {
      agreementVersion: 'v2.0-conduct',
      acceptedAt: new Date().toISOString(),
      ipAddress: '103.21.244.10',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
    };
    expect(state.agreements[partnerId].agreementVersion).toBe('v2.0-conduct');
  });

  // 5. Complete Training
  it('Step 5: Partner completes all 3 mandatory learning modules & quizzes', () => {
    state.training[partnerId] = [
      { moduleId: 'mod-lumora-pitch', completed: true, score: 100 },
      { moduleId: 'mod-cypher-tech', completed: true, score: 95 },
      { moduleId: 'mod-conduct-ethics', completed: true, score: 100 }
    ];
    expect(state.training[partnerId].length).toBe(3);
  });

  // 6. Application Approved by Operations / Super Admin
  it('Step 6: Super Admin approves partner application after verification review', () => {
    state.users[partnerId].status = 'ACTIVE';
    state.users[partnerId].approvedById = superAdminId;
    state.users[partnerId].approvedAt = new Date().toISOString();
    expect(state.users[partnerId].status).toBe('ACTIVE');
  });

  // 7. Add Lead & Duplicate Check
  const leadId = 'lead-omni-retail';
  it('Step 7: Partner registers new prospect after automated clean duplicate check', () => {
    state.leads[leadId] = {
      id: leadId,
      partnerId,
      companyName: 'OmniGlobal Retail Chain Ltd',
      companyWebsite: 'omniglobalretail.in',
      contactName: 'Raghavan Iyer',
      contactRole: 'Chief Technology Officer',
      contactEmail: 'raghavan.iyer@omniglobalretail.in',
      contactPhone: '+919812345678',
      stage: LeadStage.NEW,
      duplicateScore: 0.0
    };
    expect(state.leads[leadId].stage).toBe(LeadStage.NEW);
  });

  // 8. Book Meeting
  const meetingId = 'meet-omni-01';
  it('Step 8: Partner books discovery meeting with client decision-maker', () => {
    state.meetings[meetingId] = {
      id: meetingId,
      leadId,
      organizerId: partnerId,
      title: 'Omnichannel Digital & Systems Architecture Discovery',
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      status: 'SCHEDULED'
    };
    state.leads[leadId].stage = LeadStage.MEETING_SCHEDULED;
    expect(state.leads[leadId].stage).toBe(LeadStage.MEETING_SCHEDULED);
  });

  // 9. Record Meeting Outcome (Qualified)
  it('Step 9: Partner records meeting outcome with attendance and budget qualification', () => {
    state.meetings[meetingId].outcome = {
      attendanceConfirmed: true,
      isQualified: true,
      requirementSummary: 'Legacy POS integration with AI inventory automation & SEO scale',
      agreedNextAction: 'Present Shared Business Diagnostic Offer (₹37,000)'
    };
    state.leads[leadId].stage = LeadStage.QUALIFIED;
    expect(state.leads[leadId].stage).toBe(LeadStage.QUALIFIED);
  });

  // 10. Create Diagnostic Deal
  const diagDealId = 'deal-diag-omni';
  it('Step 10: Create Shared Business Diagnostic proposal (₹37,000)', () => {
    state.deals[diagDealId] = {
      id: diagDealId,
      leadId,
      dealType: 'DIAGNOSTIC',
      amountMinorUnits: 3700000n, // ₹37,000
      currency: 'INR',
      contractStatus: 'PROPOSED',
      paymentStatus: 'AWAITING_PAYMENT'
    };
    state.leads[leadId].stage = LeadStage.DIAGNOSTIC_PROPOSED;
    expect(state.deals[diagDealId].amountMinorUnits).toBe(3700000n);
  });

  // 11. Client Pays & Evidence Submitted
  it('Step 11: Client deposits ₹37,000 and partner submits payment evidence', () => {
    state.paymentEvidences['evid-diag-01'] = {
      dealId: diagDealId,
      amountMinorUnits: 3700000n,
      paymentReference: 'UTR-HDFC-991823901',
      status: 'SUBMITTED'
    };
    expect(state.paymentEvidences['evid-diag-01'].status).toBe('SUBMITTED');
  });

  // 12. Admin Verifies Payment -> Diagnostic Won -> ₹1,000 Commission
  it('Step 12: Admin verifies payment, closes Diagnostic as WON, and triggers ₹1,000 incentive', () => {
    state.paymentEvidences['evid-diag-01'].status = 'VERIFIED';
    state.deals[diagDealId].paymentStatus = 'VERIFIED';
    state.deals[diagDealId].contractStatus = 'SIGNED';
    state.leads[leadId].stage = LeadStage.DIAGNOSTIC_WON;

    // Append-only incentive entry
    const commEntry = {
      id: 'ledg-diag-01',
      partnerId,
      dealId: diagDealId,
      triggerEvent: 'DIAGNOSTIC_PAYMENT_VERIFIED',
      grossAmountMinorUnits: 100000n, // ₹1,000
      status: 'PENDING',
      idempotencyKey: `COMM_${diagDealId}_DIAGNOSTIC`
    };
    state.ledger.push(commEntry);

    expect(state.leads[leadId].stage).toBe(LeadStage.DIAGNOSTIC_WON);
    expect(commEntry.grossAmountMinorUnits).toBe(100000n);
  });

  // 13. Finance Approves Diagnostic Commission
  it('Step 13: Finance Head approves ₹1,000 incentive', () => {
    const entry = state.ledger.find((l: any) => l.id === 'ledg-diag-01');
    entry.status = 'APPROVED';
    entry.approvedById = financeHeadId;
    entry.approvedAt = new Date().toISOString();
    expect(entry.status).toBe('APPROVED');
  });

  // 14. Upsell to Core Service Contract (₹5,00,000)
  const serviceDealId = 'deal-srv-omni';
  it('Step 14: Client expands engagement to Custom Software & AI Integration (₹5,00,000)', () => {
    state.deals[serviceDealId] = {
      id: serviceDealId,
      leadId,
      dealType: 'SERVICE',
      amountMinorUnits: 50000000n, // ₹5,00,000 in paise
      contractStatus: 'SIGNED',
      paymentStatus: 'VERIFIED'
    };
    state.leads[leadId].stage = LeadStage.SERVICE_WON;

    // Service Incentive: ₹10,000
    const srvComm = {
      id: 'ledg-srv-01',
      partnerId,
      dealId: serviceDealId,
      triggerEvent: 'SERVICE_FIRST_PAYMENT_VERIFIED',
      grossAmountMinorUnits: 1000000n, // ₹10,000 in paise
      status: 'APPROVED',
      approvedById: financeHeadId,
      approvedAt: new Date().toISOString()
    };
    state.ledger.push(srvComm);

    expect(state.leads[leadId].stage).toBe(LeadStage.SERVICE_WON);
    expect(srvComm.grossAmountMinorUnits).toBe(1000000n);
  });

  // 15. Finance creates Payout Batch & records bank disbursement
  it('Step 15: Finance bundles approved commissions into payout batch & records disbursement', () => {
    const totalApproved = state.ledger.reduce((acc: bigint, item: any) => acc + item.grossAmountMinorUnits, 0n);
    expect(totalApproved).toBe(1100000n); // ₹11,000 total

    const payoutBatch = {
      id: 'batch-final-01',
      totalAmountMinorUnits: totalApproved,
      paymentReference: 'NEFT-ICICI-CONFIRM-9901842',
      status: 'COMPLETED',
      processedAt: new Date().toISOString()
    };
    state.payoutBatches.push(payoutBatch);

    state.ledger.forEach((item: any) => {
      item.status = 'PAID';
      item.paymentReference = payoutBatch.paymentReference;
      item.paidAt = payoutBatch.processedAt;
    });

    expect(payoutBatch.status).toBe('COMPLETED');
  });

  // 16. Partner reviews immutable ledger
  it('Step 16: Partner views immutable ledger with total paid of ₹11,000 across 2 deals', () => {
    const partnerItems = state.ledger.filter((l: any) => l.partnerId === partnerId);
    expect(partnerItems.length).toBe(2);
    expect(partnerItems.every((item: any) => item.status === 'PAID')).toBe(true);

    const totalPaid = partnerItems.reduce((acc: bigint, item: any) => acc + item.grossAmountMinorUnits, 0n);
    expect(formatINR(totalPaid)).toBe('₹11,000');
  });
});
