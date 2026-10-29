import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Search, Sparkles } from 'lucide-react-native';
import { LumoraLogo } from './LumoraLogo';
import { useAuthStore } from '../store/authStore';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  showNotifications?: boolean;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showLogo = true,
  showNotifications = true,
  rightAction
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();

  const userInitials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'LP';

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
      {/* Left Area: Brand Logo & Title */}
      <View style={styles.leftRow}>
        {showLogo ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)')}
            style={styles.logoRow}
          >
            <LumoraLogo size={32} />
            <View style={styles.brandTitleBox}>
              <View style={styles.brandNameRow}>
                <Text style={styles.brandLumora}>LUMORA</Text>
                <View style={styles.brandPill}>
                  <Text style={styles.brandPillText}>NETWORK</Text>
                </View>
              </View>
              <Text style={styles.brandSub}>
                {subtitle || 'Business Development Global'}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.textTitleBox}>
            <Text style={styles.screenTitle}>{title}</Text>
            {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
          </View>
        )}
      </View>

      {/* Right Area: Status Indicator, Notifications & Profile Avatar */}
      <View style={styles.rightRow}>
        {rightAction ? (
          rightAction
        ) : (
          <>
            {/* Live Network Status Pill */}
            <View style={styles.liveStatusPill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveStatusText}>LIVE</Text>
            </View>

            {/* Notification Bell */}
            {showNotifications && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/s29-notifications')}
                style={styles.iconBtn}
              >
                <Bell size={18} color="#334155" />
                <View style={styles.bellBadge} />
              </TouchableOpacity>
            )}

            {/* Profile Avatar Chip */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/profile')}
              style={styles.avatarBtn}
            >
              <Text style={styles.avatarText}>{userInitials}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    zIndex: 10
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTitleBox: {
    gap: 1,
  },
  brandNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandLumora: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B0F26',
    letterSpacing: 0.6,
  },
  brandPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  brandPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4F75FF',
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  textTitleBox: {
    gap: 1,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0B0F26',
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  bellBadge: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#4F75FF',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#4F75FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F75FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default AppHeader;

