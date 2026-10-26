import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRoleType } from '@lumora/shared-types';

@ApiTags('Leads & Ownership')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'List leads with pagination, filtering, and role-based record scoping' })
  async list(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('stage') stage?: string,
    @Query('businessUnitId') businessUnitId?: string,
    @Query('partnerId') partnerId?: string,
    @Query('search') search?: string
  ) {
    return this.leadsService.list(user, { page, limit, stage, businessUnitId, partnerId, search });
  }

  @Get('check-duplicate')
  @ApiOperation({ summary: 'Check domain/email/phone for existing duplicate leads before creating' })
  async checkDuplicate(
    @Query('companyWebsite') companyWebsite?: string,
    @Query('contactEmail') contactEmail?: string,
    @Query('contactPhone') contactPhone?: string,
    @Query('companyName') companyName?: string
  ) {
    return this.leadsService.checkDuplicate({ companyWebsite, contactEmail, contactPhone, companyName });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full lead details with activity timeline, meetings & deals' })
  async getOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leadsService.getOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new qualified prospect lead' })
  async create(@CurrentUser() user: any, @Body() body: any) {
    return this.leadsService.create(user, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lead details or transition stage' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: any
  ) {
    return this.leadsService.update(id, user, body);
  }

  @Post(':id/activities')
  @ApiOperation({ summary: 'Log an outreach call, meeting note, or email to the lead timeline' })
  async addActivity(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: any
  ) {
    return this.leadsService.addActivity(id, user.id, body);
  }

  @Post('claim-conflict')
  @ApiOperation({ summary: 'Raise an ownership conflict or dispute on an existing lead' })
  async claimConflict(@CurrentUser() user: any, @Body() body: any) {
    return this.leadsService.claimConflict(user.id, body);
  }

  @Post('conflicts/:id/resolve')
  @Roles(UserRoleType.SUPER_ADMIN, UserRoleType.OPERATIONS)
  @ApiOperation({ summary: 'Resolve a lead ownership conflict (Admin/Ops)' })
  async resolveConflict(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: any
  ) {
    return this.leadsService.resolveConflict(id, user.id, body);
  }

  @Post(':id/reassign')
  @Roles(UserRoleType.SUPER_ADMIN, UserRoleType.SALES, UserRoleType.OPERATIONS)
  @ApiOperation({ summary: 'Reassign lead owner (Sales/Admin only)' })
  async reassign(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { newOwnerId: string; reason: string }
  ) {
    return this.leadsService.reassign(id, body.newOwnerId, body.reason, user.id);
  }
}
