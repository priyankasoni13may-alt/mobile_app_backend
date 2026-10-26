import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('System Health')
@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Liveness health check endpoint' })
  getHealth() {
    return this.healthService.getHealth();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness health check verifying DB and cache connectivity' })
  async getHealthReady() {
    return this.healthService.getHealthReady();
  }
}
