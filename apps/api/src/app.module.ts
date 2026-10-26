import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './database/prisma.service';
import { RedisService } from './common/services/redis.service';

import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { VerificationModule } from './modules/verification/verification.module';
import { AgreementsModule } from './modules/agreements/agreements.module';
import { LearningModule } from './modules/learning/learning.module';
import { ServicesModule } from './modules/services/services.module';
import { LeadsModule } from './modules/leads/leads.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { DealsModule } from './modules/deals/deals.module';
import { CommissionsModule } from './modules/commissions/commissions.module';
import { FinanceModule } from './modules/finance/finance.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SupportModule } from './modules/support/support.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './modules/health/health.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '../../.env']
    }),
    AuthModule,
    ProfilesModule,
    VerificationModule,
    AgreementsModule,
    LearningModule,
    ServicesModule,
    LeadsModule,
    TasksModule,
    MeetingsModule,
    DealsModule,
    CommissionsModule,
    FinanceModule,
    NotificationsModule,
    SupportModule,
    AdminModule,
    HealthModule,
    StorageModule
  ],
  providers: [PrismaService, RedisService],
  exports: [PrismaService, RedisService]
})
export class AppModule {}
