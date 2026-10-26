import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: { include: { role: true } },
        partnerProfile: true,
        verificationRecords: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        status: user.status,
        emailVerifiedAt: user.emailVerifiedAt,
        phoneVerifiedAt: user.phoneVerifiedAt,
        roles: user.userRoles.map((ur) => ur.role.name),
        createdAt: user.createdAt
      },
      profile: user.partnerProfile,
      latestVerification: user.verificationRecords[0] || null
    };
  }

  async updateProfile(userId: string, data: any) {
    const profile = await this.prisma.partnerProfile.upsert({
      where: { userId },
      update: {
        title: data.title,
        yearsExperience: data.yearsExperience,
        industries: data.industries,
        languages: data.languages,
        timezone: data.timezone,
        profileUrl: data.profileUrl,
        photoUrl: data.photoUrl
      },
      create: {
        userId,
        title: data.title || 'Business Development Partner',
        yearsExperience: data.yearsExperience || 0,
        industries: data.industries || [],
        languages: data.languages || ['English'],
        timezone: data.timezone || 'Asia/Kolkata',
        profileUrl: data.profileUrl,
        photoUrl: data.photoUrl
      }
    });

    return profile;
  }

  async getOnboardingStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: { include: { role: true } },
        partnerProfile: true,
        verificationRecords: { orderBy: { createdAt: 'desc' }, take: 1 },
        agreementAcceptances: true,
        learningCompletions: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    // Non-partners have automatic full dashboard access
    if (!roles.includes('PARTNER')) {
      return {
        emailVerified: !!user.emailVerifiedAt,
        phoneVerified: !!user.phoneVerifiedAt,
        profileCompleted: true,
        verificationStatus: 'VERIFIED',
        agreementAccepted: true,
        trainingCompleted: true,
        applicationStatus: 'APPROVED',
        canAccessDashboard: true
      };
    }

    const emailVerified = !!user.emailVerifiedAt;
    const phoneVerified = !!user.phoneVerifiedAt;
    const profileCompleted = !!user.partnerProfile && user.partnerProfile.industries.length > 0;
    const verificationStatus = user.verificationRecords[0]?.status || 'NOT_STARTED';
    const agreementAccepted = user.agreementAcceptances.length > 0;

    // Check mandatory training completions
    const mandatoryModulesCount = await this.prisma.learningModule.count({
      where: { isMandatory: true, isActive: true }
    });
    const completedCount = user.learningCompletions.length;
    const trainingCompleted = completedCount >= mandatoryModulesCount && mandatoryModulesCount > 0;

    const applicationStatus = user.partnerProfile?.onboardingStatus || 'REGISTRATION_COMPLETED';

    const canAccessDashboard =
      (emailVerified || phoneVerified) &&
      profileCompleted &&
      agreementAccepted &&
      applicationStatus === 'APPROVED';

    return {
      emailVerified,
      phoneVerified,
      profileCompleted,
      verificationStatus,
      agreementAccepted,
      trainingCompleted,
      applicationStatus,
      canAccessDashboard
    };
  }

  async uploadPhoto(userId: string, photoUrl: string) {
    return this.prisma.partnerProfile.update({
      where: { userId },
      data: { photoUrl }
    });
  }
}
