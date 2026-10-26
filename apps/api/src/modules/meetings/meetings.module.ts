import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [MeetingsController],
  providers: [MeetingsService, PrismaService],
  exports: [MeetingsService]
})
export class MeetingsModule {}
