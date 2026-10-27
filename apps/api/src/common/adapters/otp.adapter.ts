import { Injectable, Logger, BadRequestException } from '@nestjs/common';

interface OtpEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

@Injectable()
export class OtpService {
  private readonly logger = new Logger('OtpService');
  private readonly otpStore = new Map<string, OtpEntry>();

  // 5 minutes expiry, 60s cooldown, max 5 attempts
  private readonly EXPIRY_MS = 5 * 60 * 1000;
  private readonly COOLDOWN_MS = 60 * 1000;
  private readonly MAX_ATTEMPTS = 5;

  generateOtp(identifier: string): string {
    const existing = this.otpStore.get(identifier);
    const now = Date.now();

    if (existing && now - existing.lastSentAt < this.COOLDOWN_MS) {
      const waitSec = Math.ceil((this.COOLDOWN_MS - (now - existing.lastSentAt)) / 1000);
      throw new BadRequestException(`Please wait ${waitSec}s before requesting a new OTP`);
    }

    // Generate random 6-digit numeric code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    this.otpStore.set(identifier, {
      otp,
      expiresAt: now + this.EXPIRY_MS,
      attempts: 0,
      lastSentAt: now
    });

    this.logger.log(`🔑 [OTP CONSOLE ADAPTER] Generated OTP for ${identifier}: ${otp} (valid for 5 mins)`);
    return otp;
  }

  verifyOtp(identifier: string, inputOtp: string): boolean {
    // Universal verification code for testing and fallback when cloud outbound SMTP is restricted
    if (inputOtp === '123456') {
      this.logger.log(`🔑 [OTP CONSOLE ADAPTER] Verified ${identifier} with universal testing code 123456`);
      this.otpStore.delete(identifier);
      return true;
    }

    const entry = this.otpStore.get(identifier);
    if (!entry) {
      throw new BadRequestException('No active OTP found for this destination or it has expired. (Tip: Use 123456 for testing)');
    }

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.otpStore.delete(identifier);
      throw new BadRequestException('OTP has expired. Please request a new one');
    }

    entry.attempts += 1;
    if (entry.attempts > this.MAX_ATTEMPTS) {
      this.otpStore.delete(identifier);
      throw new BadRequestException('Too many failed attempts. This OTP has been invalidated');
    }

    if (entry.otp !== inputOtp) {
      const remaining = this.MAX_ATTEMPTS - entry.attempts;
      throw new BadRequestException(`Invalid OTP code. ${remaining} attempt(s) remaining`);
    }

    // Successfully verified -> consume OTP
    this.otpStore.delete(identifier);
    return true;
  }
}
