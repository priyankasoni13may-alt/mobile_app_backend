import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TaskStatus, UserRoleType } from '@lumora/shared-types';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string, query: { status?: string; leadId?: string; filter?: 'today' | 'overdue' | 'upcoming' }) {
    const where: any = { userId };

    if (query.status) {
      where.status = query.status;
    }
    if (query.leadId) {
      where.leadId = query.leadId;
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (query.filter === 'overdue') {
      where.dueAt = { lt: now };
      where.status = { notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] };
    } else if (query.filter === 'today') {
      where.dueAt = { gte: startOfToday, lte: endOfToday };
    } else if (query.filter === 'upcoming') {
      where.dueAt = { gt: endOfToday };
      where.status = { notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] };
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: { dueAt: 'asc' },
      include: {
        lead: { select: { id: true, companyName: true, contactName: true } }
      }
    });

    return tasks.map((t) => ({
      ...t,
      leadCompanyName: t.lead?.companyName,
      leadContactName: t.lead?.contactName
    }));
  }

  async create(userId: string, data: any) {
    return this.prisma.task.create({
      data: {
        userId,
        leadId: data.leadId || null,
        title: data.title,
        description: data.description,
        taskType: data.taskType || 'FOLLOW_UP',
        priority: data.priority || 'MEDIUM',
        dueAt: new Date(data.dueAt)
      }
    });
  }

  async update(id: string, userId: string, data: any) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Task not found');
    if (existing.userId !== userId) throw new ForbiddenException('Not your task');

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priority) updateData.priority = data.priority;
    if (data.dueAt) updateData.dueAt = new Date(data.dueAt);
    if (data.snoozedUntil) updateData.snoozedUntil = new Date(data.snoozedUntil);
    if (data.status) {
      updateData.status = data.status;
      if (data.status === TaskStatus.COMPLETED) {
        updateData.completedAt = new Date();
        updateData.completedBy = userId;
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: updateData
    });
  }

  async cancel(id: string, userId: string) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Task not found');
    if (existing.userId !== userId) throw new ForbiddenException('Not your task');

    return this.prisma.task.update({
      where: { id },
      data: { status: TaskStatus.CANCELLED }
    });
  }
}
