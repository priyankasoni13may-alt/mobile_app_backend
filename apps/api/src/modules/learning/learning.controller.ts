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
import { LearningService } from './learning.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRoleType } from '@lumora/shared-types';

@ApiTags('Learning & Training Hub')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('learning')
export class LearningController {
  constructor(private learningService: LearningService) {}

  @Get('modules')
  @ApiOperation({ summary: 'List training modules by business unit with completion badges' })
  async listModules(
    @CurrentUser() user: any,
    @Query('businessUnitId') businessUnitId?: string
  ) {
    return this.learningService.listModules(user.id, businessUnitId);
  }

  @Get('modules/:id')
  @ApiOperation({ summary: 'Get module content, pitch guide, video or quiz details' })
  async getModule(@Param('id') id: string, @CurrentUser() user: any) {
    return this.learningService.getModule(id, user.id);
  }

  @Post('modules/:id/complete')
  @ApiOperation({ summary: 'Mark training module as completed or submit quiz score' })
  async completeModule(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('score') score?: number
  ) {
    return this.learningService.completeModule(user.id, id, score);
  }

  @Get('progress')
  @ApiOperation({ summary: 'Get current partner training hub progress metrics' })
  async getProgress(@CurrentUser() user: any) {
    return this.learningService.getProgress(user.id);
  }

  // Admin endpoints
  @Post('admin/modules')
  @Roles(UserRoleType.SUPER_ADMIN, UserRoleType.OPERATIONS)
  @ApiOperation({ summary: 'Create new learning module (Admin/Ops)' })
  async createModule(@Body() body: any, @CurrentUser() user: any) {
    return this.learningService.createModule(body, user.id);
  }

  @Patch('admin/modules/:id')
  @Roles(UserRoleType.SUPER_ADMIN, UserRoleType.OPERATIONS)
  @ApiOperation({ summary: 'Update module content with version increment' })
  async updateModule(@Param('id') id: string, @Body() body: any) {
    return this.learningService.updateModule(id, body);
  }
}
