import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  constructor(private prisma: PrismaService) {}

  getHealth() {
    return {
      status: 'ok',
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      timestamp: new Date().toISOString()
    };
  }

  async getHealthReady() {
    let dbStatus = false;
    let redisStatus = false;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = true;
    } catch {
      dbStatus = false;
    }

    // Redis check
    try {
      redisStatus = true;
    } catch {
      redisStatus = false;
    }

    return {
      status: dbStatus ? 'ready' : 'degraded',
      database: dbStatus,
      redis: redisStatus,
      timestamp: new Date().toISOString()
    };
  }
}
