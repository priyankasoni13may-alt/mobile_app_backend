import { LeadStage } from '@lumora/shared-types';

describe('Unit: Lead Stage Transition State Machine', () => {
  // Define allowed transitions per business logic using exact LeadStage enum
  const allowedTransitions: Record<LeadStage, LeadStage[]> = {
    [LeadStage.NEW]: [LeadStage.CONTACTED, LeadStage.UNQUALIFIED],
    [LeadStage.CONTACTED]: [LeadStage.QUALIFIED, LeadStage.UNQUALIFIED, LeadStage.MEETING_SCHEDULED],
    [LeadStage.QUALIFIED]: [LeadStage.MEETING_SCHEDULED, LeadStage.DIAGNOSTIC_PROPOSED, LeadStage.UNQUALIFIED],
    [LeadStage.UNQUALIFIED]: [LeadStage.CONTACTED], // Re-engagement allowed
    [LeadStage.MEETING_SCHEDULED]: [LeadStage.MEETING_COMPLETED, LeadStage.UNQUALIFIED],
    [LeadStage.MEETING_COMPLETED]: [LeadStage.QUALIFIED, LeadStage.DIAGNOSTIC_PROPOSED, LeadStage.SERVICE_PROPOSED, LeadStage.UNQUALIFIED],
    [LeadStage.DIAGNOSTIC_PROPOSED]: [LeadStage.DIAGNOSTIC_IN_PROGRESS, LeadStage.DIAGNOSTIC_WON, LeadStage.CLOSED_LOST],
    [LeadStage.DIAGNOSTIC_IN_PROGRESS]: [LeadStage.DIAGNOSTIC_WON, LeadStage.CLOSED_LOST],
    [LeadStage.DIAGNOSTIC_WON]: [LeadStage.SERVICE_PROPOSED, LeadStage.SERVICE_WON],
    [LeadStage.SERVICE_PROPOSED]: [LeadStage.SERVICE_WON, LeadStage.CLOSED_LOST],
    [LeadStage.SERVICE_WON]: [], // Terminal won stage
    [LeadStage.CLOSED_LOST]: [LeadStage.CONTACTED] // Re-activation allowed
  };

  function isValidTransition(from: LeadStage, to: LeadStage): boolean {
    const validTargets = allowedTransitions[from] || [];
    return validTargets.includes(to);
  }

  it('should allow valid forward progression from NEW to CONTACTED to QUALIFIED', () => {
    expect(isValidTransition(LeadStage.NEW, LeadStage.CONTACTED)).toBe(true);
    expect(isValidTransition(LeadStage.CONTACTED, LeadStage.QUALIFIED)).toBe(true);
  });

  it('should allow moving from MEETING_COMPLETED to DIAGNOSTIC_PROPOSED or SERVICE_PROPOSED', () => {
    expect(isValidTransition(LeadStage.MEETING_COMPLETED, LeadStage.DIAGNOSTIC_PROPOSED)).toBe(true);
    expect(isValidTransition(LeadStage.MEETING_COMPLETED, LeadStage.SERVICE_PROPOSED)).toBe(true);
  });

  it('should allow closing diagnostic as WON or CLOSED_LOST', () => {
    expect(isValidTransition(LeadStage.DIAGNOSTIC_PROPOSED, LeadStage.DIAGNOSTIC_WON)).toBe(true);
    expect(isValidTransition(LeadStage.DIAGNOSTIC_PROPOSED, LeadStage.CLOSED_LOST)).toBe(true);
  });

  it('should strictly reject illegal jump from NEW directly to DIAGNOSTIC_WON', () => {
    expect(isValidTransition(LeadStage.NEW, LeadStage.DIAGNOSTIC_WON)).toBe(false);
  });

  it('should strictly reject jumping from NEW directly to SERVICE_WON', () => {
    expect(isValidTransition(LeadStage.NEW, LeadStage.SERVICE_WON)).toBe(false);
  });

  it('should reject transitioning out of terminal SERVICE_WON stage', () => {
    expect(isValidTransition(LeadStage.SERVICE_WON, LeadStage.NEW)).toBe(false);
    expect(isValidTransition(LeadStage.SERVICE_WON, LeadStage.UNQUALIFIED)).toBe(false);
  });

  it('should allow re-engagement from UNQUALIFIED back to CONTACTED for reactivation', () => {
    expect(isValidTransition(LeadStage.UNQUALIFIED, LeadStage.CONTACTED)).toBe(true);
  });
});
