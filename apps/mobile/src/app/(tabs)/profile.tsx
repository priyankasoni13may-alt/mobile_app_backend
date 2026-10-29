import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  ShieldCheck,
  FileCheck2,
  Bell,
  BarChart2,
  HelpCircle,
  LogOut,
  ChevronRight,
  Globe,
  Lock
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { AppHeader } from '../../components/AppHeader';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { user, profile, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/s03-login');
  };

  const getInitials = () => {
    if (!user?.fullName) return '';
    return user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <AppHeader
        title="Partner Profile"
        subtitle="Network Accreditation & Credentials"
        showLogo={false}
        showNotifications={true}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarBox}>
          {getInitials() ? (
            <Text style={styles.avatarText}>{getInitials()}</Text>
          ) : (
            <User size={24} color="#FFFFFF" />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{user?.fullName || 'Partner Account'}</Text>
          <Text style={styles.profileEmail}>{user?.email || user?.phone || 'Verified Account'}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={12} color="#10B981" />
              <Text style={styles.verifiedText}>Identity Verified</Text>
            </View>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>BD Partner</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu Sections */}
      <Text style={styles.sectionHeader}>Partner Identity & Compliance</Text>
      <View style={styles.menuGroup}>
        <TouchableOpacity
          onPress={() => router.push('/s06-profile-setup')}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <User size={18} color="#5B8EE2" />
            <Text style={styles.menuTitle}>Edit Professional Profile</Text>
          </View>
          <ChevronRight size={16} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/s07-verification')}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <ShieldCheck size={18} color="#10B981" />
            <Text style={styles.menuTitle}>Identity Verification Details</Text>
          </View>
          <ChevronRight size={16} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/s08-agreement')}
          style={[styles.menuItem, { borderBottomWidth: 0 }]}
        >
          <View style={styles.menuLeft}>
            <FileCheck2 size={18} color="#38BDF8" />
            <Text style={styles.menuTitle}>Signed Agreements (v2026.1)</Text>
          </View>
          <ChevronRight size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>Activity & Governance</Text>
      <View style={styles.menuGroup}>
        <TouchableOpacity
          onPress={() => router.push('/s26-performance')}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <BarChart2 size={18} color="#A855F7" />
            <Text style={styles.menuTitle}>Performance KPIs & Gauges</Text>
          </View>
          <ChevronRight size={16} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/s29-notifications')}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <Bell size={18} color="#F59E0B" />
            <Text style={styles.menuTitle}>Notifications Centre & Alerts</Text>
          </View>
          <ChevronRight size={16} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/s31-support')}
          style={[styles.menuItem, { borderBottomWidth: 0 }]}
        >
          <View style={styles.menuLeft}>
            <HelpCircle size={18} color="#38BDF8" />
            <Text style={styles.menuTitle}>Help & Support Desk</Text>
          </View>
          <ChevronRight size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Logout Action */}
      <TouchableOpacity
        onPress={handleLogout}
        style={styles.logoutBtn}
      >
        <LogOut size={16} color="#EF4444" />
        <Text style={styles.logoutText}>Sign Out of Partner Network</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 100 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  avatarBox: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#4F75FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  profileName: { fontSize: 17, fontWeight: '800', color: '#0B0F26' },
  profileEmail: { fontSize: 12, color: '#64748B', marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: '#A7F3D0' },
  verifiedText: { fontSize: 10, fontWeight: 'bold', color: '#059669' },
  roleBadge: { backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  roleText: { fontSize: 10, fontWeight: 'bold', color: '#4F75FF' },
  sectionHeader: { fontSize: 11, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 14 },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuTitle: { fontSize: 14, fontWeight: '700', color: '#0B0F26' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5', marginTop: 20 },
  logoutText: { fontSize: 13, fontWeight: 'bold', color: '#DC2626' }
});
