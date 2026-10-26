import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'lumora_cypher_super_secret_jwt_key_2026_dev_only_change_in_prod',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        userRoles: {
          include: { role: true }
        },
        partnerProfile: true
      }
    });

    if (!user) {
      throw new UnauthorizedException('User account no longer exists');
    }

    if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') {
      throw new UnauthorizedException('User account is currently suspended or deactivated');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      status: user.status,
      roles: user.userRoles.map((ur) => ur.role.name),
      profile: user.partnerProfile
    };
  }
}
