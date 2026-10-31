import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Search,
  Building2,
  Calendar,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw
} from 'lucide-react-native';
import { apiClient } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { AppHeader } from '../../components/AppHeader';
import { LeadsSkeleton } from '../../components/Skeleton';

function formatLeadDate(dateVal?: string | Date | null): string {
  if (!dateVal) return 'Recently';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'Recently';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  } catch {
    return 'Recently';
  }
}

export default function LeadsTabScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeStage, setActiveStage] = useState('ALL');
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAccountActive = user?.status === 'ACTIVE';

  const fetchLeads = async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await apiClient.listLeads();
      if (res.data) {
        const list = Array.isArray(res.data)
          ? res.data
          : (res.data as any).data || [];
        setLeads(list);
      } else {
        setLeads([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to connect to lead service.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Re-fetch automatically whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchLeads();
    }, [])
  );

  const getStageMeta = (stage: string) => {
    switch (stage) {
      case 'NEW':
        return {
          label: 'Pending Approval',
          hint: 'Under Admin Review',
          textColor: '#D97706',
          bgColor: '#FEF3C7',
          borderColor: '#FDE68A',
          icon: Clock
        };
      case 'QUALIFIED':
        return {
          label: 'Approved & Qualified',
          hint: 'Ready for Meeting',
          textColor: '#059669',
          bgColor: '#ECFDF5',
          borderColor: '#A7F3D0',
          icon: CheckCircle2
        };
      case 'CONTACTED':
        return {
          label: 'Contacted',
          hint: 'In Outreach',
          textColor: '#2563EB',
          bgColor: '#EFF6FF',
          borderColor: '#BFDBFE',
          icon: Building2
        };
      case 'MEETING_SCHEDULED':
      case 'MEETING_COMPLETED':
        return {
          label: 'Meeting Booked',
          hint: 'Discovery Scheduled',
          textColor: '#7C3AED',
          bgColor: '#FAF5FF',
          borderColor: '#E9D5FF',
          icon: Calendar
        };
      case 'DIAGNOSTIC_WON':
      case 'SERVICE_WON':
        return {
          label: 'Won & Active',
          hint: 'Commission Generating',
          textColor: '#059669',
          bgColor: '#D1FAE5',
          borderColor: '#6EE7B7',
          icon: ShieldCheck
        };
      case 'UNQUALIFIED':
        return {
          label: 'Unqualified',
          hint: 'Declined by Admin',
          textColor: '#DC2626',
          bgColor: '#FEF2F2',
          borderColor: '#FECACA',
          icon: AlertCircle
        };
      default:
        return {
          label: stage.replace('_', ' '),
          hint: '',
          textColor: '#475569',
          bgColor: '#F1F5F9',
          borderColor: '#E2E8F0',
          icon: Building2
        };
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (activeStage === 'NEW' && l.stage !== 'NEW') return false;
    if (activeStage === 'APPROVED' && l.stage !== 'QUALIFIED') return false;
    if (activeStage === 'CONTACTED' && l.stage !== 'CONTACTED') return false;
    if (activeStage === 'MEETINGS' && !['MEETING_SCHEDULED', 'MEETING_COMPLETED'].includes(l.stage)) return false;
    if (activeStage !== 'ALL' && !['NEW', 'APPROVED', 'CONTACTED', 'MEETINGS'].includes(activeStage) && l.stage !== activeStage) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCompany = l.companyName?.toLowerCase().includes(q);
      const matchContact = l.contactName?.toLowerCase().includes(q);
      const matchWebsite = l.companyWebsite?.toLowerCase().includes(q);
      if (!matchCompany && !matchContact && !matchWebsite) return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Branded Executive Top Bar */}
      <AppHeader
        title="Prospects Pipeline"
        subtitle="Lead Management & Qualification"
        showLogo={false}
        showNotifications={true}
      />

      {/* Account Restriction Notice (if partner is not active) */}
      {!isAccountActive && (
        <View style={styles.restrictionBanner}>
          <AlertCircle size={16} color="#B45309" />
          <Text style={styles.restrictionText}>
            Account Verification Pending: Only active & verified partners can register prospects.
          </Text>
        </View>
      )}

      {/* Search Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            placeholder="Search company, contact, or domain..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            cursorColor="#4F75FF"
          />
        </View>

        {/* Stage Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'ALL', label: `All (${leads.length})` },
            { id: 'NEW', label: `Pending Approval (${leads.filter((l) => l.stage === 'NEW').length})` },
            { id: 'APPROVED', label: `Approved (${leads.filter((l) => l.stage === 'QUALIFIED').length})` },
            { id: 'CONTACTED', label: 'Contacted' },
            { id: 'MEETINGS', label: 'Meetings' }
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setActiveStage(item.id)}
              style={[styles.chip, activeStage === item.id && styles.chipActive]}
            >
              <Text style={[styles.chipText, activeStage === item.id && styles.chipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchLeads(true)}
            colors={['#4F75FF']}
            tintColor="#4F75FF"
          />
        }
      >
        {loading && !refreshing ? (
          <LeadsSkeleton />
        ) : error ? (
          <View style={styles.errorContainer}>
            <AlertCircle size={32} color="#EF4444" />
            <Text style={styles.errorTitle}>Connection Error</Text>
            <Text style={styles.errorSubtitle}>{error}</Text>
            <TouchableOpacity onPress={() => fetchLeads()} style={styles.retryBtn}>
              <RefreshCw size={14} color="#FFFFFF" />
              <Text style={styles.retryBtnText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        ) : filteredLeads.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Building2 size={36} color="#64748B" />
            </View>
            <Text style={styles.emptyTitle}>No Leads Registered</Text>
            <Text style={styles.emptySubtitle}>
              You haven't registered any prospect records yet. Tap below to add your first client opportunity with zero duplicate risk!
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/s14-add-lead')}
              style={styles.addLeadBtn}
            >
              <Plus size={18} color="#FFFFFF" />
              <Text style={styles.addLeadBtnText}>Register New Prospect</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredLeads.map((lead) => {
            const stageMeta = getStageMeta(lead.stage);
            const StageIcon = stageMeta.icon;

            return (
              <TouchableOpacity
                key={lead.id}
                activeOpacity={0.8}
                onPress={() => router.push({ pathname: '/s16-lead-detail', params: { leadId: lead.id } })}
                style={styles.leadCard}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.companyName}>{lead.companyName}</Text>
                    {lead.companyWebsite ? (
                      <Text style={styles.leadWebsite}>{lead.companyWebsite}</Text>
                    ) : null}
                  </View>

                  <View
                    style={[
                      styles.stageBadge,
                      { backgroundColor: stageMeta.bgColor, borderColor: stageMeta.borderColor }
                    ]}
                  >
                    <StageIcon size={12} color={stageMeta.textColor} />
                    <Text style={[styles.stageText, { color: stageMeta.textColor }]}>
                      {stageMeta.label}
                    </Text>
                  </View>
                </View>

                {lead.contactName ? (
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>Contact:</Text>
                    <Text style={styles.contactValue}>
                      {(() => {
                        const name = (lead.contactName || '').trim();
                        const role = (lead.contactRole || '').trim();
                        if (!role || name.toLowerCase().includes(role.toLowerCase())) {
                          return name;
                        }
                        return `${name} (${role})`;
                      })()}
                    </Text>
                  </View>
                ) : null}

                {lead.contactEmail || lead.contactPhone ? (
                  <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>Reach:</Text>
                    <Text style={styles.contactValue}>
                      {[lead.contactEmail, lead.contactPhone].filter(Boolean).join(' • ')}
                    </Text>
                  </View>
                ) : null}

                {lead.needSummary ? (
                  <View style={styles.needRow}>
                    <Text style={styles.contactLabel}>Need:</Text>
                    <Text style={styles.needValue} numberOfLines={2}>
                      {lead.needSummary}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.cardFooter}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dateLabel}>
                      Submitted: {formatLeadDate(lead.createdAt)}
                    </Text>
                  </View>

                  <View style={styles.actionShortcuts}>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: '/s18-book-meeting',
                          params: { leadId: lead.id, companyName: lead.companyName }
                        })
                      }
                      style={styles.shortcutBtn}
                    >
                      <Calendar size={14} color="#4F75FF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({ pathname: '/s16-lead-detail', params: { leadId: lead.id } })
                      }
                      style={styles.shortcutBtn}
                    >
                      <ChevronRight size={16} color="#0B0F26" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  restrictionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  restrictionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    lineHeight: 16
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6'
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    height: 42
  },
  searchInput: { flex: 1, color: '#0B0F26', fontSize: 13, marginLeft: 8 },
  filterScroll: { flexDirection: 'row', gap: 8, marginTop: 10, paddingBottom: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9'
  },
  chipActive: { backgroundColor: '#4F75FF' },
  chipText: { color: '#64748B', fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#FFFFFF' },
  listContent: { padding: 16, paddingBottom: 100, gap: 14 },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12
  },
  loadingText: { fontSize: 13, color: '#64748B' },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    gap: 10
  },
  errorTitle: { fontSize: 16, fontWeight: '700', color: '#0B0F26' },
  errorSubtitle: { fontSize: 12, color: '#64748B', textAlign: 'center', lineHeight: 18 },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F75FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 6
  },
  retryBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    gap: 12
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6'
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0B0F26' },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 300
  },
  addLeadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4F75FF',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 8
  },
  addLeadBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  leadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EDF2F7',
    gap: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  companyName: { fontSize: 17, fontWeight: '800', color: '#0B0F26', letterSpacing: -0.3 },
  leadWebsite: { fontSize: 12, color: '#4F75FF', marginTop: 2, fontWeight: '600' },
  stageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1
  },
  stageText: { fontSize: 11, fontWeight: '800' },
  contactRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  contactLabel: { fontSize: 12, color: '#64748B', width: 62, fontWeight: '600' },
  contactValue: { fontSize: 12, color: '#0F172A', flex: 1, fontWeight: '700' },
  needRow: { flexDirection: 'row', gap: 8, marginTop: 2 },
  needValue: { fontSize: 12, color: '#475569', flex: 1, lineHeight: 18 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 10,
    marginTop: 2
  },
  dateLabel: { fontSize: 11, color: '#94A3B8' },
  actionShortcuts: { flexDirection: 'row', gap: 8 },
  shortcutBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6'
  },
  fabBtn: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F75FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F75FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6
  }
});
