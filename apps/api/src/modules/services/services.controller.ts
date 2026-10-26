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
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRoleType } from '@lumora/shared-types';

@ApiTags('Services Catalogue')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'List published services by business unit' })
  async list(@Query('businessUnitId') businessUnitId?: string) {
    return this.servicesService.list(businessUnitId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service pitch guide, ICP, objection handling & case studies' })
  async getOne(@Param('id') id: string) {
    return this.servicesService.getOne(id);
  }

  @Post('admin')
  @Roles(UserRoleType.SUPER_ADMIN, UserRoleType.OPERATIONS)
  @ApiOperation({ summary: 'Create new service in catalogue (Admin/Ops)' })
  async create(@Body() body: any, @CurrentUser() user: any) {
    return this.servicesService.create(body, user.id);
  }

  @Patch('admin/:id')
  @Roles(UserRoleType.SUPER_ADMIN, UserRoleType.OPERATIONS)
  @ApiOperation({ summary: 'Update service with version snapshot' })
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser() user: any
  ) {
    return this.servicesService.update(id, body, user.id);
  }

  @Post('admin/:id/archive')
  @Roles(UserRoleType.SUPER_ADMIN, UserRoleType.OPERATIONS)
  @ApiOperation({ summary: 'Archive a service' })
  async archive(@Param('id') id: string) {
    return this.servicesService.archive(id);
  }
}
