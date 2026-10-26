import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgreementsService } from './agreements.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Request } from 'express';

@ApiTags('Agreements & Conduct')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agreements')
export class AgreementsController {
  constructor(private agreementsService: AgreementsService) {}

  @Get()
  @ApiOperation({ summary: 'List active agreements and user acceptance status' })
  async list(@CurrentUser() user: any) {
    return this.agreementsService.listActiveAgreements(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full agreement text by ID' })
  async getOne(@Param('id') id: string) {
    return this.agreementsService.getAgreement(id);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Record agreement acceptance with timestamp and IP' })
  async accept(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: Request
  ) {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.agreementsService.acceptAgreement(user.id, id, ipAddress, userAgent);
  }
}
