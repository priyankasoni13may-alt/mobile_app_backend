describe('Unit: Annual Performance Bonus Eligibility Evaluator', () => {
  interface PartnerBonusCriteria {
    partnerId: string;
    onboardingComplete: boolean;
    agreementAccepted: boolean;
    complianceViolations: number;
    closedQualifiedClients: number;
    targetEligibleClients: number; // 15
    periodYear: number;
  }

  interface BonusEvaluationResult {
    isEligible: boolean;
    status: 'APPROVED' | 'DISQUALIFIED' | 'EVALUATING';
    disqualificationReason?: string;
    bonusAmountMinorUnits: bigint;
  }

  function evaluateAnnualBonus(criteria: PartnerBonusCriteria): BonusEvaluationResult {
    const ANNUAL_BONUS_AMOUNT = 10000000n; // ₹1,00,000 in paise

    if (!criteria.onboardingComplete) {
      return {
        isEligible: false,
        status: 'DISQUALIFIED',
        disqualificationReason: 'Incomplete onboarding and training records',
        bonusAmountMinorUnits: 0n
      };
    }

    if (!criteria.agreementAccepted) {
      return {
        isEligible: false,
        status: 'DISQUALIFIED',
        disqualificationReason: 'Code of Conduct & Partner Agreement not accepted',
        bonusAmountMinorUnits: 0n
      };
    }

    if (criteria.complianceViolations > 0) {
      return {
        isEligible: false,
        status: 'DISQUALIFIED',
        disqualificationReason: 'Partner account has recorded compliance infractions',
        bonusAmountMinorUnits: 0n
      };
    }

    if (criteria.closedQualifiedClients >= criteria.targetEligibleClients) {
      return {
        isEligible: true,
        status: 'APPROVED',
        bonusAmountMinorUnits: ANNUAL_BONUS_AMOUNT
      };
    }

    return {
      isEligible: false,
      status: 'EVALUATING',
      disqualificationReason: `Target of ${criteria.targetEligibleClients} clients not reached (Current: ${criteria.closedQualifiedClients})`,
      bonusAmountMinorUnits: 0n
    };
  }

  it('should approve ₹1,00,000 bonus when partner reaches 15 closed clients and meets compliance', () => {
    const result = evaluateAnnualBonus({
      partnerId: 'partner-demo',
      onboardingComplete: true,
      agreementAccepted: true,
      complianceViolations: 0,
      closedQualifiedClients: 15,
      targetEligibleClients: 15,
      periodYear: 2026
    });

    expect(result.isEligible).toBe(true);
    expect(result.status).toBe('APPROVED');
    expect(result.bonusAmountMinorUnits).toBe(10000000n);
  });

  it('should mark as EVALUATING if partner has 12 clients (target not reached yet)', () => {
    const result = evaluateAnnualBonus({
      partnerId: 'partner-demo',
      onboardingComplete: true,
      agreementAccepted: true,
      complianceViolations: 0,
      closedQualifiedClients: 12,
      targetEligibleClients: 15,
      periodYear: 2026
    });

    expect(result.isEligible).toBe(false);
    expect(result.status).toBe('EVALUATING');
    expect(result.disqualificationReason).toContain('Target of 15 clients not reached (Current: 12)');
  });

  it('should disqualify partner if there is a compliance violation even if client target is met', () => {
    const result = evaluateAnnualBonus({
      partnerId: 'partner-violator',
      onboardingComplete: true,
      agreementAccepted: true,
      complianceViolations: 1, // Compliance strike
      closedQualifiedClients: 18,
      targetEligibleClients: 15,
      periodYear: 2026
    });

    expect(result.isEligible).toBe(false);
    expect(result.status).toBe('DISQUALIFIED');
    expect(result.disqualificationReason).toBe('Partner account has recorded compliance infractions');
    expect(result.bonusAmountMinorUnits).toBe(0n);
  });
});
