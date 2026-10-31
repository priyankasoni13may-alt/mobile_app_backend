import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import {
  Home,
  Building2,
  Calendar,
  Banknote,
  User,
  Plus
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            height: Platform.OS === 'ios' ? 88 : 68,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
            paddingTop: 8,
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 12,
          },
          tabBarActiveTintColor: '#4F75FF',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            marginTop: 4,
            letterSpacing: 0.2
          },
          tabBarIconStyle: {
            marginBottom: -2
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
                <Home size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="leads"
          options={{
            title: 'Leads',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
                <Building2 size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="meetings"
          options={{
            title: 'Meetings',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
                <Calendar size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="earnings"
          options={{
            title: 'Earnings',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
                <Banknote size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
                <User size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            )
          }}
        />
      </Tabs>

      {/* Persistent Floating Action Button (FAB) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/s14-add-lead')}
        style={[styles.fab, { bottom: Platform.OS === 'ios' ? 90 + insets.bottom : 80 }]}
      >
        <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: {
    width: 36,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabIconWrapActive: {
    backgroundColor: '#EEF2FF'
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F75FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F75FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
    zIndex: 99
  }
});
