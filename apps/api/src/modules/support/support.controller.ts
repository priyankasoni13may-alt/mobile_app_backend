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
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRoleType } from '@lumora/shared-types';

@ApiTags('Support Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Get('tickets')
  @ApiOperation({ summary: 'List tickets created by current user' })
  async listUserTickets(@CurrentUser() user: any) {
    return this.supportService.listUserTickets(user.id);
  }

  @Post('tickets')
  @ApiOperation({ summary: 'Create new support ticket or payout dispute' })
  async createTicket(@CurrentUser() user: any, @Body() body: any) {
    return this.supportService.createTicket(user.id, body);
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get support ticket detail' })
  async getTicket(@Param('id') id: string, @CurrentUser() user: any) {
    return this.supportService.getTicket(id, user);
  }

  // Admin
  @Get('admin/tickets')
  @Roles(UserRoleType.SUPER_ADMIN, UserRoleType.OPERATIONS, UserRoleType.FINANCE)
  @ApiOperation({ summary: 'List all support tickets across partners (Admin)' })
  async adminListTickets(
    @Query('status') status?: string,
    @Query('category') category?: string
  ) {
    return this.supportService.adminListTickets({ status, category });
  }

  @Patch('admin/tickets/:id')
  @Roles(UserRoleType.SUPER_ADMIN, UserRoleType.OPERATIONS, UserRoleType.FINANCE)
  @ApiOperation({ summary: 'Assign, resolve, or update ticket status (Admin)' })
  async adminUpdateTicket(
    @Param('id') id: string,
    @Body() body: any
  ) {
    return this.supportService.adminUpdateTicket(id, body);
  }
}
