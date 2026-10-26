import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  PayoutBatchStatus,
  CommissionStatus,
  BonusStatus,
  UserRoleType
} from '@lumora/shared-types';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async listBatches() {
    const batches = await this.prisma.payoutBatch.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { id: true, fullName: true } },
        approvedBy: { select: { id: true, fullName: true } },
        items: {
          include: {
            commissionLedgerEntry: {
              include: {
                partner: { select: { id: true, fullName: true, email: true } },
                deal: { include: { lead: true } }
              }
            }
          }
        }
      }
    });

    return batches.map((b) => ({
      ...b,
      createdByName: b.createdBy?.fullName,
      approvedByName: b.approvedBy?.fullName
    }));
  }

  async createBatch(user: any, data: { commissionLedgerEntryIds: string[]; notes?: string }) {
    if (!data.commissionLedgerEntryIds || data.commissionLedgerEntryIds.length === 0) {
      throw new BadRequestException('At least one approved commission entry is required to create a batch');
    }

    // Verify all entries are APPROVED and not already in a batch
    const entries = await this.prisma.commissionLedger.findMany({
      where: {
        id: { in: data.commissionLedgerEntryIds },
        status: CommissionStatus.APPROVED
      }
    });

    if (entries.length !== data.commissionLedgerEntryIds.length) {
      throw new BadRequestException('One or more selected commission entries are not in APPROVED status or do not exist');
    }

    let totalAmountMinorUnits = BigInt(0);
    entries.forEach((e) => {
      totalAmountMinorUnits += e.grossAmountMinorUnits;
    });

    const batchReference = `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const batch = await this.prisma.$transaction(async (tx) => {
      const b = await tx.payoutBatch.create({
        data: {
          batchReference,
          totalAmountMinorUnits,
          currency: 'INR',
          itemCount: entries.length,
          status: PayoutBatchStatus.DRAFT,
          notes: data.notes || null,
          createdById: user.id
        }
      });

      for (const entry of entries) {
        await tx.payoutItem.create({
          data: {
            batchId: b.id,
            commissionLedgerEntryId: entry.id,
            amountMinorUnits: entry.grossAmountMinorUnits,
            status: 'IN_BATCH'
          }
        });

        // Mark ledger entry status as BATCHED
        await tx.$executeRawUnsafe(
          `UPDATE commission_ledger SET "status" = $1 WHERE id = $2`,
          CommissionStatus.BATCHED,
          entry.id
        );
      }

      await tx.auditEvent.create({
        data: {
          actorId: user.id,
          action: 'PAYOUT_BATCH_CREATED',
          entityType: 'PayoutBatch',
          entityId: b.id,
          afterStateJson: { batchReference, totalAmountMinorUnits: totalAmountMinorUnits.toString(), itemCount: entries.length },
          reason: 'Created payout batch for approved partner commissions'
        }
      });

      return b;
    });

    return batch;
  }

  async approveBatch(batchId: string, user: any) {
    const batch = await this.prisma.payoutBatch.findUnique({ where: { id: batchId } });
    if (!batch) throw new NotFoundException('Payout batch not found');

    if (batch.status !== PayoutBatchStatus.DRAFT) {
      throw new BadRequestException(`Batch is not in DRAFT status: ${batch.status}`);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const b = await tx.payoutBatch.update({
        where: { id: batchId },
        data: {
          status: PayoutBatchStatus.APPROVED,
          approvedById: user.id,
          approvedAt: new Date()
        }
      });

      await tx.auditEvent.create({
        data: {
          actorId: user.id,
          action: 'PAYOUT_BATCH_APPROVED',
          entityType: 'PayoutBatch',
          entityId: b.id,
          beforeStateJson: { status: batch.status },
          afterStateJson: { status: PayoutBatchStatus.APPROVED }
        }
      });

      return b;
    });

    return updated;
  }

  async recordPayments(batchId: string, user: any, data: { paymentReference: string }) {
    const batch = await this.prisma.payoutBatch.findUnique({
      where: { id: batchId },
      include: { items: true }
    });
    if (!batch) throw new NotFoundException('Payout batch not found');

    if (batch.status !== PayoutBatchStatus.APPROVED) {
      throw new BadRequestException('Batch must be approved by Finance before recording payments');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const now = new Date();

      const b = await tx.payoutBatch.update({
        where: { id: batchId },
        data: {
          status: PayoutBatchStatus.COMPLETED,
          processedAt: now
        }
      });

      for (const item of batch.items) {
        await tx.payoutItem.update({
          where: { id: item.id },
          data: {
            status: 'PAID',
            paymentReference: data.paymentReference,
            paidAt: now
          }
        });

        await tx.$executeRawUnsafe(
          `UPDATE commission_ledger SET "status" = $1, "paymentReference" = $2, "paidAt" = NOW() WHERE id = $3`,
          CommissionStatus.PAID,
          data.paymentReference,
          item.commissionLedgerEntryId
        );
      }

      await tx.auditEvent.create({
        data: {
          actorId: user.id,
          action: 'PAYOUT_BATCH_PAID',
          entityType: 'PayoutBatch',
          entityId: b.id,
          afterStateJson: { status: PayoutBatchStatus.COMPLETED, paymentReference: data.paymentReference }
        }
      });

      return b;
    });

    return updated;
  }

  async exportPayoutsCsv(user: any) {
    // Financial integrity rule 11: CSV exports of financial data require audit log entry
    await this.prisma.auditEvent.create({
      data: {
        actorId: user.id,
        action: 'FINANCIAL_EXPORT_CSV',
        entityType: 'CommissionLedger',
        entityId: 'ALL',
        reason: 'Authorized finance export of commission and payout ledger'
      }
    });

    const entries = await this.prisma.commissionLedger.findMany({
      include: {
        partner: { select: { fullName: true, email: true, phone: true } },
        deal: { include: { lead: true } },
        policy: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const headers = ['Ledger ID', 'Partner Name', 'Partner Email', 'Client Company', 'Trigger Event', 'Gross Amount (Paise)', 'Currency', 'Status', 'Payment Ref', 'Created At'];
    const rows = entries.map((e) => [
      e.id,
      `"${e.partner.fullName}"`,
      e.partner.email,
      `"${e.deal.lead.companyName}"`,
      e.triggerEvent,
      e.grossAmountMinorUnits.toString(),
      e.currency,
      e.status,
      e.paymentReference || '',
      e.createdAt.toISOString()
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    return { csv: csvContent, count: entries.length };
  }

  // --- Annual Bonus Evaluations ---

  async listBonusEvaluations() {
    return this.prisma.bonusEvaluation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        partner: { select: { id: true, fullName: true, email: true } },
        bonusPeriod: true
      }
    });
  }

  async evaluateBonus(partnerId: string, year: number, actorId: string) {
    const period = await this.prisma.bonusPeriod.findUnique({
      where: { periodYear: year }
    });
    if (!period) throw new NotFoundException(`Bonus period ${year} not defined`);

    // Count closed Won deals for partner in that calendar year
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    const closedDealsCount = await this.prisma.deal.count({
      where: {
        lead: { partnerId },
        paymentStatus: 'VERIFIED',
        closedAt: { gte: startOfYear, lte: endOfYear }
      }
    });

    const isEligible = closedDealsCount >= period.targetEligibleClients;

    const evaluation = await this.prisma.bonusEvaluation.upsert({
      where: { partnerId_bonusPeriodId: { partnerId, bonusPeriodId: period.id } },
      update: {
        actualEligibleClients: closedDealsCount,
        isEligible,
        status: isEligible ? BonusStatus.APPROVED : BonusStatus.EVALUATING,
        evaluatedById: actorId,
        evaluatedAt: new Date()
      },
      create: {
        partnerId,
        bonusPeriodId: period.id,
        actualEligibleClients: closedDealsCount,
        isEligible,
        status: isEligible ? BonusStatus.APPROVED : BonusStatus.EVALUATING,
        evaluatedById: actorId,
        evaluatedAt: new Date()
      }
    });

    return evaluation;
  }
}
