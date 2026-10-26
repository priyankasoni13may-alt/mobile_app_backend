import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  }
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, backgroundColor: '#070B19' }}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#0B1026' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: 'bold' },
            contentStyle: { backgroundColor: '#070B19' },
            animation: 'slide_from_right'
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="s01-splash" options={{ headerShown: false }} />
          <Stack.Screen name="s02-welcome" options={{ headerShown: false }} />
          <Stack.Screen name="s03-login" options={{ title: 'Partner Sign In' }} />
          <Stack.Screen name="s04-register" options={{ title: 'Join Partner Network' }} />
          <Stack.Screen name="s05-otp" options={{ title: 'OTP Verification' }} />
          <Stack.Screen name="s06-profile-setup" options={{ title: 'Profile Setup' }} />
          <Stack.Screen name="s07-verification" options={{ title: 'Identity Verification' }} />
          <Stack.Screen name="s08-agreement" options={{ title: 'Code of Conduct' }} />
          <Stack.Screen name="s09-status" options={{ title: 'Application Status' }} />
          <Stack.Screen name="s10-training" options={{ title: 'Partner Training Hub' }} />
          <Stack.Screen name="s12-services" options={{ title: 'Services Catalogue' }} />
          <Stack.Screen name="s13-service-detail" options={{ title: 'Pitch Guide & ICP' }} />
          <Stack.Screen name="s14-add-lead" options={{ title: 'Register New Prospect' }} />
          <Stack.Screen name="s15-duplicate-check" options={{ title: 'Duplicate Verification' }} />
          <Stack.Screen name="s16-lead-detail" options={{ title: 'Lead & Activity Timeline' }} />
          <Stack.Screen name="s17-qualification" options={{ title: 'Lead Qualification Form' }} />
          <Stack.Screen name="s18-book-meeting" options={{ title: 'Book Discovery Meeting' }} />
          <Stack.Screen name="s20-meeting-outcome" options={{ title: 'Record Meeting Outcome' }} />
          <Stack.Screen name="s21-pipeline" options={{ title: 'Sales Pipeline' }} />
          <Stack.Screen name="s22-diagnostic" options={{ title: 'Diagnostic Offer (₹37,000)' }} />
          <Stack.Screen name="s23-service-deal" options={{ title: 'Service Deal & Milestone' }} />
          <Stack.Screen name="s25-earnings-ledger" options={{ title: 'Immutable Earnings Ledger' }} />
          <Stack.Screen name="s26-performance" options={{ title: 'Performance KPIs' }} />
          <Stack.Screen name="s27-tasks" options={{ title: 'Follow-ups & Tasks' }} />
          <Stack.Screen name="s28-client-reviews" options={{ title: 'Client Reviews' }} />
          <Stack.Screen name="s29-notifications" options={{ title: 'Notifications Centre' }} />
          <Stack.Screen name="s31-support" options={{ title: 'Help & Support Desk' }} />
          <Stack.Screen name="s32-admin-overview" options={{ title: 'Executive Overview' }} />
          <Stack.Screen name="s33-search" options={{ title: 'Global Search' }} />
          <Stack.Screen name="s34-offline-state" options={{ presentation: 'modal', title: 'Offline Mode & Drafts' }} />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}
