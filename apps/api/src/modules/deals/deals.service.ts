import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  DealType,
  PaymentStatus,
  ContractStatus,
  LeadStage,
  UserRoleType,
  PaymentEvidenceStatus,
  CommissionTriggerType
} from '@lumora/shared-types';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async list(user: any, query: { leadId?: string; stage?: string; dealType?: string }) {
    const where: any = {};
    if (query.leadId) where.leadId = query.leadId;
    if (query.dealType) where.dealType = query.dealType;

    // Partner scoping: partner only sees deals for their own leads
    if (user.roles.includes(UserRoleType.PARTNER) && !user.roles.includes(UserRoleType.SUPER_ADMIN)) {
      where.lead = { partnerId: user.id };
    }

    const deals = await this.prisma.deal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        lead: { select: { id: true, companyName: true, contactName: true, partnerId: true } },
        service: { select: { id: true, name: true } },
        paymentEvidences: { orderBy: { createdAt: 'desc' } }
      }
    });

    return deals.map((d) => ({
      ...d,
      leadCompanyName: d.lead?.companyName,
      serviceName: d.service?.name,
      partnerId: d.lead?.partnerId
    }));
  }

  async getOne(id: string, user: any) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        lead: { include: { partner: true, owner: true } },
        service: true,
        paymentEvidences: {
          include: { verifiedBy: { select: { id: true, fullName: true } } },
          orderBy: { createdAt: 'desc' }
        },
        deliveryHandoff: true,
        commissionLedger: true
      }
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    if (
      user.roles.includes(UserRoleType.PARTNER) &&
      !user.roles.includes(UserRoleType.SUPER_ADMIN) &&
      deal.lead.partnerId !== user.id
    ) {
      throw new ForbiddenException('Access denied to this deal');
    }

    return {
      ...deal,
      leadCompanyName: deal.lead.companyName,
      partnerId: deal.lead.partnerId
    };
  }

  async create(user: any, data: any) {
    const lead = await this.prisma.lead.findUnique({ where: { id: data.leadId } });
    if (!lead) throw new BadRequestException('Invalid lead ID');

    let amountPaise = BigInt(0);
    if (data.amountMinorUnits) {
      amountPaise = BigInt(data.amountMinorUnits);
    } else if (data.dealType === DealType.DIAGNOSTIC) {
      amountPaise = BigInt(3700000); // Standard ₹37,000 paise
    }

    const deal = await this.prisma.$transaction(async (tx) => {
      const d = await tx.deal.create({
        data: {
          leadId: data.leadId,
          dealType: data.dealType,
          serviceId: data.serviceId || null,
          amountMinorUnits: amountPaise,
          currency: data.currency || 'INR',
          contractStatus: ContractStatus.DRAFT,
          paymentStatus: PaymentStatus.PENDING,
          billingFrequency: data.billingFrequency || 'ONE_OFF',
          expectedStartDate: data.expectedStartDate ? new Date(data.expectedStartDate) : null
        }
      });

      // Update lead stage
      const newStage = data.dealType === DealType.DIAGNOSTIC ? LeadStage.DIAGNOSTIC_PROPOSED : LeadStage.SERVICE_PROPOSED;
      await tx.lead.update({
        where: { id: lead.id },
        data: { stage: newStage }
      });

      await tx.leadActivity.create({
        data: {
          leadId: lead.id,
          actorId: user.id,
          activityType: 'DEAL_CREATED',
          notes: `Created ${data.dealType} deal proposal for ${lead.companyName}`,
          channel: 'APP'
        }
      });

      return d;
    });

    return deal;
  }

  async submitPaymentEvidence(dealId: string, user: any, data: any) {
    const deal = await this.prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal) throw new NotFoundException('Deal not found');

    const evidence = await this.prisma.$transaction(async (tx) => {
      const ev = await tx.paymentEvidence.create({
        data: {
          dealId,
          amountMinorUnits: BigInt(data.amountMinorUnits),
          currency: data.currency || 'INR',
          status: PaymentEvidenceStatus.SUBMITTED,
          receivedAt: new Date(data.receivedAt || Date.now()),
          paymentReference: data.paymentReference,
          evidenceUrl: data.evidenceUrl || null
        }
      });

      await tx.deal.update({
        where: { id: dealId },
        data: { paymentStatus: PaymentStatus.EVIDENCE_SUBMITTED }
      });

      return ev;
    });

    return evidence;
  }

  async verifyPayment(dealId: string, verifierUser: any, data: { approved: boolean; rejectionReason?: string }) {
    // Only Finance, Sales Manager or Admin can verify payments
    const authorized =
      verifierUser.roles.includes(UserRoleType.FINANCE) ||
      verifierUser.roles.includes(UserRoleType.SUPER_ADMIN) ||
      verifierUser.roles.includes(UserRoleType.SALES);

    if (!authorized) {
      throw new ForbiddenException('Only Finance or Sales Managers can verify client payments');
    }

    const deal = await this.prisma.deal.findUnique({
      where: { id: dealId },
      include: { lead: true }
    });
    if (!deal) throw new NotFoundException('Deal not found');

    // Partner segregation of duties check: A partner cannot verify payment for their own deal!
    if (deal.lead.partnerId === verifierUser.id && !verifierUser.roles.includes(UserRoleType.SUPER_ADMIN)) {
      throw new ForbiddenException('Segregation of duties violation: You cannot verify payment for your own deal');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      if (data.approved) {
        // Mark payment evidences as VERIFIED
        await tx.paymentEvidence.updateMany({
          where: { dealId, status: PaymentEvidenceStatus.SUBMITTED },
          data: {
            status: PaymentEvidenceStatus.VERIFIED,
            verifiedById: verifierUser.id,
            verifiedAt: new Date()
          }
        });

        const newLeadStage = deal.dealType === DealType.DIAGNOSTIC ? LeadStage.DIAGNOSTIC_WON : LeadStage.SERVICE_WON;
        await tx.deal.update({
          where: { id: dealId },
          data: {
            paymentStatus: PaymentStatus.VERIFIED,
            contractStatus: ContractStatus.SIGNED,
            firstPaymentAt: new Date(),
            closedAt: new Date(),
            closedBy: verifierUser.id
          }
        });

        await tx.lead.update({
          where: { id: deal.leadId },
          data: { stage: newLeadStage }
        });

        // Trigger automatic qualifying commission entry in ledger (APPEND-ONLY)
        const triggerEvent =
          deal.dealType === DealType.DIAGNOSTIC
            ? CommissionTriggerType.DIAGNOSTIC_CLOSURE
            : CommissionTriggerType.SERVICE_MILESTONE;

        // Fetch active policy
        const policy = await tx.commissionPolicy.findFirst({
          where: { triggerType: triggerEvent, isActive: true },
          orderBy: { createdAt: 'desc' }
        });

        if (policy) {
          let commissionAmount = policy.fixedAmountMinorUnits || BigInt(100000);
          if (policy.percentageBasisPoints && deal.amountMinorUnits) {
            commissionAmount = (deal.amountMinorUnits * BigInt(policy.percentageBasisPoints)) / BigInt(10000);
          }

          const idempotencyKey = `idemp-comm-${deal.id}-${policy.id}-${triggerEvent}`;

          // Create ledger entry if not already exists (idempotent)
          const existingLedger = await tx.commissionLedger.findUnique({
            where: { idempotencyKey }
          });

          if (!existingLedger) {
            await tx.commissionLedger.create({
              data: {
                partnerId: deal.lead.partnerId,
                dealId: deal.id,
                policyId: policy.id,
                triggerEvent,
                calculationBasis: `Policy ${policy.policyVersion}: verified ${deal.dealType} closure`,
                grossAmountMinorUnits: commissionAmount,
                currency: deal.currency,
                status: 'PENDING_REVIEW',
                idempotencyKey
              }
            });

            // Dispatch notification to partner
            await tx.notification.create({
              data: {
                userId: deal.lead.partnerId,
                type: 'COMMISSION_STATUS',
                title: 'New Commission Generated',
                message: `Qualifying incentive generated for ${deal.lead.companyName}. Awaiting finance review.`
              }
            });
          }
        }

        return { success: true, message: 'Payment verified and deal closed as Won' };
      } else {
        // Rejected
        await tx.paymentEvidence.updateMany({
          where: { dealId, status: PaymentEvidenceStatus.SUBMITTED },
          data: {
            status: PaymentEvidenceStatus.REJECTED,
            rejectionReason: data.rejectionReason,
            verifiedById: verifierUser.id,
            verifiedAt: new Date()
          }
        });

        await tx.deal.update({
          where: { id: dealId },
          data: { paymentStatus: PaymentStatus.REJECTED }
        });

        return { success: false, message: 'Payment evidence rejected' };
      }
    });

    return result;
  }

  async submitClosure(dealId: string, user: any) {
    const deal = await this.prisma.deal.findUnique({
      where: { id: dealId },
      include: { lead: true }
    });
    if (!deal) throw new NotFoundException('Deal not found');

    if (deal.paymentStatus !== PaymentStatus.VERIFIED) {
      throw new BadRequestException('Cannot close deal before payment evidence is verified by Finance');
    }

    return { success: true, message: 'Deal closure confirmed' };
  }

  async createDeliveryHandoff(dealId: string, user: any, data: any) {
    const deal = await this.prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal) throw new NotFoundException('Deal not found');

    return this.prisma.deliveryHandoff.upsert({
      where: { dealId },
      update: {
        approvedScope: data.approvedScope,
        contacts: data.contacts,
        commitments: data.commitments,
        nextMeetingAt: data.nextMeetingAt ? new Date(data.nextMeetingAt) : null,
        documentUrls: data.documentUrls || [],
        handoffNotes: data.handoffNotes
      },
      create: {
        dealId,
        approvedScope: data.approvedScope,
        contacts: data.contacts,
        commitments: data.commitments,
        nextMeetingAt: data.nextMeetingAt ? new Date(data.nextMeetingAt) : null,
        documentUrls: data.documentUrls || [],
        handoffNotes: data.handoffNotes,
        createdById: user.id
      }
    });
  }
}
