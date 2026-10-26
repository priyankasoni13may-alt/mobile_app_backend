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
  TrendingUp,
  Target,
  Award,
  Users,
  Calendar,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronRight
} from 'lucide-react-native';

export default function PerformanceDashboardScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<'MONTH' | 'QUARTER' | 'YEAR'>('MONTH');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Annual Bonus Status Card */}
      <View style={styles.bonusBanner}>
        <View style={styles.rowBetween}>
          <View style={styles.bonusTag}>
            <Award size={14} color="#F59E0B" />
            <Text style={styles.bonusTagText}>Annual Performance Bonus Track</Text>
          </View>
          <Text style={styles.bonusValue}>₹1,00,000</Text>
        </View>

        <Text style={styles.bonusTitle}>15 Qualified Client Closures Goal</Text>
        <Text style={styles.bonusSub}>Complete 15 closed client engagements this calendar year to unlock the annual incentive bonus.</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '0%' }]} />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.progressText}>0 of 15 Clients Closed</Text>
            <Text style={[styles.progressText, { color: '#F59E0B', fontWeight: 'bold' }]}>0% Achieved</Text>
          </View>
        </View>
      </View>

      {/* 4 Core Benchmark Gauges */}
      <Text style={styles.sectionHeader}>Activity Benchmarks</Text>
      <View style={styles.benchmarkGrid}>
        {/* Metric 1 */}
        <View style={styles.metricCard}>
          <View style={styles.metricIconBox}>
            <Zap size={18} color="#5B8EE2" />
          </View>
          <Text style={styles.metricLabel}>Daily Outreach</Text>
          <View style={styles.metricNumbers}>
            <Text style={styles.metricCurrent}>0</Text>
            <Text style={styles.metricTarget}>/ 30</Text>
          </View>
          <View style={styles.miniBar}>
            <View style={[styles.miniFill, { width: '0%', backgroundColor: '#5B8EE2' }]} />
          </View>
          <Text style={styles.metricStatus}>0% of daily target</Text>
        </View>

        {/* Metric 2 */}
        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: '#8CB4F515' }]}>
            <Calendar size={18} color="#8CB4F5" />
          </View>
          <Text style={styles.metricLabel}>Weekly Meetings</Text>
          <View style={styles.metricNumbers}>
            <Text style={styles.metricCurrent}>0</Text>
            <Text style={styles.metricTarget}>/ 3</Text>
          </View>
          <View style={styles.miniBar}>
            <View style={[styles.miniFill, { width: '0%', backgroundColor: '#10B981' }]} />
          </View>
          <Text style={styles.metricStatus}>Schedule your first meeting</Text>
        </View>

        {/* Metric 3 */}
        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: '#8B5CF615' }]}>
            <Sparkles size={18} color="#8B5CF6" />
          </View>
          <Text style={styles.metricLabel}>Monthly Diagnostics</Text>
          <View style={styles.metricNumbers}>
            <Text style={styles.metricCurrent}>0</Text>
            <Text style={styles.metricTarget}>/ 3</Text>
          </View>
          <View style={styles.miniBar}>
            <View style={[styles.miniFill, { width: '0%', backgroundColor: '#8B5CF6' }]} />
          </View>
          <Text style={styles.metricStatus}>3 needed to hit goal</Text>
        </View>

        {/* Metric 4 */}
        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: '#10B98115' }]}>
            <Target size={18} color="#10B981" />
          </View>
          <Text style={styles.metricLabel}>Annual Clients</Text>
          <View style={styles.metricNumbers}>
            <Text style={styles.metricCurrent}>0</Text>
            <Text style={styles.metricTarget}>/ 15</Text>
          </View>
          <View style={styles.miniBar}>
            <View style={[styles.miniFill, { width: '0%', backgroundColor: '#10B981' }]} />
          </View>
          <Text style={styles.metricStatus}>15 needed for bonus</Text>
        </View>
      </View>

      {/* Conversion Funnel Ratios */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>Pipeline Conversion Ratios</Text>
        
        <View style={styles.ratioRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ratioTitle}>Prospect to Discovery Meeting</Text>
            <Text style={styles.ratioSub}>Industry benchmark: 10%</Text>
          </View>
          <Text style={[styles.ratioPercent, { color: '#64748B' }]}>0.0%</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.ratioRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ratioTitle}>Meeting to Diagnostic Order</Text>
            <Text style={styles.ratioSub}>Industry benchmark: 30%</Text>
          </View>
          <Text style={[styles.ratioPercent, { color: '#64748B' }]}>0.0%</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.ratioRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ratioTitle}>Diagnostic to Service Contract</Text>
            <Text style={styles.ratioSub}>Industry benchmark: 40%</Text>
          </View>
          <Text style={[styles.ratioPercent, { color: '#64748B' }]}>0.0%</Text>
        </View>
      </View>

      {/* Network Ranking Badge */}
      <View style={styles.rankCard}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankNumber}>--</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rankTitle}>Partner Network Onboarding</Text>
          <Text style={styles.rankSubtitle}>Complete your first discovery meeting and diagnostic conversion to enter the network leaderboards.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 60, gap: 16 },
  bonusBanner: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#F59E0B60', padding: 18, gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bonusTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F59E0B20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  bonusTagText: { color: '#F59E0B', fontSize: 11, fontWeight: '700' },
  bonusValue: { color: '#F59E0B', fontSize: 20, fontWeight: '800' },
  bonusTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginTop: 4 },
  bonusSub: { fontSize: 12, color: '#94A3B8', lineHeight: 18 },
  progressContainer: { gap: 6, marginTop: 4 },
  progressBar: { height: 8, backgroundColor: '#1E293B', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 4 },
  progressText: { fontSize: 11, color: '#94A3B8' },
  sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: 0.5 },
  benchmarkGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { width: '48%', backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', padding: 14, gap: 6 },
  metricIconBox: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#5B8EE215', alignItems: 'center', justifyContent: 'center' },
  metricLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600', marginTop: 2 },
  metricNumbers: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  metricCurrent: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  metricTarget: { fontSize: 13, color: '#64748B', fontWeight: 'bold' },
  miniBar: { height: 4, backgroundColor: '#1E293B', borderRadius: 2, overflow: 'hidden', marginVertical: 4 },
  miniFill: { height: '100%', borderRadius: 2 },
  metricStatus: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  card: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 16, gap: 12 },
  cardHeading: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  ratioRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratioTitle: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  ratioSub: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  ratioPercent: { fontSize: 18, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#1E293B' },
  rankCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#132438', borderRadius: 12, borderWidth: 1, borderColor: '#8CB4F540', padding: 16 },
  rankBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1E294B', alignItems: 'center', justifyContent: 'center' },
  rankNumber: { fontSize: 18, fontWeight: '800', color: '#94A3B8' },
  rankTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  rankSubtitle: { fontSize: 11, color: '#94A3B8', marginTop: 2, lineHeight: 16 }
});
