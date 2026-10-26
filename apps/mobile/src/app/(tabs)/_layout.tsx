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
    <View style={{ flex: 1, backgroundColor: '#070B19' }}>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#0B1026' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 17 },
          tabBarStyle: {
            backgroundColor: '#0B1026',
            borderTopColor: '#1E294B',
            height: 60,
            paddingBottom: 8,
            paddingTop: 6
          },
          tabBarActiveTintColor: '#5B8EE2',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600' }
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
    backgroundColor: '#5B8EE2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B8EE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 99
  }
});
