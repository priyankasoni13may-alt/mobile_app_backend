import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notifications Centre')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List user notifications' })
  async list(@CurrentUser() user: any) {
    return this.notificationsService.list(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get notification delivery channel preferences' })
  async getPreferences(@CurrentUser() user: any) {
    return this.notificationsService.getPreferences(user.id);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update notification channel preferences' })
  async updatePreferences(@CurrentUser() user: any, @Body() body: any) {
    return this.notificationsService.updatePreferences(user.id, body);
  }
}
