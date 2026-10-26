import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AgreementsService {
  constructor(private prisma: PrismaService) {}

  async listActiveAgreements(userId?: string) {
    const agreements = await this.prisma.agreement.findMany({
      where: { isActive: true },
      orderBy: { effectiveDate: 'desc' }
    });

    if (!userId) return agreements;

    const acceptances = await this.prisma.agreementAcceptance.findMany({
      where: { userId }
    });
    const acceptedIds = new Set(acceptances.map((a) => a.agreementId));

    return agreements.map((agr) => ({
      ...agr,
      accepted: acceptedIds.has(agr.id)
    }));
  }

  async getAgreement(id: string) {
    const agreement = await this.prisma.agreement.findUnique({
      where: { id }
    });
    if (!agreement) {
      throw new NotFoundException('Agreement not found');
    }
    return agreement;
  }

  async acceptAgreement(userId: string, agreementId: string, ipAddress?: string, userAgent?: string) {
    const agreement = await this.prisma.agreement.findUnique({
      where: { id: agreementId }
    });

    if (!agreement) {
      throw new NotFoundException('Agreement not found');
    }

    const existing = await this.prisma.agreementAcceptance.findUnique({
      where: {
        userId_agreementId: {
          userId,
          agreementId
        }
      }
    });

    if (existing) {
      return { accepted: true, alreadyAccepted: true, acceptedAt: existing.acceptedAt };
    }

    const acceptance = await this.prisma.agreementAcceptance.create({
      data: {
        userId,
        agreementId,
        ipAddress,
        userAgent
      }
    });

    return {
      accepted: true,
      acceptedAt: acceptance.acceptedAt,
      agreementVersion: agreement.version
    };
  }
}
