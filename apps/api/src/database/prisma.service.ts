import { Injectable, OnModuleInit, OnModuleDestroy, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

  constructor() {
    super({
      log: ['warn', 'error']
    });

    // Enforce append-only integrity on financial ledger and audit records
    this.$use(async (params, next) => {
      const appendOnlyModels = ['CommissionLedger', 'CommissionAdjustment', 'AuditEvent'];

      if (params.model && appendOnlyModels.includes(params.model)) {
        if (
          params.action === 'update' ||
          params.action === 'updateMany' ||
          params.action === 'delete' ||
          params.action === 'deleteMany' ||
          params.action === 'upsert'
        ) {
          throw new ForbiddenException(
            `Financial & Audit Integrity Rule Violation: ${params.model} is strictly APPEND-ONLY. Updates and deletions are forbidden.`
          );
        }
      }

      return next(params);
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log(' Connected to PostgreSQL database via Prisma');
    } catch (err: any) {
      this.logger.warn(` Prisma database connection deferred or offline: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
