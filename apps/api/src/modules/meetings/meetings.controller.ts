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
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Meetings & Calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private meetingsService: MeetingsService) {}

  @Get()
  @ApiOperation({ summary: 'List upcoming or past meetings for current partner/sales manager' })
  async list(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('leadId') leadId?: string,
    @Query('past') past?: string
  ) {
    const isPast = past !== undefined ? past === 'true' : undefined;
    return this.meetingsService.list(user.id, { status, leadId, past: isPast });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meeting detail with outcome and attendees' })
  async getOne(@Param('id') id: string) {
    return this.meetingsService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new client meeting request' })
  async create(@CurrentUser() user: any, @Body() body: any) {
    return this.meetingsService.create(user, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Reschedule or cancel meeting with reason' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: any
  ) {
    return this.meetingsService.update(id, user, body);
  }

  @Post(':id/outcome')
  @ApiOperation({ summary: 'Record meeting outcome and advance lead qualification' })
  async recordOutcome(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: any
  ) {
    return this.meetingsService.recordOutcome(id, user, body);
  }
}
