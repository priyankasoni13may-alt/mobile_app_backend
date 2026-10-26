import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class LearningService {
  constructor(private prisma: PrismaService) {}

  async listModules(userId: string, businessUnitId?: string) {
    const where: any = { isActive: true };
    if (businessUnitId) {
      where.OR = [{ businessUnitId }, { businessUnitId: null }];
    }

    const modules = await this.prisma.learningModule.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        businessUnit: true
      }
    });

    const completions = await this.prisma.learningCompletion.findMany({
      where: { userId }
    });
    const completionMap = new Map(completions.map((c) => [c.moduleId, c]));

    return modules.map((m) => {
      const comp = completionMap.get(m.id);
      return {
        id: m.id,
        businessUnitId: m.businessUnitId,
        businessUnitName: m.businessUnit?.name || 'Shared / General',
        title: m.title,
        description: m.description,
        contentType: m.contentType,
        content: m.content,
        sortOrder: m.sortOrder,
        isMandatory: m.isMandatory,
        contentVersion: m.contentVersion,
        completed: !!comp,
        completedAt: comp?.completedAt || null,
        score: comp?.score || null
      };
    });
  }

  async getModule(id: string, userId: string) {
    const moduleItem = await this.prisma.learningModule.findUnique({
      where: { id },
      include: { businessUnit: true }
    });

    if (!moduleItem) {
      throw new NotFoundException('Learning module not found');
    }

    const completion = await this.prisma.learningCompletion.findUnique({
      where: { userId_moduleId: { userId, moduleId: id } }
    });

    return {
      ...moduleItem,
      businessUnitName: moduleItem.businessUnit?.name || 'Shared',
      completed: !!completion,
      completionDetails: completion
    };
  }

  async completeModule(userId: string, moduleId: string, score?: number) {
    const moduleItem = await this.prisma.learningModule.findUnique({
      where: { id: moduleId }
    });

    if (!moduleItem) {
      throw new NotFoundException('Learning module not found');
    }

    const completion = await this.prisma.learningCompletion.upsert({
      where: { userId_moduleId: { userId, moduleId } },
      update: {
        score: score ?? 100,
        completedAt: new Date(),
        acknowledgedVersion: moduleItem.contentVersion
      },
      create: {
        userId,
        moduleId,
        score: score ?? 100,
        acknowledgedVersion: moduleItem.contentVersion
      }
    });

    return { success: true, completion };
  }

  async getProgress(userId: string) {
    const allMandatory = await this.prisma.learningModule.count({
      where: { isActive: true, isMandatory: true }
    });

    const completed = await this.prisma.learningCompletion.count({
      where: {
        userId,
        module: { isMandatory: true, isActive: true }
      }
    });

    return {
      mandatoryModules: allMandatory,
      completedModules: completed,
      progressPercentage: allMandatory > 0 ? Math.round((completed / allMandatory) * 100) : 100,
      isFullyCompleted: completed >= allMandatory && allMandatory > 0
    };
  }

  // Admin CRUD
  async createModule(data: any, createdBy: string) {
    return this.prisma.learningModule.create({
      data: {
        title: data.title,
        description: data.description,
        contentType: data.contentType || 'ARTICLE',
        content: data.content,
        businessUnitId: data.businessUnitId || null,
        sortOrder: data.sortOrder || 0,
        isMandatory: data.isMandatory ?? true,
        createdBy
      }
    });
  }

  async updateModule(id: string, data: any) {
    const existing = await this.prisma.learningModule.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Module not found');

    return this.prisma.learningModule.update({
      where: { id },
      data: {
        ...data,
        contentVersion: existing.contentVersion + 1
      }
    });
  }
}
