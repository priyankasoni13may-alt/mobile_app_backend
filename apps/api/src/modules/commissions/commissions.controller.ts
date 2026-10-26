import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Headers,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommissionsService } from './commissions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRoleType } from '@lumora/shared-types';

@ApiTags('Incentive & Commission Ledger')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class CommissionsController {
  constructor(private commissionsService: CommissionsService) {}

  @Get('earnings/summary')
  @ApiOperation({ summary: 'Get current partner earnings overview (pending/approved/paid/bonus)' })
  async getSummary(@CurrentUser() user: any) {
    return this.commissionsService.getEarningsSummary(user.id);
  }

  @Get('earnings/ledger')
  @ApiOperation({ summary: 'Get partner immutable commission ledger and transaction history' })
  async getLedger(@CurrentUser() user: any) {
    return this.commissionsService.getEarningsLedger(user.id);
  }

  @Post('earnings/:id/dispute')
  @ApiOperation({ summary: 'Raise a dispute on an individual commission ledger entry' })
  async raiseDispute(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('reason') reason: string
  ) {
    return this.commissionsService.raiseDispute(id, user.id, reason);
  }

  // --- Admin/Finance Endpoints ---

  @Get('admin/commissions')
  @Roles(UserRoleType.FINANCE, UserRoleType.SUPER_ADMIN, UserRoleType.OPERATIONS)
  @ApiOperation({ summary: 'List all pending and approved commissions (Finance/Admin)' })
  async listAll(
    @Query('status') status?: string,
    @Query('partnerId') partnerId?: string
  ) {
    return this.commissionsService.listAllCommissions({ status, partnerId });
  }

  @Post('admin/commissions/:id/review')
  @Roles(UserRoleType.FINANCE, UserRoleType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Approve or reject a commission incentive (Finance only)' })
  async reviewCommission(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { approved: boolean; reason?: string },
    @Headers('x-idempotency-key') idempotencyKey?: string
  ) {
    return this.commissionsService.reviewCommission(id, user, body, idempotencyKey);
  }

  @Post('admin/commissions/adjustments')
  @Roles(UserRoleType.FINANCE, UserRoleType.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create append-only adjustment, correction or reversal entry' })
  async createAdjustment(@CurrentUser() user: any, @Body() body: any) {
    return this.commissionsService.createAdjustment({
      originalLedgerEntryId: body.originalLedgerEntryId,
      adjustmentType: body.adjustmentType,
      amountMinorUnits: body.amountMinorUnits,
      reason: body.reason,
      actorId: user.id
    });
  }
}
