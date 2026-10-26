import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SupportTicketStatus } from '@lumora/shared-types';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async listUserTickets(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: { select: { id: true, fullName: true } }
      }
    });
  }

  async getTicket(id: string, user: any) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        assignedTo: { select: { id: true, fullName: true } }
      }
    });

    if (!ticket) throw new NotFoundException('Support ticket not found');

    return ticket;
  }

  async createTicket(userId: string, data: any) {
    return this.prisma.supportTicket.create({
      data: {
        userId,
        category: data.category || 'TECHNICAL_ISSUE',
        status: SupportTicketStatus.OPEN,
        subject: data.subject,
        description: data.description,
        attachmentUrls: data.attachmentUrls || []
      }
    });
  }

  // Admin
  async adminListTickets(query?: { status?: string; category?: string }) {
    const where: any = {};
    if (query?.status) where.status = query.status;
    if (query?.category) where.category = query.category;

    return this.prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
        assignedTo: { select: { id: true, fullName: true } }
      }
    });
  }

  async adminUpdateTicket(id: string, data: any) {
    const existing = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Ticket not found');

    const updateData: any = {};
    if (data.status) {
      updateData.status = data.status;
      if (data.status === SupportTicketStatus.RESOLVED || data.status === SupportTicketStatus.CLOSED) {
        updateData.resolvedAt = new Date();
      }
    }
    if (data.assignedToId !== undefined) updateData.assignedToId = data.assignedToId;
    if (data.resolution !== undefined) updateData.resolution = data.resolution;

    return this.prisma.supportTicket.update({
      where: { id },
      data: updateData
    });
  }
}
