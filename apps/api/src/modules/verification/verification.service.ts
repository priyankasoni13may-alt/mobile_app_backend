import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  async getStatus(userId: string) {
    const record = await this.prisma.verificationRecord.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    if (!record) {
      return {
        status: 'NOT_STARTED',
        provider: 'INTERNAL_DOC',
        notes: 'Identity verification has not yet been initiated.'
      };
    }

    return {
      id: record.id,
      status: record.status,
      provider: record.provider,
      notes: record.notes,
      reviewedAt: record.reviewedAt
    };
  }

  async createSession(userId: string, provider = 'INTERNAL_DOC') {
    let record = await this.prisma.verificationRecord.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    if (!record || record.status === 'NOT_STARTED' || record.status === 'FAILED') {
      record = await this.prisma.verificationRecord.create({
        data: {
          userId,
          provider,
          status: 'IN_PROGRESS',
          providerReference: `VERIF-SESS-${Date.now()}`
        }
      });
    }

    return {
      sessionId: record.id,
      status: record.status,
      providerReference: record.providerReference,
      message: 'Verification session initialized'
    };
  }
}
