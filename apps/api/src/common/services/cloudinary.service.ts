import { Injectable, OnModuleInit, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  resourceType: string;
  bytes: number;
}

@Injectable()
export class CloudinaryService implements OnModuleInit {
  private readonly logger = new Logger('CloudinaryService');
  private isConfigured = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
      });
      this.isConfigured = true;
      this.logger.log(`✅ Cloudinary storage initialized for cloud: ${cloudName}`);
    } else {
      this.logger.warn('Cloudinary credentials missing; file storage running in fallback mode');
    }
  }

  async uploadFile(
    fileInput: string,
    folder = 'lumora',
    publicId?: string
  ): Promise<CloudinaryUploadResult> {
    if (!this.isConfigured) {
      throw new BadRequestException('Cloudinary storage is not configured on this server');
    }

    try {
      const options: any = {
        folder,
        resource_type: 'auto'
      };

      if (publicId) {
        options.public_id = publicId;
        options.overwrite = true;
      }

      const result: UploadApiResponse = await cloudinary.uploader.upload(fileInput, options);

      return {
        url: result.url,
        secureUrl: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        resourceType: result.resource_type,
        bytes: result.bytes
      };
    } catch (err: any) {
      this.logger.error(`Failed to upload to Cloudinary: ${err.message}`, err.stack);
      throw new BadRequestException(`Cloud upload failed: ${err.message}`);
    }
  }

  generateSignature(folder = 'lumora/uploads') {
    if (!this.isConfigured) {
      throw new BadRequestException('Cloudinary storage is not configured');
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET')!;
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY')!;
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME')!;

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      apiSecret
    );

    return {
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder
    };
  }

  async deleteFile(publicId: string): Promise<boolean> {
    if (!this.isConfigured) return false;
    try {
      const res = await cloudinary.uploader.destroy(publicId);
      return res.result === 'ok';
    } catch (err: any) {
      this.logger.warn(`Failed to delete Cloudinary asset ${publicId}: ${err.message}`);
      return false;
    }
  }
}
