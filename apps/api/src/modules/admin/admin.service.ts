import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRoleType, UserStatus, OnboardingStatus } from '@lumora/shared-types';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async listPartners(query?: { status?: string; search?: string }) {
    const where: any = {
      userRoles: {
        some: { role: { name: UserRoleType.PARTNER } }
      }
    };

    if (query?.status) {
      where.partnerProfile = { onboardingStatus: query.status };
    }

    if (query?.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const partners = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        partnerProfile: true,
        verificationRecords: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: {
          select: {
            leadsAsPartner: true,
            commissions: true
          }
        }
      }
    });

    return partners.map((p) => ({
      id: p.id,
      fullName: p.fullName,
      email: p.email,
      phone: p.phone,
      status: p.status,
      createdAt: p.createdAt,
      profile: p.partnerProfile,
      latestVerification: p.verificationRecords[0] || null,
      leadCount: p._count.leadsAsPartner,
      commissionCount: p._count.commissions
    }));
  }

  async getPartner(id: string) {
    const partner = await this.prisma.user.findUnique({
      where: { id },
      include: {
        partnerProfile: true,
        verificationRecords: { orderBy: { createdAt: 'desc' } },
        agreementAcceptances: { include: { agreement: true } },
        learningCompletions: { include: { module: true } },
        leadsAsPartner: { take: 10, orderBy: { createdAt: 'desc' } },
        commissions: { take: 10, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!partner) throw new NotFoundException('Partner not found');
    return partner;
  }

  async decidePartner(
    partnerId: string,
    reviewerId: string,
    data: { decision: 'APPROVE' | 'REJECT' | 'SUSPEND'; reason?: string }
  ) {
    const partner = await this.prisma.user.findUnique({
      where: { id: partnerId },
      include: { partnerProfile: true }
    });

    if (!partner) throw new NotFoundException('Partner not found');

    let newOnboardingStatus = OnboardingStatus.APPROVED;
    let newUserStatus = UserStatus.ACTIVE;

    if (data.decision === 'REJECT') {
      newOnboardingStatus = OnboardingStatus.REJECTED;
      newUserStatus = UserStatus.SUSPENDED;
    } else if (data.decision === 'SUSPEND') {
      newUserStatus = UserStatus.SUSPENDED;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: partnerId },
        data: { status: newUserStatus }
      });

      if (partner.partnerProfile) {
        await tx.partnerProfile.update({
          where: { userId: partnerId },
          data: { onboardingStatus: newOnboardingStatus }
        });
      }

      // If approved, update verification record status to VERIFIED
      if (data.decision === 'APPROVE') {
        const latestVerif = await tx.verificationRecord.findFirst({
          where: { userId: partnerId },
          orderBy: { createdAt: 'desc' }
        });
        if (latestVerif) {
          await tx.verificationRecord.update({
            where: { id: latestVerif.id },
            data: {
              status: 'VERIFIED',
              reviewedBy: reviewerId,
              reviewedAt: new Date(),
              notes: data.reason || 'Approved by Operations'
            }
          });
        }
      }

      await tx.auditEvent.create({
        data: {
          actorId: reviewerId,
          action: `PARTNER_${data.decision}`,
          entityType: 'User',
          entityId: partnerId,
          beforeStateJson: { status: partner.status, onboardingStatus: partner.partnerProfile?.onboardingStatus },
          afterStateJson: { status: newUserStatus, onboardingStatus: newOnboardingStatus },
          reason: data.reason || null
        }
      });

      await tx.notification.create({
        data: {
          userId: partnerId,
          type: 'APPLICATION_STATUS',
          title: data.decision === 'APPROVE' ? 'Application Approved!' : `Application ${data.decision}`,
          message: data.decision === 'APPROVE'
            ? 'Congratulations! Your partner account is approved. You can now access your dashboard and submit leads.'
            : `Your application status was updated to ${data.decision}: ${data.reason || 'Please contact support.'}`
        }
      });
    });

    return { success: true, decision: data.decision };
  }

  async listAuditEvents(query?: { actorId?: string; entityType?: string; limit?: number }) {
    const where: any = {};
    if (query?.actorId) where.actorId = query.actorId;
    if (query?.entityType) where.entityType = query.entityType;

    return this.prisma.auditEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(100, query?.limit || 50),
      include: {
        actor: { select: { id: true, fullName: true, email: true } }
      }
    });
  }

  // --- Reports ---

  async getPerformanceReport() {
    const [totalPartners, activePartners, totalLeads, qualifiedLeads, wonDeals] = await Promise.all([
      this.prisma.userRole.count({ where: { role: { name: UserRoleType.PARTNER } } }),
      this.prisma.user.count({ where: { status: UserStatus.ACTIVE, userRoles: { some: { role: { name: UserRoleType.PARTNER } } } } }),
      this.prisma.lead.count(),
      this.prisma.lead.count({ where: { stage: { in: ['QUALIFIED', 'DIAGNOSTIC_WON', 'SERVICE_WON'] } } }),
      this.prisma.deal.count({ where: { paymentStatus: 'VERIFIED' } })
    ]);

    return {
      totalPartners,
      activePartners,
      totalLeads,
      qualifiedLeads,
      wonDeals,
      qualificationRate: totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0,
      winRate: qualifiedLeads > 0 ? Math.round((wonDeals / qualifiedLeads) * 100) : 0
    };
  }

  async getFunnelReport() {
    const stages = [
      'NEW',
      'CONTACTED',
      'QUALIFIED',
      'MEETING_SCHEDULED',
      'DIAGNOSTIC_PROPOSED',
      'DIAGNOSTIC_WON',
      'SERVICE_PROPOSED',
      'SERVICE_WON',
      'CLOSED_LOST'
    ];

    const counts = await Promise.all(
      stages.map(async (stage) => ({
        stage,
        count: await this.prisma.lead.count({ where: { stage } })
      }))
    );

    return counts;
  }

  async getIncentiveCostReport() {
    const ledger = await this.prisma.commissionLedger.findMany({
      select: {
        status: true,
        grossAmountMinorUnits: true,
        triggerEvent: true
      }
    });

    let totalPaidMinorUnits = BigInt(0);
    let totalPendingMinorUnits = BigInt(0);
    let diagnosticMinorUnits = BigInt(0);
    let serviceMinorUnits = BigInt(0);

    for (const e of ledger) {
      if (e.status === 'PAID') totalPaidMinorUnits += e.grossAmountMinorUnits;
      if (e.status === 'PENDING_REVIEW' || e.status === 'APPROVED') totalPendingMinorUnits += e.grossAmountMinorUnits;
      if (e.triggerEvent === 'DIAGNOSTIC_CLOSURE') diagnosticMinorUnits += e.grossAmountMinorUnits;
      if (e.triggerEvent === 'SERVICE_MILESTONE') serviceMinorUnits += e.grossAmountMinorUnits;
    }

    return {
      totalPaidMinorUnits: totalPaidMinorUnits.toString(),
      totalPendingMinorUnits: totalPendingMinorUnits.toString(),
      diagnosticMinorUnits: diagnosticMinorUnits.toString(),
      serviceMinorUnits: serviceMinorUnits.toString(),
      count: ledger.length
    };
  }
}
