import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger('MailService');
  private transporter: Transporter | null = null;
  private isConfigured = false;
  private resendApiKey: string | null = null;
  private fromAddress = 'Lumora Network <onboarding@resend.dev>';

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.resendApiKey = this.configService.get<string>('RESEND_API_KEY') || process.env.RESEND_API_KEY || null;

    const host = this.configService.get<string>('SMTP_HOST') || process.env.SMTP_HOST;
    const port = Number(this.configService.get<number>('SMTP_PORT') || process.env.SMTP_PORT) || 587;
    const user = this.configService.get<string>('SMTP_USER') || process.env.SMTP_USER;
    const pass = this.configService.get<string>('SMTP_PASS') || process.env.SMTP_PASS;
    const secure = (this.configService.get<string>('SMTP_SECURE') || process.env.SMTP_SECURE) === 'true' || port === 465;
    const from = this.configService.get<string>('SMTP_FROM') || process.env.SMTP_FROM;

    if (from) {
      this.fromAddress = from;
    } else if (user) {
      this.fromAddress = `"Lumora & Cypher Swift" <${user}>`;
    }

    if (this.resendApiKey) {
      this.isConfigured = true;
      this.logger.log(`✅ MailService initialized with Resend HTTPS API (Port 443)`);
    } else if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
          connectionTimeout: 4000,
          greetingTimeout: 4000,
          socketTimeout: 4000
        });
        this.isConfigured = true;
        this.logger.log(`✅ MailService initialized with SMTP host: ${host}:${port} (${user})`);
      } catch (err: any) {
        this.logger.warn(`Failed to initialize SMTP transporter: ${err.message}`);
      }
    } else {
      this.logger.log('📧 SMTP credentials not fully provided; emails will be logged to console in dev mode.');
    }
  }

  async sendVerificationOtp(to: string, fullName: string, otp: string): Promise<boolean> {
    const subject = `Your Lumora Verification Code: ${otp}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0B111E; color: #FFFFFF; border-radius: 12px; border: 1px solid #1E293B;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #5B8EE2; font-size: 24px; margin: 0; letter-spacing: 0.5px;">Lumora & Cypher Swift</h1>
          <p style="color: #94A3B8; font-size: 13px; margin: 4px 0 0 0;">Partner Network & Business Development</p>
        </div>
        <div style="background: #151D2E; border-radius: 8px; padding: 24px; border: 1px solid #1E293B; text-align: center;">
          <p style="color: #E2E8F0; font-size: 16px; margin-top: 0;">Hello <strong>${fullName || 'Partner'}</strong>,</p>
          <p style="color: #94A3B8; font-size: 14px; line-height: 1.5;">Use the following 6-digit code to verify your email address and activate your partner portal account:</p>
          
          <div style="margin: 28px 0; padding: 18px; background: #0B111E; border: 2px dashed #3B82F6; border-radius: 10px; display: inline-block;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #60A5FA;">${otp}</span>
          </div>

          <p style="color: #64748B; font-size: 12px; margin: 12px 0 0 0;">This code is valid for 5 minutes. If you did not request this code, you can safely ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 24px; color: #475569; font-size: 11px;">
          &copy; ${new Date().getFullYear()} Lumora Solutions Pvt Ltd & Cypher Swift Technologies. All rights reserved.
        </div>
      </div>
    `;

    return this.sendMail(to, subject, html, `Your Lumora verification code is: ${otp}`);
  }

  async sendMail(to: string, subject: string, html: string, textFallback?: string): Promise<boolean> {
    // 1. Try Resend HTTPS API if configured (port 443 - never blocked by cloud firewalls)
    if (this.resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: this.fromAddress,
            to: [to],
            subject,
            html,
            text: textFallback || subject
          }),
          signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
          const data: any = await response.json();
          this.logger.log(`✅ Email delivered via Resend API to ${to}: ${data?.id || 'OK'}`);
          return true;
        } else {
          const errText = await response.text();
          this.logger.warn(`Resend API returned error: ${response.status} ${errText}`);
        }
      } catch (err: any) {
        this.logger.warn(`Resend HTTPS dispatch failed: ${err.message}`);
      }
    }

    // 2. Try SMTP transporter if configured (with 4s timeout)
    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: this.fromAddress,
          to,
          subject,
          text: textFallback || subject,
          html
        });
        this.logger.log(`✅ Email delivered to ${to}: ${info.messageId}`);
        return true;
      } catch (err: any) {
        this.logger.error(`❌ SMTP delivery failed to ${to}: ${err.message}`);
      }
    }

    // 3. Fallback: Log to server console
    this.logger.log(`\n📨 [MOCK / BACKUP EMAIL DISPATCH]\nTo: ${to}\nSubject: ${subject}\nText: ${textFallback || 'HTML email content'}\n`);
    return true;
  }
}
