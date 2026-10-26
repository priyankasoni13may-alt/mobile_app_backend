import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Tasks & Follow-ups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List tasks (today, overdue, upcoming, status, leadId)' })
  async list(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('leadId') leadId?: string,
    @Query('filter') filter?: 'today' | 'overdue' | 'upcoming'
  ) {
    return this.tasksService.list(user.id, { status, leadId, filter });
  }

  @Post()
  @ApiOperation({ summary: 'Create new task or follow-up reminder' })
  async create(@CurrentUser() user: any, @Body() body: any) {
    return this.tasksService.create(user.id, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update, snooze or mark task completed' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: any
  ) {
    return this.tasksService.update(id, user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel/delete a task' })
  async cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.cancel(id, user.id);
  }
}
