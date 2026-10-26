import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { CloudinaryService } from '../../common/services/cloudinary.service';

@Module({
  controllers: [StorageController],
  providers: [CloudinaryService],
  exports: [CloudinaryService]
})
export class StorageModule {}
