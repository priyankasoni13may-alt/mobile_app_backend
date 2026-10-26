import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaService } from '../../database/prisma.service';
import {
  ConsoleNotificationAdapter,
  FcmPushAdapter,
  SmtpEmailAdapter
} from '../../common/adapters/notification.adapter';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    PrismaService,
    ConsoleNotificationAdapter,
    FcmPushAdapter,
    SmtpEmailAdapter
  ],
  exports: [NotificationsService]
})
export class NotificationsModule {}
