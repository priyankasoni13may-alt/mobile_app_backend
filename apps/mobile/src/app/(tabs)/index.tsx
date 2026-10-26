import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
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
  AlertCircle
} from 'lucide-react-native';
import { useDraftStore } from '../../store/draftStore';
import { useAuthStore } from '../../store/authStore';

export default function HomeDashboardScreen() {
  const router = useRouter();
  const { savedDrafts } = useDraftStore();
  const { user } = useAuthStore();

  const unsyncedCount = savedDrafts.length;

  const kpis = [
    { label: "Today's Outreach", value: '0', target: '30', pct: 0, color: '#38BDF8' },
    { label: 'Weekly Meetings', value: '0', target: '3', pct: 0, color: '#A855F7' },
    { label: 'Monthly Diagnostics', value: '0', target: '3', pct: 0, color: '#5B8EE2' },
    { label: 'Annual Clients', value: '0', target: '15', pct: 0, color: '#10B981' }
  ];

  const quickActions = [
    { title: 'Add Lead', icon: Plus, color: '#5B8EE2', route: '/s14-add-lead' },
    { title: 'Book Meeting', icon: Calendar, color: '#38BDF8', route: '/s18-book-meeting' },
    { title: 'Sales Pipeline', icon: Layers, color: '#A855F7', route: '/s21-pipeline' },
    { title: 'Pitch Guides', icon: Briefcase, color: '#F59E0B', route: '/s12-services' }
  ];

  const [activities, setActivities] = useState<any[]>([]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Banner */}
      <View style={styles.welcomeCard}>
        <View>
          <Text style={styles.partnerName}>
            Hello, {user?.fullName?.split(' ')[0] || 'Partner'} 👋
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Lumora + Cypher Swift Business Development Network
          </Text>
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
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 80, gap: 16 },
  welcomeCard: { backgroundColor: '#0B1026', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1E294B', gap: 10 },
  partnerName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  welcomeSubtitle: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  unsyncedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F59E0B15', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#F59E0B40' },
  unsyncedText: { fontSize: 11, color: '#F59E0B', fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionHeaderBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: 0.5 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpiCard: { width: '48%', backgroundColor: '#0B1026', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1E294B', gap: 6 },
  kpiLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  kpiValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  kpiValue: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  kpiTarget: { fontSize: 11, color: '#64748B', fontWeight: 'bold' },
  progressBar: { height: 4, backgroundColor: '#132438', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  quickActionGrid: { flexDirection: 'row', gap: 10 },
  quickActionCard: { flex: 1, backgroundColor: '#0B1026', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1E294B', alignItems: 'center', gap: 8 },
  quickActionIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  quickActionTitle: { fontSize: 11, fontWeight: 'bold', color: '#CBD5E1', textAlign: 'center' },
  activityCard: { backgroundColor: '#0B1026', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1E294B' },
  emptyActivity: { alignItems: 'center', justifyContent: 'center', paddingVertical: 30, gap: 8 },
  emptyActivityTitle: { fontSize: 14, fontWeight: 'bold', color: '#CBD5E1' },
  emptyActivitySub: { fontSize: 11, color: '#64748B', textAlign: 'center', lineHeight: 16, maxWidth: 260 },
  firstLeadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#5B8EE2', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, marginTop: 6 },
  firstLeadBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  activityItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#132438' },
  activityIconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  activityItemTitle: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  activityItemDesc: { fontSize: 11, color: '#94A3B8' },
  activityTime: { fontSize: 10, color: '#64748B' }
});
