import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CloudinaryService } from '../../common/services/cloudinary.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload an image or document to Cloudinary' })
  async upload(
    @Body('file') file: string,
    @Body('folder') folder?: string,
    @Body('publicId') publicId?: string
  ) {
    return this.cloudinaryService.uploadFile(file, folder || 'lumora/general', publicId);
  }

  @Get('signature')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get signed upload parameters for direct client upload' })
  async getSignature(@Query('folder') folder?: string) {
    return this.cloudinaryService.generateSignature(folder || 'lumora/client_uploads');
  }
}
