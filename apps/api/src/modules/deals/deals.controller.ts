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
import { DealsService } from './deals.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRoleType } from '@lumora/shared-types';

@ApiTags('Deals & Payments Pipeline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('deals')
export class DealsController {
  constructor(private dealsService: DealsService) {}

  @Get()
  @ApiOperation({ summary: 'List deals with stage filters and role scoping' })
  async list(
    @CurrentUser() user: any,
    @Query('leadId') leadId?: string,
    @Query('dealType') dealType?: string,
    @Query('stage') stage?: string
  ) {
    return this.dealsService.list(user, { leadId, dealType, stage });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full deal details with payment evidences and delivery handoff' })
  async getOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.dealsService.getOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create new Diagnostic or Service proposal deal' })
  async create(@CurrentUser() user: any, @Body() body: any) {
    return this.dealsService.create(user, body);
  }

  @Post(':id/payment-evidence')
  @ApiOperation({ summary: 'Submit client payment evidence, UTR / receipt for verification' })
  async submitPaymentEvidence(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: any
  ) {
    return this.dealsService.submitPaymentEvidence(id, user, body);
  }

  @Patch(':id/verify-payment')
  @Roles(UserRoleType.FINANCE, UserRoleType.SALES, UserRoleType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Verify or reject payment evidence and advance deal to Won (Finance/Sales)' })
  async verifyPayment(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { approved: boolean; rejectionReason?: string }
  ) {
    return this.dealsService.verifyPayment(id, user, body);
  }

  @Post(':id/submit-closure')
  @ApiOperation({ summary: 'Submit deal for closure review' })
  async submitClosure(@Param('id') id: string, @CurrentUser() user: any) {
    return this.dealsService.submitClosure(id, user);
  }

  @Post(':id/handoff')
  @ApiOperation({ summary: 'Create or update post-sales delivery handoff record' })
  async createDeliveryHandoff(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: any
  ) {
    return this.dealsService.createDeliveryHandoff(id, user, body);
  }
}
