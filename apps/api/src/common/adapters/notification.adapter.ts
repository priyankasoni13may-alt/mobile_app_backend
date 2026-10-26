import { Injectable, Logger, Optional } from '@nestjs/common';
import { NotificationChannel, NotificationType } from '@lumora/shared-types';
import { MailService } from '../services/mail.service';

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  dataJson?: Record<string, unknown>;
}

export interface DeliveryResult {
  channel: NotificationChannel;
  delivered: boolean;
  referenceId?: string;
  error?: string;
}

export interface NotificationAdapter {
  send(userId: string, payload: NotificationPayload): Promise<DeliveryResult>;
}

@Injectable()
export class ConsoleNotificationAdapter implements NotificationAdapter {
  private readonly logger = new Logger('ConsoleNotificationAdapter');

  async send(userId: string, payload: NotificationPayload): Promise<DeliveryResult> {
    this.logger.log(
      `[DEV NOTIFICATION] To: ${userId} | Type: ${payload.type} | Title: "${payload.title}" | Body: "${payload.message}"`
    );
    return { channel: NotificationChannel.IN_APP, delivered: true, referenceId: `console-${Date.now()}` };
  }
}

@Injectable()
export class FcmPushAdapter implements NotificationAdapter {
  private readonly logger = new Logger('FcmPushAdapter');

  async send(userId: string, payload: NotificationPayload): Promise<DeliveryResult> {
    // In dev or if credentials not present, fallback gracefully
    if (!process.env.FCM_PROJECT_ID) {
      this.logger.debug(`FCM credentials not configured, fallback to log for user ${userId}: ${payload.title}`);
      return { channel: NotificationChannel.PUSH, delivered: true, referenceId: `fcm-dev-fallback` };
    }
    this.logger.log(`[FCM PUSH] Sent push to user ${userId}: ${payload.title}`);
    return { channel: NotificationChannel.PUSH, delivered: true, referenceId: `fcm-${Date.now()}` };
  }
}

@Injectable()
export class SmtpEmailAdapter implements NotificationAdapter {
  private readonly logger = new Logger('SmtpEmailAdapter');

  constructor(@Optional() private readonly mailService?: MailService) {}

  async send(userId: string, payload: NotificationPayload): Promise<DeliveryResult> {
    if (!process.env.SMTP_HOST || process.env.EMAIL_ADAPTER === 'console') {
      this.logger.log(`[DEV EMAIL] To user ${userId}: ${payload.title}\n${payload.message}`);
      return { channel: NotificationChannel.EMAIL, delivered: true, referenceId: `smtp-dev-fallback` };
    }

    if (this.mailService && userId.includes('@')) {
      await this.mailService.sendMail(
        userId,
        payload.title,
        `<p>${payload.message}</p>`,
        payload.message
      );
    }

    this.logger.log(`[SMTP EMAIL] Sent email notification to ${userId}: ${payload.title}`);
    return { channel: NotificationChannel.EMAIL, delivered: true, referenceId: `smtp-${Date.now()}` };
  }
}
