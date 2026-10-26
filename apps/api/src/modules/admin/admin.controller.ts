import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRoleType } from '@lumora/shared-types';

@ApiTags('Admin Console Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleType.SUPER_ADMIN, UserRoleType.OPERATIONS, UserRoleType.FINANCE)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('partners')
  @ApiOperation({ summary: 'List all registered partners with onboarding status and stats' })
  async listPartners(
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    return this.adminService.listPartners({ status, search });
  }

  @Get('partners/:id')
  @ApiOperation({ summary: 'Get partner detail, verification documents, and activity history' })
  async getPartner(@Param('id') id: string) {
    return this.adminService.getPartner(id);
  }

  @Post('partners/:id/decision')
  @Roles(UserRoleType.SUPER_ADMIN, UserRoleType.OPERATIONS)
  @ApiOperation({ summary: 'Approve, reject, or suspend partner application (Ops/Admin)' })
  async decidePartner(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { decision: 'APPROVE' | 'REJECT' | 'SUSPEND'; reason?: string }
  ) {
    return this.adminService.decidePartner(id, user.id, body);
  }

  @Get('audit-events')
  @ApiOperation({ summary: 'Search immutable audit events log' })
  async listAuditEvents(
    @Query('actorId') actorId?: string,
    @Query('entityType') entityType?: string,
    @Query('limit') limit?: number
  ) {
    return this.adminService.listAuditEvents({ actorId, entityType, limit });
  }

  @Get('reports/performance')
  @ApiOperation({ summary: 'Get partner performance metrics & KPIs' })
  async getPerformanceReport() {
    return this.adminService.getPerformanceReport();
  }

  @Get('reports/funnel')
  @ApiOperation({ summary: 'Get full conversion funnel metrics' })
  async getFunnelReport() {
    return this.adminService.getFunnelReport();
  }

  @Get('reports/incentive-cost')
  @ApiOperation({ summary: 'Get total incentive and commission liability report' })
  async getIncentiveCostReport() {
    return this.adminService.getIncentiveCostReport();
  }
}
