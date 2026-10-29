import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Plus,
  Calendar,
  Layers,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Building2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react-native';
import { apiClient } from '../../services/api';
import { useDraftStore } from '../../store/draftStore';
import { useAuthStore } from '../../store/authStore';
import { AppHeader } from '../../components/AppHeader';

export default function HomeDashboardScreen() {
  const router = useRouter();
  const { savedDrafts } = useDraftStore();
  const { user } = useAuthStore();

  const unsyncedCount = savedDrafts.length;
  const [leadList, setLeadList] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await apiClient.listLeads();
      if (res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
        setLeadList(list);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mappedActivities = list.slice(0, 5).map((l: any) => {
          let timeStr = 'Recently';
          if (l.createdAt) {
            const d = new Date(l.createdAt);
            if (!isNaN(d.getTime())) {
              timeStr = `${months[d.getMonth()]} ${d.getDate()}`;
            }
          }
          const isApproved = l.stage === 'QUALIFIED';
          return {
            id: l.id,
            companyName: l.companyName,
            contactName: l.contactName,
            needSummary: l.needSummary || 'Enterprise growth & tech diagnostic',
            stage: l.stage,
            stageLabel: isApproved ? 'Approved' : 'Pending Approval',
            stageColor: isApproved ? '#059669' : '#D97706',
            stageBg: isApproved ? '#ECFDF5' : '#FFFBEB',
            stageBorder: isApproved ? '#A7F3D0' : '#FDE68A',
            time: timeStr
          };
        });
        setActivities(mappedActivities);
      }
    } catch (err) {
      console.log('Failed to fetch dashboard leads:', err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const approvedCount = leadList.filter((l) => l.stage === 'QUALIFIED').length;
  const pendingCount = leadList.filter((l) => l.stage === 'NEW' || l.stage === 'CONTACTED').length;
  const clientCount = leadList.filter((l) => l.stage === 'SERVICE_WON' || l.stage === 'DIAGNOSTIC_WON').length;

  const kpis = [
    {
      label: 'TOTAL PROSPECTS',
      value: leadList.length,
      target: 30,
      pct: Math.min(100, Math.round((leadList.length / 30) * 100)),
      badgeText: `${Math.min(100, Math.round((leadList.length / 30) * 100))}%`,
      subtitle: `${Math.max(0, 30 - leadList.length)} to Q1 Goal`,
      color: '#4F75FF',
      bgColor: '#EEF2FF',
      borderColor: '#DDE5FE',
      icon: Building2
    },
    {
      label: 'APPROVED LEADS',
      value: approvedCount,
      target: 10,
      pct: Math.min(100, Math.round((approvedCount / 10) * 100)),
      badgeText: `${Math.min(100, Math.round((approvedCount / 10) * 100))}%`,
      subtitle: `${approvedCount} Qualified by Admin`,
      color: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
      icon: CheckCircle2
    },
    {
      label: 'PENDING APPROVAL',
      value: pendingCount,
      target: 5,
      pct: Math.min(100, Math.round((pendingCount / 5) * 100)),
      badgeText: pendingCount > 0 ? `${pendingCount} In Audit` : 'All Clear',
      subtitle: 'Awaiting Compliance',
      color: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      icon: Clock
    },
    {
      label: 'ANNUAL CLIENTS',
      value: clientCount,
      target: 15,
      pct: Math.min(100, Math.round((clientCount / 15) * 100)),
      badgeText: clientCount > 0 ? `${clientCount} Won` : 'Target 15',
      subtitle: 'Retainers & Closures',
      color: '#DB2777',
      bgColor: '#FDF2F8',
      borderColor: '#FBCFE8',
      icon: Briefcase
    }
  ];

  const quickActions = [
    {
      title: 'Add Lead',
      subtitle: 'Register prospect',
      icon: Plus,
      color: '#4F75FF',
      bgColor: '#EEF2FF',
      route: '/s14-add-lead',
      isPrimary: true
    },
    {
      title: 'Book Meeting',
      subtitle: 'Discovery call',
      icon: Calendar,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      route: '/s18-book-meeting'
    },
    {
      title: 'Sales Pipeline',
      subtitle: 'Deal stages',
      icon: Layers,
      color: '#D97706',
      bgColor: '#FFFBEB',
      route: '/s21-pipeline'
    },
    {
      title: 'Pitch Guides',
      subtitle: 'ICP & services',
      icon: Briefcase,
      color: '#DB2777',
      bgColor: '#FDF2F8',
      route: '/s12-services'
    }
  ];

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Partner';

  return (
    <View style={styles.screenWrapper}>
      {/* Sticky Branded Executive Top Bar */}
      <AppHeader showLogo={true} showNotifications={true} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F75FF']} />}
      >
        {/* Executive Welcome & Partner Status Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.partnerTierPill}>
              <View style={styles.tierDot} />
              <Text style={styles.partnerTierText}>TIER 1 BD PARTNER</Text>
            </View>
            <View style={styles.networkBadge}>
              <Sparkles size={11} color="#6366F1" />
              <Text style={styles.networkBadgeText}>Active Q1</Text>
            </View>
          </View>

          <View style={styles.heroGreetingBox}>
            <Text style={styles.heroTitle}>Hello, {firstName} 👋</Text>
            <Text style={styles.heroSubtitle}>
              Lumora Partner Network • Global Business Development
            </Text>
          </View>

          <View style={styles.heroMetadataStrip}>
            <View style={styles.metaChip}>
              <Text style={styles.metaChipLabel}>PARTNER ID</Text>
              <Text style={styles.metaChipVal}>LUM-49061</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaChip}>
              <Text style={styles.metaChipLabel}>QUARTER TARGET</Text>
              <Text style={styles.metaChipVal}>30 Qualified Deals</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaChip}>
              <Text style={styles.metaChipLabel}>STATUS</Text>
              <Text style={styles.metaChipValGreen}>Verified</Text>
            </View>
          </View>

          {unsyncedCount > 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/s34-offline-state')}
              style={styles.unsyncedBanner}
            >
              <AlertCircle size={14} color="#D97706" />
              <Text style={styles.unsyncedText}>{unsyncedCount} Offline Drafts Waiting to Sync</Text>
              <ArrowRight size={13} color="#D97706" />
            </TouchableOpacity>
          )}
        </View>

        {/* 4 Core Benchmark Gauges */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIconCircle}>
              <TrendingUp size={14} color="#4F75FF" />
            </View>
            <Text style={styles.sectionTitle}>Performance Activity Benchmarks</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/leads')}
            style={styles.sectionActionBtn}
          >
            <Text style={styles.sectionActionText}>View Pipeline</Text>
            <ChevronRight size={13} color="#4F75FF" />
          </TouchableOpacity>
        </View>

        <View style={styles.kpiGrid}>
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <View key={i} style={[styles.kpiCard, { borderColor: kpi.borderColor }]}>
                {/* Top Row: Icon + Badge */}
                <View style={styles.kpiTopRow}>
                  <View style={[styles.kpiIconBox, { backgroundColor: kpi.bgColor }]}>
                    <Icon size={18} color={kpi.color} />
                  </View>
                  <View style={[styles.kpiBadge, { backgroundColor: kpi.bgColor }]}>
                    <Text style={[styles.kpiBadgeText, { color: kpi.color }]}>{kpi.badgeText}</Text>
                  </View>
                </View>

                {/* Numeric Metric */}
                <View style={styles.kpiValueRow}>
                  <Text style={styles.kpiBigNumber}>{kpi.value}</Text>
                  <Text style={styles.kpiTargetNumber}>/ {kpi.target}</Text>
                </View>

                {/* Metric Label */}
                <Text style={styles.kpiLabel}>{kpi.label}</Text>

                {/* Multi-tone Progress Bar */}
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.max(4, kpi.pct)}%`,
                        backgroundColor: kpi.color
                      }
                    ]}
                  />
                </View>

                {/* Subtitle / Milestone Hint */}
                <Text style={styles.kpiSubHint}>{kpi.subtitle}</Text>
              </View>
            );
          })}
        </View>

        {/* Quick Actions Shortcuts */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#F5F3FF' }]}>
              <Zap size={14} color="#8B5CF6" />
            </View>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <Text style={styles.sectionHelper}>Instant Access</Text>
        </View>

        <View style={styles.quickActionGrid}>
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                onPress={() => router.push(action.route as any)}
                style={[
                  styles.quickActionCard,
                  action.isPrimary && styles.quickActionCardPrimary
                ]}
              >
                <View style={[styles.quickActionIconBox, { backgroundColor: action.bgColor }]}>
                  <Icon size={20} color={action.color} />
                </View>
                <View style={styles.quickActionTextBox}>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recent Activity Timeline */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#FFFBEB' }]}>
              <Clock size={14} color="#D97706" />
            </View>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/leads')}
            style={styles.sectionActionBtn}
          >
            <Text style={styles.sectionActionText}>All Records</Text>
            <ChevronRight size={13} color="#4F75FF" />
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          {activities.length === 0 ? (
            <View style={styles.emptyActivity}>
              <View style={styles.emptyIconCircle}>
                <Building2 size={28} color="#4F75FF" />
              </View>
              <Text style={styles.emptyActivityTitle}>No Activity Recorded Yet</Text>
              <Text style={styles.emptyActivitySub}>
                As you register prospects, schedule discovery meetings, and close deals, your live timeline updates here.
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/s14-add-lead')}
                style={styles.firstLeadBtn}
              >
                <Plus size={15} color="#FFFFFF" />
                <Text style={styles.firstLeadBtnText}>Register First Prospect</Text>
              </TouchableOpacity>
            </View>
          ) : (
            activities.map((act, i) => (
              <TouchableOpacity
                key={act.id || i}
                activeOpacity={0.7}
                onPress={() => router.push({ pathname: '/s16-lead-detail', params: { id: act.id } })}
                style={[
                  styles.activityItem,
                  i === activities.length - 1 && { borderBottomWidth: 0 }
                ]}
              >
                <View style={[styles.activityIconCircle, { backgroundColor: act.stageBg }]}>
                  <Building2 size={16} color={act.stageColor} />
                </View>
                <View style={styles.activityContentBox}>
                  <View style={styles.activityNameRow}>
                    <Text style={styles.activityItemTitle} numberOfLines={1}>
                      {act.companyName}
                    </Text>
                    <View
                      style={[
                        styles.stagePillMini,
                        { backgroundColor: act.stageBg, borderColor: act.stageBorder }
                      ]}
                    >
                      <Text style={[styles.stagePillMiniText, { color: act.stageColor }]}>
                        {act.stageLabel}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.activityItemDesc} numberOfLines={1}>
                    {act.contactName ? `${act.contactName} • ` : ''}
                    {act.needSummary}
                  </Text>
                </View>
                <View style={styles.activityTimeBox}>
                  <Text style={styles.activityTime}>{act.time}</Text>
                  <ChevronRight size={14} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
    gap: 16
  },
  /* Hero Card */
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  partnerTierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  tierDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669'
  },
  partnerTierText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE'
  },
  networkBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5'
  },
  heroGreetingBox: {
    gap: 3
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0B0F26',
    letterSpacing: -0.4
  },
  heroSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    lineHeight: 17
  },
  heroMetadataStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    marginTop: 2
  },
  metaChip: {
    alignItems: 'center',
    gap: 2,
    flex: 1
  },
  metaChipLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5
  },
  metaChipVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A'
  },
  metaChipValGreen: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669'
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0'
  },
  unsyncedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: 4
  },
  unsyncedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
    flex: 1,
    marginLeft: 6
  },
  /* Section Header */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  sectionIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B0F26',
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  sectionActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  sectionActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F75FF'
  },
  sectionHelper: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8'
  },
  /* 4 KPI Cards Grid */
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between'
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  kpiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  kpiBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6
  },
  kpiBadgeText: {
    fontSize: 10,
    fontWeight: '800'
  },
  kpiValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4
  },
  kpiBigNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0B0F26',
    letterSpacing: -0.5
  },
  kpiTargetNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8'
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3
  },
  kpiSubHint: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8'
  },
  /* Quick Actions */
  quickActionGrid: {
    flexDirection: 'row',
    gap: 10
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  quickActionCardPrimary: {
    borderColor: '#C7D2FE',
    backgroundColor: '#FFFFFF'
  },
  quickActionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickActionTextBox: {
    alignItems: 'center',
    gap: 2
  },
  quickActionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center'
  },
  quickActionSubtitle: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center'
  },
  /* Activity Timeline */
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2
  },
  emptyActivity: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8
  },
  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  emptyActivityTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B0F26'
  },
  emptyActivitySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280
  },
  firstLeadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F75FF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    marginTop: 8,
    shadowColor: '#4F75FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3
  },
  firstLeadBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  activityIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activityContentBox: {
    flex: 1,
    gap: 3
  },
  activityNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6
  },
  activityItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B0F26',
    flex: 1
  },
  stagePillMini: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1
  },
  stagePillMiniText: {
    fontSize: 9,
    fontWeight: '800'
  },
  activityItemDesc: {
    fontSize: 11,
    color: '#64748B'
  },
  activityTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  activityTime: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8'
  }
});
