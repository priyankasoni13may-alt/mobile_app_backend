import { create } from 'zustand';
import { UserDto, PartnerProfileDto } from '@lumora/shared-types';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserDto | null;
  profile: PartnerProfileDto | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  setAuth: (token: string, refreshToken: string, user: UserDto, profile?: PartnerProfileDto) => void;
  updateProfile: (profile: PartnerProfileDto) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  profile: null,
  isAuthenticated: false,
  isOnboarded: false,
  setAuth: (token, refreshToken, user, profile) =>
    set({
      token,
      refreshToken,
      user,
      profile: profile || null,
      isAuthenticated: true,
      isOnboarded: profile?.onboardingStatus === 'APPROVED'
    }),
  updateProfile: (profile) =>
    set((state) => ({
      profile,
      isOnboarded: profile.onboardingStatus === 'APPROVED'
    })),
  logout: () =>
    set({
      token: null,
      refreshToken: null,
      user: null,
      profile: null,
      isAuthenticated: false,
      isOnboarded: false
    })
}));
