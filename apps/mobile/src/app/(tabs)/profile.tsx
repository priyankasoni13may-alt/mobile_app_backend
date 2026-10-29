import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
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
  Lock,
  Briefcase,
  Calendar,
  Linkedin,
  Pencil,
  CheckCircle2,
  Sparkles
} from 'lucide-react-native';
import { apiClient } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { AppHeader } from '../../components/AppHeader';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { user, profile, logout, updateProfile } = useAuthStore();

  // Keep profile freshly synced from server on screen focus
  useFocusEffect(
    React.useCallback(() => {
      apiClient
        .me()
        .then((res) => {
          if (res.data?.profile) {
            updateProfile(res.data.profile);
          }
        })
        .catch(() => {});
    }, [updateProfile])
  );

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of the Lumora Partner Network?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/s03-login');
          }
        }
      ]
    );
  };

  const getInitials = () => {
    if (!user?.fullName) return 'SA';
    return user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleEditProfile = () => {
    router.push({
      pathname: '/s06-profile-setup',
      params: { edit: 'true' }
    });
  };

  return (
    <View style={styles.screenWrapper}>
      {/* Sticky Branded Executive Top Bar */}
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
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{user?.fullName || 'Sagar'}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleEditProfile}
                style={styles.editBtnTop}
              >
                <Pencil size={12} color="#4F75FF" />
                <Text style={styles.editBtnTopText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.profileEmail}>{user?.email || user?.phone || 'Verified Account'}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={12} color="#059669" />
                <Text style={styles.verifiedText}>Identity Verified</Text>
              </View>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>Tier 1 BD Partner</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dedicated Saved Professional Profile Card */}
        <View style={styles.proProfileCard}>
          <View style={styles.proProfileHeader}>
            <View style={styles.proHeaderLeft}>
              <View style={styles.proIconBox}>
                <Briefcase size={18} color="#4F75FF" />
              </View>
              <View style={{ gap: 2 }}>
                <Text style={styles.proCardHeading}>PROFESSIONAL DESIGNATION</Text>
                <Text style={styles.proRoleText}>
                  {profile?.title || 'Professional Title Not Set'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleEditProfile}
              style={styles.editPillBtn}
            >
              <Pencil size={12} color="#4F75FF" />
              <Text style={styles.editPillText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Experience & Status Row */}
          <View style={styles.proMetaRow}>
            <View style={styles.proMetaItem}>
              <Calendar size={13} color="#4F75FF" />
              <Text style={styles.proMetaText}>
                {profile?.yearsExperience !== undefined && profile?.yearsExperience !== null
                  ? `${profile.yearsExperience} ${Number(profile.yearsExperience) === 1 ? 'Year' : 'Years'} B2B Experience`
                  : '0 Years Experience'}
              </Text>
            </View>
            <View style={styles.roleVerifiedChip}>
              <CheckCircle2 size={11} color="#059669" />
              <Text style={styles.roleVerifiedText}>Active In System</Text>
            </View>
          </View>

          {/* Industry Focus Chips */}
          <View style={styles.proSectionBox}>
            <Text style={styles.proSectionLabel}>CORE INDUSTRY FOCUS</Text>
            <View style={styles.industriesRow}>
              {Array.isArray(profile?.industries) && profile.industries.length > 0 ? (
                profile.industries.map((ind: string, idx: number) => (
                  <View key={idx} style={styles.indChip}>
                    <Text style={styles.indChipText}>{ind}</Text>
                  </View>
                ))
              ) : (
                <TouchableOpacity onPress={handleEditProfile} activeOpacity={0.7}>
                  <Text style={styles.proEmptyHint}>No industry focus selected — tap Edit to specify.</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* LinkedIn URL Link */}
          {profile?.profileUrl ? (
            <View style={styles.linkedinBox}>
              <Linkedin size={14} color="#0A66C2" />
              <Text style={styles.linkedinText} numberOfLines={1}>
                {profile.profileUrl}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleEditProfile}
              style={styles.addLinkedInBtn}
            >
              <Linkedin size={13} color="#64748B" />
              <Text style={styles.addLinkedInText}>+ Add LinkedIn Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Menu Sections */}
        <Text style={styles.sectionHeader}>Partner Identity & Compliance</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity
            onPress={handleEditProfile}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <User size={18} color="#4F75FF" />
              <View>
                <Text style={styles.menuTitle}>Edit Professional Profile</Text>
                <Text style={styles.menuSubtitle}>Change title, years of experience, & industries</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/s07-verification')}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <ShieldCheck size={18} color="#10B981" />
              <View>
                <Text style={styles.menuTitle}>Identity Verification Details</Text>
                <Text style={styles.menuSubtitle}>KYC & corporate identity credentials</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/s08-agreement')}
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
          >
            <View style={styles.menuLeft}>
              <FileCheck2 size={18} color="#38BDF8" />
              <View>
                <Text style={styles.menuTitle}>Signed Agreements (v2026.1)</Text>
                <Text style={styles.menuSubtitle}>Code of conduct & NDAs</Text>
              </View>
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
              <BarChart2 size={18} color="#8B5CF6" />
              <Text style={styles.menuTitle}>Performance KPIs & Gauges</Text>
            </View>
            <ChevronRight size={16} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/s29-notifications')}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Bell size={18} color="#D97706" />
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
          activeOpacity={0.8}
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
  screenWrapper: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 100, gap: 14 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  avatarBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#4F75FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F75FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3
  },
  avatarText: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  profileName: { fontSize: 18, fontWeight: '900', color: '#0B0F26', letterSpacing: -0.3, flex: 1 },
  editBtnTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE'
  },
  editBtnTopText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F75FF'
  },
  profileEmail: { fontSize: 12, color: '#64748B', marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  verifiedText: { fontSize: 10, fontWeight: '800', color: '#059669' },
  roleBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE'
  },
  roleText: { fontSize: 10, fontWeight: '800', color: '#4F75FF' },
  /* Dedicated Saved Professional Profile Card */
  proProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  proProfileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  proHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  proIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  proCardHeading: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6
  },
  proRoleText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B0F26',
    letterSpacing: -0.3
  },
  editPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE'
  },
  editPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F75FF'
  },
  proMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EDF2F7'
  },
  proMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  proMetaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155'
  },
  roleVerifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6
  },
  roleVerifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669'
  },
  proSectionBox: {
    gap: 6
  },
  proSectionLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6
  },
  industriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  indChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE'
  },
  indChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338CA'
  },
  proEmptyHint: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic'
  },
  linkedinBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD'
  },
  linkedinText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
    flex: 1
  },
  addLinkedInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4
  },
  addLinkedInText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
    marginTop: 6
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8
  },
  menuTitle: { fontSize: 13, fontWeight: '800', color: '#0B0F26' },
  menuSubtitle: { fontSize: 11, color: '#64748B', marginTop: 1 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 10
  },
  logoutText: { fontSize: 13, fontWeight: '800', color: '#DC2626' }
});
