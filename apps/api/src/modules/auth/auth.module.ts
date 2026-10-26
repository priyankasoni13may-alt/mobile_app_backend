import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../database/prisma.service';
import { OtpService } from '../../common/adapters/otp.adapter';
import { MailService } from '../../common/services/mail.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'lumora_cypher_super_secret_jwt_key_2026_dev_only_change_in_prod',
      signOptions: { expiresIn: '15m' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService, OtpService, MailService],
  exports: [AuthService, JwtStrategy, PassportModule, MailService]
})
export class AuthModule {}
