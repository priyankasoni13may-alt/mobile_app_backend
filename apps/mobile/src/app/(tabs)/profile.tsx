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

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { user, profile, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/s03-login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>
            {user?.fullName?.split(' ').map((n) => n[0]).join('') || 'LP'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{user?.fullName || 'Lumora Partner'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'partner@lumora.expert'}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 100 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 16, marginBottom: 20 },
  avatarBox: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#5B8EE2', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  profileEmail: { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  verifiedText: { fontSize: 9, fontWeight: 'bold', color: '#10B981' },
  roleBadge: { backgroundColor: '#101735', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#1E294B' },
  roleText: { fontSize: 9, fontWeight: 'bold', color: '#38BDF8' },
  sectionHeader: { fontSize: 11, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 12 },
  menuGroup: { backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', overflow: 'hidden', marginBottom: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: '#101735' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuTitle: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', marginTop: 20 },
  logoutText: { fontSize: 13, fontWeight: 'bold', color: '#EF4444' }
});
