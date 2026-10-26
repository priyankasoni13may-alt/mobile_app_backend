import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRoleType } from '@lumora/shared-types';

@ApiTags('Finance & Payouts Console')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleType.FINANCE, UserRoleType.SUPER_ADMIN)
@Controller('admin')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Get('payouts/batches')
  @ApiOperation({ summary: 'List all payout batches' })
  async listBatches() {
    return this.financeService.listBatches();
  }

  @Post('payouts/batches')
  @ApiOperation({ summary: 'Create new payout batch from approved commissions' })
  async createBatch(@CurrentUser() user: any, @Body() body: any) {
    return this.financeService.createBatch(user, body);
  }

  @Patch('payouts/batches/:id/approve')
  @ApiOperation({ summary: 'Approve draft payout batch for processing' })
  async approveBatch(@Param('id') id: string, @CurrentUser() user: any) {
    return this.financeService.approveBatch(id, user);
  }

  @Post('payouts/batches/:id/record-payments')
  @ApiOperation({ summary: 'Record master bank payment reference and complete batch' })
  async recordPayments(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { paymentReference: string }
  ) {
    return this.financeService.recordPayments(id, user, body);
  }

  @Get('payouts/export')
  @ApiOperation({ summary: 'Export financial payouts CSV with immutable audit logging' })
  async exportCsv(@CurrentUser() user: any) {
    return this.financeService.exportPayoutsCsv(user);
  }

  @Get('bonus/evaluations')
  @ApiOperation({ summary: 'List annual bonus evaluations' })
  async listBonusEvaluations() {
    return this.financeService.listBonusEvaluations();
  }

  @Post('bonus/evaluate/:partnerId/:year')
  @ApiOperation({ summary: 'Trigger annual bonus evaluation for partner' })
  async evaluateBonus(
    @Param('partnerId') partnerId: string,
    @Param('year') year: string,
    @CurrentUser() user: any
  ) {
    return this.financeService.evaluateBonus(partnerId, Number(year), user.id);
  }
}
