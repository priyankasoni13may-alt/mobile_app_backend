import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Verification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('verification')
export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get current identity verification status' })
  async getStatus(@CurrentUser() user: any) {
    return this.verificationService.getStatus(user.id);
  }

  @Post('session')
  @ApiOperation({ summary: 'Initiate identity verification session' })
  async createSession(@CurrentUser() user: any) {
    return this.verificationService.createSession(user.id);
  }
}
