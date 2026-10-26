import { LumoraApiClient } from '@lumora/api-client';
import { useAuthStore } from '../store/authStore';

import Constants from 'expo-constants';

// In Expo development on a physical device, localhost points to the phone itself.
// We dynamically resolve the computer's LAN IP from Metro hostUri so network IP changes never break API calls.
const debuggerHost = Constants.expoConfig?.hostUri;
const lanIp = debuggerHost ? debuggerHost.split(':')[0] : null;

const API_BASE_URL = lanIp
  ? `http://${lanIp}:4000/api/v1`
  : (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api/v1');

export const apiClient = new LumoraApiClient({
  baseUrl: API_BASE_URL,
  getAccessToken: () => useAuthStore.getState().token,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  onTokenRefresh: (newAccess, newRefresh) => {
    const { user, profile } = useAuthStore.getState();
    if (user) {
      useAuthStore.getState().setAuth(newAccess, newRefresh || '', user, profile || undefined);
    }
  },
  onAuthError: () => {
    useAuthStore.getState().logout();
  }
});
