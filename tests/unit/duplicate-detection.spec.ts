describe('Unit: Duplicate Detection & Normalization Engine', () => {
  // Normalization logic matching backend LeadsService
  function normalizeDomain(rawUrl: string): string {
    return rawUrl
      .trim()
      .toLowerCase()
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
      .split('/')[0]
      .split('?')[0];
  }

  function normalizePhone(rawPhone: string): string {
    return rawPhone.replace(/[^\d+]/g, '');
  }

  function normalizeCompanyName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\b(ltd|limited|inc|corp|corporation|llc|pvt|private)\b/gi, '')
      .replace(/[^\w\s]/gi, '')
      .trim()
      .replace(/\s+/g, ' ');
  }

  describe('Domain Normalization', () => {
    it('should strip protocol, www, trailing slashes, and UTM query params', () => {
      const inputs = [
        'https://www.TechNova.io/solutions?utm_source=linkedin',
        'http://technova.io/',
        'WWW.TECHNOVA.IO',
        'technova.io/about'
      ];

      for (const input of inputs) {
        expect(normalizeDomain(input)).toBe('technova.io');
      }
    });

    it('should preserve subdomains accurately', () => {
      expect(normalizeDomain('https://app.apexlogistics.com/login')).toBe('app.apexlogistics.com');
    });
  });

  describe('Phone Normalization', () => {
    it('should strip whitespace, hyphens, and brackets while preserving country code', () => {
      expect(normalizePhone('+91 98765-43210')).toBe('+919876543210');
      expect(normalizePhone('+1 (555) 234-5678')).toBe('+15552345678');
    });
  });

  describe('Company Name Normalization', () => {
    it('should strip corporate suffixes and standardize whitespace', () => {
      expect(normalizeCompanyName('Apex Retail Private Limited')).toBe('apex retail');
      expect(normalizeCompanyName('TechNova, Inc.')).toBe('technova');
      expect(normalizeCompanyName('Zenith Health Systems LLC')).toBe('zenith health systems');
    });
  });

  describe('Match Confidence Scoring', () => {
    function computeMatchConfidence(
      existing: { domain: string; email: string; phone: string; name: string },
      candidate: { domain: string; email: string; phone: string; name: string }
    ): { isDuplicate: boolean; matchType?: string; confidence: number } {
      if (normalizeDomain(existing.domain) === normalizeDomain(candidate.domain)) {
        return { isDuplicate: true, matchType: 'DOMAIN', confidence: 0.99 };
      }
      if (existing.email.toLowerCase() === candidate.email.toLowerCase()) {
        return { isDuplicate: true, matchType: 'EMAIL', confidence: 0.95 };
      }
      if (normalizePhone(existing.phone) === normalizePhone(candidate.phone)) {
        return { isDuplicate: true, matchType: 'PHONE', confidence: 0.90 };
      }
      if (normalizeCompanyName(existing.name) === normalizeCompanyName(candidate.name)) {
        return { isDuplicate: true, matchType: 'COMPANY_NAME', confidence: 0.75 };
      }
      return { isDuplicate: false, confidence: 0 };
    }

    it('should detect duplicate by domain with highest confidence', () => {
      const match = computeMatchConfidence(
        { domain: 'apexlogistics.com', email: 'raj@apex.com', phone: '+919876543210', name: 'Apex Logistics Ltd' },
        { domain: 'https://www.apexlogistics.com/team', email: 'vikram@apex.com', phone: '+919999999999', name: 'Apex Logistics Corp' }
      );
      expect(match.isDuplicate).toBe(true);
      expect(match.matchType).toBe('DOMAIN');
      expect(match.confidence).toBe(0.99);
    });

    it('should detect duplicate by corporate contact email', () => {
      const match = computeMatchConfidence(
        { domain: 'alpha.com', email: 'ceo@target.com', phone: '+919876543210', name: 'Target Alpha' },
        { domain: 'beta.com', email: 'ceo@target.com', phone: '+919111111111', name: 'Target Beta' }
      );
      expect(match.isDuplicate).toBe(true);
      expect(match.matchType).toBe('EMAIL');
      expect(match.confidence).toBe(0.95);
    });

    it('should report no duplicate for distinct prospect', () => {
      const match = computeMatchConfidence(
        { domain: 'alpha.com', email: 'ceo@alpha.com', phone: '+919876543210', name: 'Alpha Ltd' },
        { domain: 'beta.com', email: 'cto@beta.com', phone: '+919111111111', name: 'Beta Solutions' }
      );
      expect(match.isDuplicate).toBe(false);
      expect(match.confidence).toBe(0);
    });
  });
});
