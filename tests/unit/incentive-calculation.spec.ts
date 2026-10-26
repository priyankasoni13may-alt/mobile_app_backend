import { formatINR, paiseToRupees, rupeesToPaise } from '@lumora/shared-types';

describe('Unit: Incentive Engine & Financial Calculation', () => {
  interface CommissionPolicy {
    triggerType: 'DIAGNOSTIC_WON' | 'SERVICE_WON';
    fixedAmountMinorUnits?: bigint;
    percentageBasisPoints?: number; // 100 bps = 1%
    roundingRule: 'FLOOR' | 'CEIL' | 'ROUND';
    tdsRateBasisPoints?: number; // e.g. 500 bps = 5% TDS
  }

  function calculateCommission(
    dealValueMinorUnits: bigint,
    policy: CommissionPolicy
  ): { grossAmountMinorUnits: bigint; tdsMinorUnits: bigint; netAmountMinorUnits: bigint } {
    let gross: bigint = 0n;

    if (policy.fixedAmountMinorUnits) {
      gross = policy.fixedAmountMinorUnits;
    } else if (policy.percentageBasisPoints) {
      // Basis points calculation: (dealValue * bps) / 10000
      const numerator = dealValueMinorUnits * BigInt(policy.percentageBasisPoints);
      const denominator = 10000n;

      if (policy.roundingRule === 'FLOOR') {
        gross = numerator / denominator;
      } else if (policy.roundingRule === 'CEIL') {
        gross = (numerator + denominator - 1n) / denominator;
      } else {
        // ROUND to nearest paise
        gross = (numerator + denominator / 2n) / denominator;
      }
    }

    // TDS withholding calculation if applicable (e.g. Section 194H - 5%)
    let tds: bigint = 0n;
    if (policy.tdsRateBasisPoints) {
      tds = (gross * BigInt(policy.tdsRateBasisPoints)) / 10000n;
    }

    const net = gross - tds;
    return { grossAmountMinorUnits: gross, tdsMinorUnits: tds, netAmountMinorUnits: net };
  }

  describe('Diagnostic Incentive Calculation', () => {
    it('should calculate exact fixed ₹1,000 (100,000 paise) for ₹37,000 diagnostic', () => {
      const diagnosticDealValue = 3700000n; // ₹37,000 in paise
      const policy: CommissionPolicy = {
        triggerType: 'DIAGNOSTIC_WON',
        fixedAmountMinorUnits: 100000n, // ₹1,000 in paise
        roundingRule: 'ROUND'
      };

      const result = calculateCommission(diagnosticDealValue, policy);
      expect(result.grossAmountMinorUnits).toBe(100000n);
      expect(paiseToRupees(result.grossAmountMinorUnits)).toBe(1000);
      expect(formatINR(result.grossAmountMinorUnits)).toBe('₹1,000');
    });
  });

  describe('Service Contract Incentive Calculation', () => {
    it('should calculate fixed ₹10,000 (1,000,000 paise) on service deal', () => {
      const serviceDealValue = 50000000n; // ₹5,00,000
      const policy: CommissionPolicy = {
        triggerType: 'SERVICE_WON',
        fixedAmountMinorUnits: 1000000n, // ₹10,000
        roundingRule: 'ROUND'
      };

      const result = calculateCommission(serviceDealValue, policy);
      expect(result.grossAmountMinorUnits).toBe(1000000n);
      expect(formatINR(result.grossAmountMinorUnits)).toBe('₹10,000');
    });

    it('should calculate percentage commission with exact integer arithmetic without float drift', () => {
      // 2.5% commission (250 basis points) on ₹3,33,333.33 (33,333,333 paise)
      const dealValue = 33333333n;
      const policy: CommissionPolicy = {
        triggerType: 'SERVICE_WON',
        percentageBasisPoints: 250, // 2.5%
        roundingRule: 'ROUND'
      };

      const result = calculateCommission(dealValue, policy);
      // 33333333 * 250 / 10000 = 833333.325 -> rounded = 833333 paise (₹8,333.33)
      expect(result.grossAmountMinorUnits).toBe(833333n);
      expect(typeof result.grossAmountMinorUnits).toBe('bigint');
    });

    it('should calculate net payout after 5% TDS withholding (Section 194H)', () => {
      const dealValue = 100000000n; // ₹10,00,000
      const policy: CommissionPolicy = {
        triggerType: 'SERVICE_WON',
        fixedAmountMinorUnits: 1000000n, // ₹10,000 gross
        tdsRateBasisPoints: 500, // 5% TDS = ₹500 (50,000 paise)
        roundingRule: 'ROUND'
      };

      const result = calculateCommission(dealValue, policy);
      expect(result.grossAmountMinorUnits).toBe(1000000n);
      expect(result.tdsMinorUnits).toBe(50000n); // ₹500
      expect(result.netAmountMinorUnits).toBe(950000n); // ₹9,500
      expect(formatINR(result.netAmountMinorUnits)).toBe('₹9,500');
    });
  });

  describe('Paise Conversion Utilities', () => {
    it('should convert rupees to paise and vice versa without rounding error', () => {
      expect(rupeesToPaise(37000)).toBe(3700000n);
      expect(paiseToRupees(3700000n)).toBe(37000);
      expect(paiseToRupees(150n)).toBe(1.5);
    });
  });
});
