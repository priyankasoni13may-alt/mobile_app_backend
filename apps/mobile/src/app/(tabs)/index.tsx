import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Plus,
  Calendar,
  Layers,
  Banknote,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Building2
} from 'lucide-react-native';
import { apiClient } from '../../services/api';
import { useDraftStore } from '../../store/draftStore';
import { useAuthStore } from '../../store/authStore';
import { LumoraGradientText } from '../../components/LumoraGradientText';

export default function HomeDashboardScreen() {
  const router = useRouter();
  const { savedDrafts } = useDraftStore();
  const { user } = useAuthStore();

  const unsyncedCount = savedDrafts.length;
  const [leadList, setLeadList] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      apiClient.listLeads().then((res) => {
        if (!isMounted) return;
        if (res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
          setLeadList(list);

          // Map recent leads to activity events
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const mappedActivities = list.slice(0, 4).map((l: any) => {
            let timeStr = 'Recently';
            if (l.createdAt) {
              const d = new Date(l.createdAt);
              if (!isNaN(d.getTime())) {
                timeStr = `${months[d.getMonth()]} ${d.getDate()}`;
              }
            }
            return {
              title: `Registered: ${l.companyName}`,
              desc: l.needSummary ? l.needSummary.slice(0, 60) + '...' : `Stage: ${l.stage}`,
              time: timeStr,
              icon: Building2,
              color: l.stage === 'QUALIFIED' ? '#10B981' : '#4F75FF'
            };
          });
          setActivities(mappedActivities);
        }
      }).catch(() => {});

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const kpis = [
    { label: "Total Prospects", value: String(leadList.length), target: '30', pct: Math.min(100, Math.round((leadList.length / 30) * 100)), color: '#4F75FF' },
    { label: 'Approved Leads', value: String(leadList.filter((l) => l.stage === 'QUALIFIED').length), target: '10', pct: Math.min(100, Math.round((leadList.filter((l) => l.stage === 'QUALIFIED').length / 10) * 100)), color: '#8B5CF6' },
    { label: 'Pending Approval', value: String(leadList.filter((l) => l.stage === 'NEW').length), target: '5', pct: Math.min(100, Math.round((leadList.filter((l) => l.stage === 'NEW').length / 5) * 100)), color: '#E0A97D' },
    { label: 'Annual Clients', value: '0', target: '15', pct: 0, color: '#EC4899' }
  ];

  const quickActions = [
    { title: 'Add Lead', icon: Plus, color: '#4F75FF', route: '/s14-add-lead' },
    { title: 'Book Meeting', icon: Calendar, color: '#8B5CF6', route: '/s18-book-meeting' },
    { title: 'Sales Pipeline', icon: Layers, color: '#E0A97D', route: '/s21-pipeline' },
    { title: 'Pitch Guides', icon: Briefcase, color: '#EC4899', route: '/s12-services' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Banner */}
      <View style={styles.welcomeCard}>
        <View style={{ gap: 2 }}>
          <Text style={styles.partnerName}>
            {user?.fullName ? `Hello, ${user.fullName.split(' ')[0]} 👋` : 'Welcome Back 👋'}
          </Text>
          <LumoraGradientText
            text="Lumora's Partners • Business Development Global Network"
            fontSize={12}
            fontWeight="800"
            height={18}
          />
        </View>

        {unsyncedCount > 0 && (
          <TouchableOpacity
            onPress={() => router.push('/s34-offline-state')}
            style={styles.unsyncedBadge}
          >
            <AlertCircle size={14} color="#F59E0B" />
            <Text style={styles.unsyncedText}>{unsyncedCount} Unsynced Drafts</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 4 Core Benchmark Gauges */}
      <View style={styles.sectionHeader}>
        <TrendingUp size={16} color="#38BDF8" />
        <Text style={styles.sectionTitle}>Performance Activity Benchmarks</Text>
      </View>

      <View style={styles.kpiGrid}>
        {kpis.map((kpi, i) => (
          <View key={i} style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
            <View style={styles.kpiValueRow}>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
              <Text style={styles.kpiTarget}>/ {kpi.target}</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${kpi.pct}%`, backgroundColor: kpi.color }]} />
            </View>
          </View>
        ))}
      </View>

      {/* Quick Actions Shortcuts */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>

      <View style={styles.quickActionGrid}>
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              onPress={() => router.push(action.route as any)}
              style={styles.quickActionCard}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                <Icon size={20} color={action.color} />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Recent Activity Timeline */}
      <View style={styles.sectionHeaderBetween}>
        <View style={styles.sectionHeader}>
          <Clock size={16} color="#A855F7" />
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
      </View>

      <View style={styles.activityCard}>
        {activities.length === 0 ? (
          <View style={styles.emptyActivity}>
            <Text style={styles.emptyActivityTitle}>No Activity Recorded Yet</Text>
            <Text style={styles.emptyActivitySub}>
              As you register leads, schedule meetings, and win deals, your live event timeline will appear here.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/s14-add-lead')}
              style={styles.firstLeadBtn}
            >
              <Plus size={14} color="#FFFFFF" />
              <Text style={styles.firstLeadBtnText}>Add Your First Lead</Text>
            </TouchableOpacity>
          </View>
        ) : (
          activities.map((act, i) => {
            const Icon = act.icon;
            return (
              <View key={i} style={[styles.activityItem, i === activities.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={[styles.activityIconCircle, { backgroundColor: `${act.color}20` }]}>
                  <Icon size={16} color={act.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityItemTitle}>{act.title}</Text>
                  <Text style={styles.activityItemDesc}>{act.desc}</Text>
                </View>
                <Text style={styles.activityTime}>{act.time}</Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 80, gap: 16 },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  partnerName: { fontSize: 20, fontWeight: '900', color: '#0B0F26', letterSpacing: -0.3 },
  unsyncedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#FDE68A' },
  unsyncedText: { fontSize: 11, color: '#D97706', fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionHeaderBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#0B0F26', textTransform: 'uppercase', letterSpacing: 0.5 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpiCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  kpiLabel: { fontSize: 11, color: '#64748B', fontWeight: '700' },
  kpiValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  kpiValue: { fontSize: 22, fontWeight: '900', color: '#0B0F26' },
  kpiTarget: { fontSize: 11, color: '#94A3B8', fontWeight: 'bold' },
  progressBar: { height: 5, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  quickActionGrid: { flexDirection: 'row', gap: 10 },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  quickActionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quickActionTitle: { fontSize: 11, fontWeight: '700', color: '#334155', textAlign: 'center' },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  emptyActivity: { alignItems: 'center', justifyContent: 'center', paddingVertical: 26, gap: 8 },
  emptyActivityTitle: { fontSize: 14, fontWeight: 'bold', color: '#0B0F26' },
  emptyActivitySub: { fontSize: 12, color: '#64748B', textAlign: 'center', lineHeight: 18, maxWidth: 280 },
  firstLeadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#4F75FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginTop: 8 },
  firstLeadBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  activityItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  activityIconCircle: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  activityItemTitle: { fontSize: 13, fontWeight: '700', color: '#0B0F26' },
  activityItemDesc: { fontSize: 11, color: '#64748B' },
  activityTime: { fontSize: 10, color: '#94A3B8' }
});
