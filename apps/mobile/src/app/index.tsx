import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isOnboarded } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (isOnboarded) {
          router.replace('/(tabs)');
        } else {
          router.replace('/s09-status');
        }
      } else {
        router.replace('/s01-splash');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isOnboarded]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0B1026', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#5B8EE2" />
    </View>
  );
}
