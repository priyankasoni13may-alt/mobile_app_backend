import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  ConsoleNotificationAdapter,
  FcmPushAdapter,
  SmtpEmailAdapter,
  NotificationPayload
} from '../../common/adapters/notification.adapter';
import { NotificationChannel } from '@lumora/shared-types';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private consoleAdapter: ConsoleNotificationAdapter,
    private fcmAdapter: FcmPushAdapter,
    private smtpAdapter: SmtpEmailAdapter
  ) {}

  async list(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: 50
    });
  }

  async markAsRead(id: string, userId: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id } });
    if (!notif || notif.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() }
    });
  }

  async getPreferences(userId: string) {
    let pref = await this.prisma.notificationPreference.findUnique({ where: { userId } });
    if (!pref) {
      pref = await this.prisma.notificationPreference.create({
        data: { userId }
      });
    }
    return pref;
  }

  async updatePreferences(userId: string, data: any) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    });
  }

  async dispatch(userId: string, payload: NotificationPayload) {
    const pref = await this.getPreferences(userId);

    // Always create in-app notification if enabled
    if (pref.inAppEnabled) {
      await this.prisma.notification.create({
        data: {
          userId,
          type: payload.type,
          title: payload.title,
          message: payload.message,
          dataJson: (payload.dataJson as any) || null,
          channel: NotificationChannel.IN_APP
        }
      });
    }

    // Push notification
    if (pref.pushEnabled) {
      await this.fcmAdapter.send(userId, payload);
    }

    // Email notification
    if (pref.emailEnabled) {
      await this.smtpAdapter.send(userId, payload);
    }

    return { sent: true };
  }
}
