import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LeadStage, UserRoleType } from '@lumora/shared-types';

export function normalizeDomain(urlOrDomain?: string | null): string {
  if (!urlOrDomain) return '';
  let d = urlOrDomain.trim().toLowerCase();
  d = d.replace(/^https?:\/\//i, '');
  d = d.replace(/^www\./i, '');
  d = d.split('/')[0];
  d = d.split(':')[0];
  return d;
}

export function normalizePhone(phone?: string | null): string {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
}

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async list(user: any, query: {
    page?: number;
    limit?: number;
    stage?: string;
    businessUnitId?: string;
    partnerId?: string;
    search?: string;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    // Record-level permission enforcement:
    // If user is PARTNER, they can ONLY see their own leads!
    if (user.roles.includes(UserRoleType.PARTNER) && !user.roles.includes(UserRoleType.SUPER_ADMIN)) {
      where.partnerId = user.id;
    } else if (query.partnerId) {
      where.partnerId = query.partnerId;
    }

    if (query.stage) {
      where.stage = query.stage;
    }
    if (query.businessUnitId) {
      where.businessUnitId = query.businessUnitId;
    }
    if (query.search) {
      where.OR = [
        { companyName: { contains: query.search, mode: 'insensitive' } },
        { contactName: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const [total, leads] = await Promise.all([
      this.prisma.lead.count({ where }),
      this.prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          partner: { select: { id: true, fullName: true, email: true } },
          owner: { select: { id: true, fullName: true, email: true } },
          businessUnit: { select: { id: true, name: true, brandPrimaryColor: true, brandAccentColor: true } },
          activities: { orderBy: { happenedAt: 'desc' }, take: 1 }
        }
      })
    ]);

    return {
      data: leads.map((l) => ({
        ...l,
        partnerName: l.partner?.fullName,
        ownerName: l.owner?.fullName,
        businessUnitName: l.businessUnit?.name
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getOne(id: string, user: any) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        partner: { select: { id: true, fullName: true, email: true } },
        owner: { select: { id: true, fullName: true, email: true } },
        businessUnit: true,
        activities: {
          include: { actor: { select: { id: true, fullName: true } } },
          orderBy: { happenedAt: 'desc' }
        },
        meetings: {
          include: { outcome: true },
          orderBy: { scheduledAtUtc: 'desc' }
        },
        deals: {
          include: { paymentEvidences: true },
          orderBy: { createdAt: 'desc' }
        },
        tasks: { orderBy: { dueAt: 'asc' } }
      }
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    // Partner record isolation
    if (
      user.roles.includes(UserRoleType.PARTNER) &&
      !user.roles.includes(UserRoleType.SUPER_ADMIN) &&
      lead.partnerId !== user.id
    ) {
      throw new ForbiddenException('Access denied: You do not have permission to view another partner’s lead.');
    }

    return {
      ...lead,
      partnerName: lead.partner?.fullName,
      ownerName: lead.owner?.fullName,
      businessUnitName: lead.businessUnit?.name
    };
  }

  async checkDuplicate(params: {
    companyWebsite?: string;
    contactEmail?: string;
    contactPhone?: string;
    companyName?: string;
  }) {
    const matches: Array<{
      matchedLeadId: string;
      companyName: string;
      stage: string;
      matchType: string;
      confidence: number;
    }> = [];

    const normDomain = normalizeDomain(params.companyWebsite);
    const normPhone = normalizePhone(params.contactPhone);

    if (normDomain) {
      const byDomain = await this.prisma.lead.findMany({
        where: {
          companyWebsite: { contains: normDomain, mode: 'insensitive' }
        },
        select: { id: true, companyName: true, stage: true }
      });
      byDomain.forEach((l) =>
        matches.push({
          matchedLeadId: l.id,
          companyName: l.companyName,
          stage: l.stage,
          matchType: 'DOMAIN',
          confidence: 0.95
        })
      );
    }

    if (params.contactEmail) {
      const byEmail = await this.prisma.lead.findMany({
        where: { contactEmail: { equals: params.contactEmail.toLowerCase(), mode: 'insensitive' } },
        select: { id: true, companyName: true, stage: true }
      });
      byEmail.forEach((l) =>
        matches.push({
          matchedLeadId: l.id,
          companyName: l.companyName,
          stage: l.stage,
          matchType: 'EMAIL',
          confidence: 0.9
        })
      );
    }

    if (normPhone && normPhone.length >= 8) {
      const byPhone = await this.prisma.lead.findMany({
        where: { contactPhone: { contains: normPhone.slice(-8) } },
        select: { id: true, companyName: true, stage: true }
      });
      byPhone.forEach((l) =>
        matches.push({
          matchedLeadId: l.id,
          companyName: l.companyName,
          stage: l.stage,
          matchType: 'PHONE',
          confidence: 0.85
        })
      );
    }

    // Deduplicate matches by leadId
    const uniqueMatches = Array.from(new Map(matches.map((m) => [m.matchedLeadId, m])).values());

    return {
      hasDuplicate: uniqueMatches.length > 0,
      matches: uniqueMatches
    };
  }

  async create(user: any, data: any) {
    // 1. Strict Eligibility Restrictions
    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Your account is not active. Only active and verified users can register prospects.');
    }

    const allowedRoles = [UserRoleType.PARTNER, UserRoleType.SALES, UserRoleType.OPERATIONS, UserRoleType.SUPER_ADMIN];
    const hasAllowedRole = user.roles?.some((r: string) => allowedRoles.includes(r as UserRoleType));
    if (!hasAllowedRole) {
      throw new ForbiddenException('You do not have the required role permissions to register prospects.');
    }

    if (user.roles?.includes(UserRoleType.PARTNER) && !user.roles?.includes(UserRoleType.SUPER_ADMIN)) {
      if (user.profile?.onboardingStatus === 'REJECTED') {
        throw new ForbiddenException('Your partner application was rejected. Prospect registration is disabled.');
      }
    }

    const normDomain = normalizeDomain(data.companyWebsite);
    const normEmail = data.contactEmail?.trim().toLowerCase();

    // 2. Strict Duplicate Prevention: Check if domain or contact email already exists
    const duplicateOr: any[] = [];
    if (normDomain) {
      duplicateOr.push({ companyWebsite: { contains: normDomain, mode: 'insensitive' } });
    }
    if (normEmail) {
      duplicateOr.push({ contactEmail: { equals: normEmail, mode: 'insensitive' } });
    }

    if (duplicateOr.length > 0) {
      const existingDuplicate = await this.prisma.lead.findFirst({
        where: { OR: duplicateOr },
        select: { id: true, companyName: true, stage: true }
      });
      if (existingDuplicate) {
        throw new BadRequestException(
          `A prospect for "${existingDuplicate.companyName}" (${existingDuplicate.stage}) is already registered. Duplicate submissions are not permitted.`
        );
      }
    }

    // Fetch default company & owner (Sales Manager or Admin)
    const bu = await this.prisma.businessUnit.findUnique({
      where: { id: data.businessUnitId },
      include: { company: true }
    });

    if (!bu) {
      throw new BadRequestException('Selected Business Unit is invalid');
    }

    // Find default sales owner or assign to admin
    const salesUser = await this.prisma.userRole.findFirst({
      where: { role: { name: 'SALES' } },
      select: { userId: true }
    });
    const defaultOwnerId = salesUser ? salesUser.userId : user.id;

    const lead = await this.prisma.$transaction(async (tx) => {
      const newLead = await tx.lead.create({
        data: {
          companyId: bu.companyId,
          businessUnitId: bu.id,
          partnerId: user.id,
          ownerId: defaultOwnerId,
          companyName: data.companyName,
          companyWebsite: normDomain || data.companyWebsite,
          contactName: data.contactName,
          contactRole: data.contactRole,
          contactEmail: data.contactEmail?.toLowerCase(),
          contactPhone: data.contactPhone,
          geography: data.geography || 'India',
          industry: data.industry,
          serviceInterest: data.serviceInterest,
          source: data.source || 'DIRECT_OUTREACH',
          needSummary: data.needSummary,
          consentBasis: data.consentBasis,
          stage: LeadStage.NEW
        }
      });

      // Record creation activity
      await tx.leadActivity.create({
        data: {
          leadId: newLead.id,
          actorId: user.id,
          activityType: 'LEAD_CREATED',
          notes: `Lead registered by partner: ${data.companyName}. Need: ${data.needSummary.slice(0, 100)}...`,
          channel: 'APP'
        }
      });

      return newLead;
    });

    return lead;
  }

  async update(id: string, user: any, data: any) {
    const existing = await this.prisma.lead.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Lead not found');

    if (
      user.roles.includes(UserRoleType.PARTNER) &&
      !user.roles.includes(UserRoleType.SUPER_ADMIN) &&
      existing.partnerId !== user.id
    ) {
      throw new ForbiddenException('You cannot edit another partner’s lead');
    }

    // Lead stage verification and qualification is STRICTLY restricted to Admins/Operations
    if (data.stage && data.stage !== existing.stage) {
      const canChangeStage = user.roles?.some((r: string) =>
        [UserRoleType.SUPER_ADMIN, UserRoleType.OPERATIONS, UserRoleType.SALES].includes(r as UserRoleType)
      );
      if (!canChangeStage) {
        throw new ForbiddenException(
          'Lead qualification and approval is strictly restricted to administrative operations. Partners cannot verify or qualify their own leads.'
        );
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const l = await tx.lead.update({
        where: { id },
        data: {
          stage: data.stage ?? existing.stage,
          companyName: data.companyName ?? existing.companyName,
          contactName: data.contactName ?? existing.contactName,
          contactRole: data.contactRole ?? existing.contactRole,
          contactEmail: data.contactEmail ?? existing.contactEmail,
          contactPhone: data.contactPhone ?? existing.contactPhone,
          needSummary: data.needSummary ?? existing.needSummary,
          unqualifiedReason: data.unqualifiedReason ?? existing.unqualifiedReason,
          closedLostReason: data.closedLostReason ?? existing.closedLostReason,
          nextActionAt: data.nextActionAt !== undefined ? data.nextActionAt : existing.nextActionAt
        }
      });

      if (data.stage && data.stage !== existing.stage) {
        await tx.leadActivity.create({
          data: {
            leadId: id,
            actorId: user.id,
            activityType: 'STAGE_CHANGED',
            notes: `Lead stage transitioned from ${existing.stage} to ${data.stage}. ${data.unqualifiedReason ? `Reason: ${data.unqualifiedReason}` : ''}`,
            channel: 'APP'
          }
        });
      }

      return l;
    });

    return updated;
  }

  async addActivity(leadId: string, actorId: string, data: any) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.leadActivity.create({
      data: {
        leadId,
        actorId,
        activityType: data.activityType || 'NOTE_ADDED',
        notes: data.notes,
        outcome: data.outcome,
        channel: data.channel || 'PHONE',
        nextActionAt: data.nextActionAt ? new Date(data.nextActionAt) : null
      }
    });
  }

  async claimConflict(requesterId: string, data: { existingLeadId: string; candidateLeadId?: string; reason: string }) {
    const existing = await this.prisma.lead.findUnique({ where: { id: data.existingLeadId } });
    if (!existing) throw new NotFoundException('Existing lead not found');

    return this.prisma.leadClaimConflict.create({
      data: {
        existingLeadId: data.existingLeadId,
        candidateLeadId: data.candidateLeadId || null,
        requesterId,
        reason: data.reason,
        decision: 'PENDING'
      }
    });
  }

  async resolveConflict(conflictId: string, reviewerId: string, data: { decision: string; reason: string; splitPercentage?: number }) {
    const conflict = await this.prisma.leadClaimConflict.findUnique({ where: { id: conflictId } });
    if (!conflict) throw new NotFoundException('Conflict record not found');

    return this.prisma.leadClaimConflict.update({
      where: { id: conflictId },
      data: {
        decision: data.decision,
        reason: data.reason,
        splitPercentage: data.splitPercentage,
        reviewerId,
        resolvedAt: new Date()
      }
    });
  }

  async reassign(leadId: string, newOwnerId: string, reason: string, actorId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const updated = await this.prisma.lead.update({
      where: { id: leadId },
      data: { ownerId: newOwnerId }
    });

    await this.prisma.leadActivity.create({
      data: {
        leadId,
        actorId,
        activityType: 'OWNER_REASSIGNED',
        notes: `Ownership reassigned to ${newOwnerId}. Reason: ${reason}`,
        channel: 'ADMIN'
      }
    });

    return updated;
  }

  async approveLead(id: string, actorId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id }, include: { partner: true } });
    if (!lead) throw new NotFoundException('Lead not found');

    const updated = await this.prisma.$transaction(async (tx) => {
      const l = await tx.lead.update({
        where: { id },
        data: { stage: LeadStage.QUALIFIED }
      });

      await tx.leadActivity.create({
        data: {
          leadId: id,
          actorId,
          activityType: 'STAGE_CHANGED',
          notes: 'Prospect verified and approved by Operations/Administrator.',
          channel: 'ADMIN_CONSOLE'
        }
      });

      // Notify the partner who submitted the lead
      await tx.notification.create({
        data: {
          userId: lead.partnerId,
          type: 'LEAD_APPROVED',
          title: 'Prospect Approved! 🎉',
          message: `Your prospect "${lead.companyName}" has been verified and approved by Operations. You can now book discovery meetings!`
        }
      });

      return l;
    });

    return updated;
  }

  async rejectLead(id: string, actorId: string, reason?: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id }, include: { partner: true } });
    if (!lead) throw new NotFoundException('Lead not found');

    const updated = await this.prisma.$transaction(async (tx) => {
      const l = await tx.lead.update({
        where: { id },
        data: {
          stage: LeadStage.UNQUALIFIED,
          unqualifiedReason: reason || 'Not approved by Operations'
        }
      });

      await tx.leadActivity.create({
        data: {
          leadId: id,
          actorId,
          activityType: 'STAGE_CHANGED',
          notes: `Prospect unverified/rejected by Operations. Reason: ${reason || 'Unspecified'}`,
          channel: 'ADMIN_CONSOLE'
        }
      });

      // Notify the partner who submitted the lead
      await tx.notification.create({
        data: {
          userId: lead.partnerId,
          type: 'LEAD_REJECTED',
          title: 'Prospect Update',
          message: `Your prospect "${lead.companyName}" was marked unqualified. Reason: ${reason || 'Does not match current criteria'}.`
        }
      });

      return l;
    });

    return updated;
  }

  async deleteLead(id: string, user: any) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');

    const isAdmin = user.roles?.some((r: string) =>
      [UserRoleType.SUPER_ADMIN, UserRoleType.OPERATIONS].includes(r as UserRoleType)
    );
    const isOwnerPartner = lead.partnerId === user.id && lead.stage === LeadStage.NEW;

    if (!isAdmin && !isOwnerPartner) {
      throw new ForbiddenException(
        'Only administrators or the submitting partner (while lead is still pending approval) can delete a prospect submission.'
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.leadActivity.deleteMany({ where: { leadId: id } });
      await tx.task.deleteMany({ where: { leadId: id } });
      await tx.meeting.deleteMany({ where: { leadId: id } });
      await tx.deal.deleteMany({ where: { leadId: id } });
      await tx.lead.delete({ where: { id } });
    });

    return { success: true, message: `Prospect "${lead.companyName}" was deleted successfully.` };
  }
}

