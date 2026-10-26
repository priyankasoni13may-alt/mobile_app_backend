import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('RedisService');
  private client: Redis | null = null;
  private isConnected = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const port = Number(this.configService.get<number>('REDIS_PORT')) || 6379;
    const password = this.configService.get<string>('REDIS_PASSWORD');
    const useTls = this.configService.get<string>('REDIS_TLS') === 'true' || host.includes('upstash.io');

    try {
      if (redisUrl) {
        this.client = new Redis(redisUrl, {
          tls: useTls ? {} : undefined,
          maxRetriesPerRequest: 3,
          retryStrategy(times) {
            return Math.min(times * 100, 3000);
          }
        });
      } else {
        this.client = new Redis({
          host,
          port,
          password: password || undefined,
          tls: useTls ? {} : undefined,
          maxRetriesPerRequest: 3,
          retryStrategy(times) {
            return Math.min(times * 100, 3000);
          }
        });
      }

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log(`✅ Connected to Redis at ${host}:${port} (TLS: ${useTls})`);
      });

      this.client.on('error', (err) => {
        this.logger.warn(`Redis connection error: ${err.message}`);
      });

      // Quick test ping
      await this.client.ping();
      this.logger.log('✅ Redis ping verified');
    } catch (err: any) {
      this.logger.warn(`Redis connection deferred: ${err.message}`);
    }
  }

  getClient(): Redis | null {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) return null;
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.client) return;
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) return;
    await this.client.del(key);
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }
}
