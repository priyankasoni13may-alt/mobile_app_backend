import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaService } from '../../database/prisma.service';
import {
  ConsoleNotificationAdapter,
  FcmPushAdapter,
  SmtpEmailAdapter
} from '../../common/adapters/notification.adapter';
import { MailService } from '../../common/services/mail.service';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    PrismaService,
    ConsoleNotificationAdapter,
    FcmPushAdapter,
    SmtpEmailAdapter,
    MailService
  ],
  exports: [NotificationsService]
})
export class NotificationsModule {}
