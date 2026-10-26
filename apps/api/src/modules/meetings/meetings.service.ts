import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { MeetingStatus, LeadStage } from '@lumora/shared-types';

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string, query: { status?: string; leadId?: string; past?: boolean }) {
    const where: any = {
      OR: [
        { organizerId: userId },
        { lead: { partnerId: userId } }
      ]
    };

    if (query.status) {
      where.meetingStatus = query.status;
    }
    if (query.leadId) {
      where.leadId = query.leadId;
    }

    const now = new Date();
    if (query.past === true) {
      where.scheduledAtUtc = { lt: now };
    } else if (query.past === false) {
      where.scheduledAtUtc = { gte: now };
    }

    const meetings = await this.prisma.meeting.findMany({
      where,
      orderBy: { scheduledAtUtc: 'desc' },
      include: {
        lead: { select: { id: true, companyName: true, contactName: true, stage: true } },
        organizer: { select: { id: true, fullName: true, email: true } },
        outcome: true
      }
    });

    return meetings.map((m) => ({
      ...m,
      leadCompanyName: m.lead?.companyName,
      contactName: m.lead?.contactName,
      organizerName: m.organizer?.fullName
    }));
  }

  async getOne(id: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: {
        lead: true,
        organizer: { select: { id: true, fullName: true, email: true } },
        outcome: {
          include: { recordedBy: { select: { id: true, fullName: true } } }
        }
      }
    });

    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    return {
      ...meeting,
      leadCompanyName: meeting.lead?.companyName,
      contactName: meeting.lead?.contactName,
      organizerName: meeting.organizer?.fullName
    };
  }

  async create(user: any, data: any) {
    const lead = await this.prisma.lead.findUnique({ where: { id: data.leadId } });
    if (!lead) throw new BadRequestException('Invalid lead ID');

    const scheduledDate = new Date(data.scheduledAtUtc);

    const meeting = await this.prisma.$transaction(async (tx) => {
      const m = await tx.meeting.create({
        data: {
          leadId: data.leadId,
          organizerId: user.id,
          title: data.title,
          purpose: data.purpose,
          scheduledAtUtc: scheduledDate,
          timezone: data.timezone || 'Asia/Kolkata',
          durationMinutes: data.durationMinutes || 30,
          mode: data.mode || 'ONLINE',
          meetingLinkOrLocation: data.meetingLinkOrLocation,
          inviteeEmails: data.inviteeEmails || [],
          meetingStatus: MeetingStatus.SCHEDULED
        }
      });

      // Advance lead stage if NEW or CONTACTED
      if (lead.stage === LeadStage.NEW || lead.stage === LeadStage.CONTACTED) {
        await tx.lead.update({
          where: { id: lead.id },
          data: { stage: LeadStage.MEETING_SCHEDULED }
        });
      }

      await tx.leadActivity.create({
        data: {
          leadId: lead.id,
          actorId: user.id,
          activityType: 'MEETING_SCHEDULED',
          notes: `Meeting "${data.title}" scheduled for ${scheduledDate.toISOString()}`,
          channel: data.mode || 'ONLINE'
        }
      });

      return m;
    });

    return meeting;
  }

  async update(id: string, user: any, data: any) {
    const existing = await this.prisma.meeting.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Meeting not found');

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.purpose) updateData.purpose = data.purpose;
    if (data.meetingLinkOrLocation) updateData.meetingLinkOrLocation = data.meetingLinkOrLocation;

    if (data.scheduledAtUtc && new Date(data.scheduledAtUtc).getTime() !== existing.scheduledAtUtc.getTime()) {
      updateData.scheduledAtUtc = new Date(data.scheduledAtUtc);
      updateData.rescheduleCount = existing.rescheduleCount + 1;
      updateData.meetingStatus = MeetingStatus.RESCHEDULED;
    }

    if (data.meetingStatus) {
      updateData.meetingStatus = data.meetingStatus;
      if (data.cancellationReason) {
        updateData.cancellationReason = data.cancellationReason;
      }
    }

    return this.prisma.meeting.update({
      where: { id },
      data: updateData
    });
  }

  async recordOutcome(meetingId: string, user: any, data: any) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
      include: { lead: true }
    });

    if (!meeting) throw new NotFoundException('Meeting not found');

    return this.prisma.$transaction(async (tx) => {
      const outcome = await tx.meetingOutcome.upsert({
        where: { meetingId },
        update: {
          attendanceConfirmed: data.attendanceConfirmed,
          isQualified: data.isQualified,
          requirementSummary: data.requirementSummary,
          budgetRange: data.budgetRange,
          timeline: data.timeline,
          decisionProcess: data.decisionProcess,
          objections: data.objections,
          agreedNextAction: data.agreedNextAction,
          nextActionAt: data.nextActionAt ? new Date(data.nextActionAt) : null,
          recordedById: user.id,
          recordedAt: new Date()
        },
        create: {
          meetingId,
          attendanceConfirmed: data.attendanceConfirmed,
          isQualified: data.isQualified,
          requirementSummary: data.requirementSummary,
          budgetRange: data.budgetRange,
          timeline: data.timeline,
          decisionProcess: data.decisionProcess,
          objections: data.objections,
          agreedNextAction: data.agreedNextAction,
          nextActionAt: data.nextActionAt ? new Date(data.nextActionAt) : null,
          recordedById: user.id
        }
      });

      // Update meeting status to COMPLETED
      await tx.meeting.update({
        where: { id: meetingId },
        data: { meetingStatus: MeetingStatus.COMPLETED }
      });

      // Update lead stage based on qualification
      const newStage = data.isQualified ? LeadStage.QUALIFIED : LeadStage.UNQUALIFIED;
      await tx.lead.update({
        where: { id: meeting.leadId },
        data: {
          stage: newStage,
          unqualifiedReason: !data.isQualified ? data.requirementSummary : null,
          nextActionAt: data.nextActionAt ? new Date(data.nextActionAt) : null
        }
      });

      await tx.leadActivity.create({
        data: {
          leadId: meeting.leadId,
          actorId: user.id,
          activityType: 'MEETING_OUTCOME_RECORDED',
          notes: `Meeting outcome: ${data.isQualified ? 'QUALIFIED' : 'UNQUALIFIED'}. Next: ${data.agreedNextAction}`,
          channel: 'APP'
        }
      });

      return outcome;
    });
  }
}
