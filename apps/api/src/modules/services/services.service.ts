import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async list(businessUnitId?: string) {
    const where: any = { isActive: true };
    if (businessUnitId) {
      where.businessUnitId = businessUnitId;
    }

    const services = await this.prisma.service.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        businessUnit: true
      }
    });

    return services.map((s) => ({
      ...s,
      businessUnitName: s.businessUnit?.name
    }));
  }

  async getOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        businessUnit: true,
        versions: { orderBy: { changedAt: 'desc' }, take: 5 }
      }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return {
      ...service,
      businessUnitName: service.businessUnit?.name
    };
  }

  async create(data: any, createdBy: string) {
    const priceMinorUnits = data.priceMinorUnits ? BigInt(data.priceMinorUnits) : BigInt(0);

    return this.prisma.service.create({
      data: {
        businessUnitId: data.businessUnitId,
        name: data.name,
        description: data.description,
        icp: data.icp,
        deliverablesSummary: data.deliverablesSummary,
        inclusions: data.inclusions || [],
        exclusions: data.exclusions || [],
        pitchGuide: data.pitchGuide,
        objectionHandling: data.objectionHandling || {},
        faqJson: data.faqJson || [],
        approvedCaseStudies: data.approvedCaseStudies || [],
        qualificationQuestions: data.qualificationQuestions || [],
        priceMinorUnits,
        currency: data.currency || 'INR',
        publishedBy: createdBy,
        publishedAt: new Date()
      }
    });
  }

  async update(id: string, data: any, changedBy: string) {
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Service not found');

    // Create version snapshot before updating
    await this.prisma.serviceVersion.create({
      data: {
        serviceId: existing.id,
        versionLabel: `v${existing.contentVersion}`,
        snapshotJson: {
          name: existing.name,
          description: existing.description,
          priceMinorUnits: existing.priceMinorUnits.toString(),
          inclusions: existing.inclusions,
          exclusions: existing.exclusions,
          pitchGuide: existing.pitchGuide
        },
        changedBy,
        reason: data.reasonForChange || 'Content or commercial update'
      }
    });

    const priceMinorUnits = data.priceMinorUnits !== undefined ? BigInt(data.priceMinorUnits) : existing.priceMinorUnits;

    return this.prisma.service.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        description: data.description ?? existing.description,
        icp: data.icp ?? existing.icp,
        deliverablesSummary: data.deliverablesSummary ?? existing.deliverablesSummary,
        inclusions: data.inclusions ?? existing.inclusions,
        exclusions: data.exclusions ?? existing.exclusions,
        pitchGuide: data.pitchGuide ?? existing.pitchGuide,
        objectionHandling: data.objectionHandling ?? existing.objectionHandling,
        faqJson: data.faqJson ?? existing.faqJson,
        approvedCaseStudies: data.approvedCaseStudies ?? existing.approvedCaseStudies,
        qualificationQuestions: data.qualificationQuestions ?? existing.qualificationQuestions,
        priceMinorUnits,
        currency: data.currency ?? existing.currency,
        contentVersion: existing.contentVersion + 1,
        publishedBy: changedBy
      }
    });
  }

  async archive(id: string) {
    return this.prisma.service.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
