import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {
  Home,
  Building2,
  Calendar,
  Banknote,
  User,
  Plus
} from 'lucide-react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#EEF2F6',
            borderTopWidth: 1,
            height: 62,
            paddingBottom: 8,
            paddingTop: 6,
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 8,
          },
          tabBarActiveTintColor: '#4F75FF',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarLabelStyle: { fontSize: 10, fontWeight: '700' }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="leads"
          options={{
            title: 'Leads',
            tabBarIcon: ({ color, size }) => <Building2 size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="meetings"
          options={{
            title: 'Meetings',
            tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="earnings"
          options={{
            title: 'Earnings',
            tabBarIcon: ({ color, size }) => <Banknote size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />
          }}
        />
      </Tabs>

      {/* Persistent Floating Action Button (FAB) on Primary Tabs */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/s14-add-lead')}
        style={styles.fab}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F75FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F75FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 99
  }
});
