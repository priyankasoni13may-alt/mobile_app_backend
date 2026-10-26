import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Profiles & Onboarding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'Get current logged-in user profile & identity' })
  async getMe(@CurrentUser() user: any) {
    return this.profilesService.getMe(user.id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update partner profile fields' })
  async updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.profilesService.updateProfile(user.id, body);
  }

  @Get('onboarding-status')
  @ApiOperation({ summary: 'Returns partner onboarding gates & completion checklist' })
  async getOnboardingStatus(@CurrentUser() user: any) {
    return this.profilesService.getOnboardingStatus(user.id);
  }

  @Post('photo')
  @ApiOperation({ summary: 'Upload or update profile photo URL' })
  async uploadPhoto(@CurrentUser() user: any, @Body('photoUrl') photoUrl: string) {
    return this.profilesService.uploadPhoto(user.id, photoUrl);
  }
}
