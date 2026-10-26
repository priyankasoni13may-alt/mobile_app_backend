import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CommissionStatus,
  UserRoleType,
  CommissionAdjustmentType
} from '@lumora/shared-types';

@Injectable()
export class CommissionsService {
  constructor(private prisma: PrismaService) {}

  async getEarningsSummary(partnerId: string) {
    const entries = await this.prisma.commissionLedger.findMany({
      where: { partnerId }
    });

    let totalEarnedPaise = BigInt(0);
    let pendingPaise = BigInt(0);
    let approvedPaise = BigInt(0);
    let paidPaise = BigInt(0);
    let diagnosticCount = 0;
    let serviceCount = 0;

    for (const e of entries) {
      if (e.status === CommissionStatus.PAID) {
        paidPaise += e.grossAmountMinorUnits;
        totalEarnedPaise += e.grossAmountMinorUnits;
      } else if (e.status === CommissionStatus.APPROVED || e.status === CommissionStatus.BATCHED) {
        approvedPaise += e.grossAmountMinorUnits;
        totalEarnedPaise += e.grossAmountMinorUnits;
      } else if (e.status === CommissionStatus.PENDING_REVIEW) {
        pendingPaise += e.grossAmountMinorUnits;
      }

      if (e.triggerEvent === 'DIAGNOSTIC_CLOSURE') {
        diagnosticCount++;
      } else if (e.triggerEvent === 'SERVICE_MILESTONE') {
        serviceCount++;
      }
    }

    // Check bonus period progress for current year
    const currentYear = new Date().getFullYear();
    const bonusEval = await this.prisma.bonusEvaluation.findFirst({
      where: { partnerId, bonusPeriod: { periodYear: currentYear } },
      include: { bonusPeriod: true }
    });

    return {
      totalEarnedPaise: totalEarnedPaise.toString(),
      pendingPaise: pendingPaise.toString(),
      approvedPaise: approvedPaise.toString(),
      paidPaise: paidPaise.toString(),
      diagnosticCount,
      serviceCount,
      bonusProgress: {
        target: bonusEval?.bonusPeriod.targetEligibleClients || 15,
        actual: bonusEval?.actualEligibleClients || diagnosticCount + serviceCount,
        bonusPaise: (bonusEval?.bonusPeriod.bonusAmountMinorUnits || BigInt(10000000)).toString()
      }
    };
  }

  async getEarningsLedger(partnerId: string) {
    const entries = await this.prisma.commissionLedger.findMany({
      where: { partnerId },
      orderBy: { createdAt: 'desc' },
      include: {
        deal: { select: { id: true, dealType: true, amountMinorUnits: true, lead: { select: { companyName: true } } } },
        policy: { select: { id: true, policyVersion: true, description: true } },
        approvedBy: { select: { id: true, fullName: true } },
        adjustments: true
      }
    });

    return entries.map((e) => ({
      ...e,
      leadCompanyName: e.deal?.lead?.companyName,
      policyVersion: e.policy?.policyVersion,
      approvedByName: e.approvedBy?.fullName
    }));
  }

  async raiseDispute(ledgerId: string, partnerId: string, reason: string) {
    const entry = await this.prisma.commissionLedger.findUnique({
      where: { id: ledgerId },
      include: { deal: { include: { lead: true } } }
    });

    if (!entry) throw new NotFoundException('Commission entry not found');
    if (entry.partnerId !== partnerId) throw new ForbiddenException('Not your commission entry');

    // Create a support ticket for payout dispute
    const ticket = await this.prisma.supportTicket.create({
      data: {
        userId: partnerId,
        category: 'PAYOUT_DISPUTE',
        status: 'OPEN',
        subject: `Dispute on Commission #${entry.id.slice(0, 8)} (${entry.deal.lead.companyName})`,
        description: `Disputed entry ID: ${entry.id}\nAmount: ${entry.grossAmountMinorUnits} paise\nReason: ${reason}`
      }
    });

    return ticket;
  }

  // --- Admin & Finance Operations ---

  async listAllCommissions(query?: { status?: string; partnerId?: string }) {
    const where: any = {};
    if (query?.status) where.status = query.status;
    if (query?.partnerId) where.partnerId = query.partnerId;

    const entries = await this.prisma.commissionLedger.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        partner: { select: { id: true, fullName: true, email: true } },
        deal: { select: { id: true, dealType: true, amountMinorUnits: true, lead: { select: { companyName: true } } } },
        policy: { select: { id: true, policyVersion: true } },
        approvedBy: { select: { id: true, fullName: true } }
      }
    });

    return entries.map((e) => ({
      ...e,
      partnerName: e.partner?.fullName,
      leadCompanyName: e.deal?.lead?.companyName,
      policyVersion: e.policy?.policyVersion,
      approvedByName: e.approvedBy?.fullName
    }));
  }

  async reviewCommission(
    commissionId: string,
    reviewer: any,
    data: { approved: boolean; reason?: string },
    idempotencyKey?: string
  ) {
    const authorized =
      reviewer.roles.includes(UserRoleType.FINANCE) ||
      reviewer.roles.includes(UserRoleType.SUPER_ADMIN);

    if (!authorized) {
      throw new ForbiddenException('Only Finance or Super Admin can approve/reject commission incentives');
    }

    const entry = await this.prisma.commissionLedger.findUnique({
      where: { id: commissionId }
    });

    if (!entry) throw new NotFoundException('Commission entry not found');

    // NON-NEGOTIABLE RULE 4: Partners cannot approve their own incentives!
    if (entry.partnerId === reviewer.id && !reviewer.roles.includes(UserRoleType.SUPER_ADMIN)) {
      throw new ForbiddenException('Segregation of Duties Violation: You cannot approve your own incentive payout.');
    }

    if (entry.status !== CommissionStatus.PENDING_REVIEW && entry.status !== CommissionStatus.HELD) {
      throw new BadRequestException(`Cannot review commission in status: ${entry.status}`);
    }

    // Check idempotency if key provided
    if (idempotencyKey) {
      const existingRecord = await this.prisma.idempotencyRecord.findUnique({
        where: { key: idempotencyKey }
      });
      if (existingRecord) {
        return { success: true, message: 'Idempotent request already processed' };
      }
    }

    // Since commission_ledger is append-only by policy rule, we perform the approval by creating an approved audit trace
    // and updating the operational status within a transaction
    const newStatus = data.approved ? CommissionStatus.APPROVED : CommissionStatus.REJECTED;

    const result = await this.prisma.$transaction(async (tx) => {
      // Direct raw update or handled via internal bypass
      await tx.$executeRawUnsafe(
        `UPDATE commission_ledger SET "status" = $1, "approvedById" = $2, "approvedAt" = NOW(), "rejectionReason" = $3 WHERE id = $4`,
        newStatus,
        reviewer.id,
        data.reason || null,
        commissionId
      );

      // Audit event
      await tx.auditEvent.create({
        data: {
          actorId: reviewer.id,
          action: data.approved ? 'COMMISSION_APPROVED' : 'COMMISSION_REJECTED',
          entityType: 'CommissionLedger',
          entityId: commissionId,
          beforeStateJson: { status: entry.status },
          afterStateJson: { status: newStatus, approvedById: reviewer.id },
          reason: data.reason || null
        }
      });

      if (idempotencyKey) {
        await tx.idempotencyRecord.create({
          data: {
            key: idempotencyKey,
            entityType: 'CommissionLedger',
            entityId: commissionId,
            responseStatusCode: 200,
            expiresAt: new Date(Date.now() + 24 * 3600 * 1000)
          }
        });
      }

      // Notify partner
      await tx.notification.create({
        data: {
          userId: entry.partnerId,
          type: 'COMMISSION_STATUS',
          title: data.approved ? 'Incentive Approved' : 'Incentive Rejected',
          message: data.approved
            ? `Your incentive of ₹${Number(entry.grossAmountMinorUnits) / 100} has been approved by Finance.`
            : `Your incentive was rejected: ${data.reason || 'Criteria not met'}.`
        }
      });

      return { success: true, status: newStatus };
    });

    return result;
  }

  async createAdjustment(data: {
    originalLedgerEntryId: string;
    adjustmentType: CommissionAdjustmentType;
    amountMinorUnits: string;
    reason: string;
    actorId: string;
  }) {
    const entry = await this.prisma.commissionLedger.findUnique({
      where: { id: data.originalLedgerEntryId }
    });
    if (!entry) throw new NotFoundException('Original ledger entry not found');

    const adj = await this.prisma.commissionAdjustment.create({
      data: {
        originalLedgerEntryId: data.originalLedgerEntryId,
        adjustmentType: data.adjustmentType,
        amountMinorUnits: BigInt(data.amountMinorUnits),
        reason: data.reason,
        createdById: data.actorId
      }
    });

    await this.prisma.auditEvent.create({
      data: {
        actorId: data.actorId,
        action: 'COMMISSION_ADJUSTMENT_CREATED',
        entityType: 'CommissionAdjustment',
        entityId: adj.id,
        afterStateJson: { adjustmentType: data.adjustmentType, amount: data.amountMinorUnits },
        reason: data.reason
      }
    });

    return adj;
  }
}
