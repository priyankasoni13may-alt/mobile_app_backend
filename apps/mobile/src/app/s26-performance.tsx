import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Award,
  Calendar,
  Sparkles,
  Zap,
  Target
} from 'lucide-react-native';
import { PoweredByFooter } from '../components/PoweredByFooter';
import { LumoraGradientText } from '../components/LumoraGradientText';

export default function PerformanceDashboardScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Annual Bonus Status Card */}
      <View style={styles.bonusBanner}>
        <View style={styles.rowBetween}>
          <View style={styles.bonusTag}>
            <Award size={14} color="#D97706" />
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
            <Text style={[styles.progressText, { color: '#D97706', fontWeight: '700' }]}>0% Achieved</Text>
          </View>
        </View>
      </View>

      {/* 4 Core Benchmark Gauges */}
      <Text style={styles.sectionHeader}>Activity Benchmarks</Text>
      <View style={styles.benchmarkGrid}>
        {/* Metric 1 */}
        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: '#EEF2FF' }]}>
            <Zap size={18} color="#4F75FF" />
          </View>
          <Text style={styles.metricLabel}>Daily Outreach</Text>
          <View style={styles.metricNumbers}>
            <Text style={styles.metricCurrent}>0</Text>
            <Text style={styles.metricTarget}>/ 30</Text>
          </View>
          <View style={styles.miniBar}>
            <View style={[styles.miniFill, { width: '0%', backgroundColor: '#4F75FF' }]} />
          </View>
          <Text style={styles.metricStatus}>0% of daily target</Text>
        </View>

        {/* Metric 2 */}
        <View style={styles.metricCard}>
          <View style={[styles.metricIconBox, { backgroundColor: '#F0FDF4' }]}>
            <Calendar size={18} color="#10B981" />
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
          <View style={[styles.metricIconBox, { backgroundColor: '#FAF5FF' }]}>
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
          <View style={[styles.metricIconBox, { backgroundColor: '#FDF2F8' }]}>
            <Target size={18} color="#EC4899" />
          </View>
          <Text style={styles.metricLabel}>Annual Clients</Text>
          <View style={styles.metricNumbers}>
            <Text style={styles.metricCurrent}>0</Text>
            <Text style={styles.metricTarget}>/ 15</Text>
          </View>
          <View style={styles.miniBar}>
            <View style={[styles.miniFill, { width: '0%', backgroundColor: '#EC4899' }]} />
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

      <PoweredByFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 40, gap: 16 },
  bonusBanner: { backgroundColor: '#FFFBEB', borderRadius: 16, borderWidth: 1, borderColor: '#FDE68A', padding: 18, gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bonusTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  bonusTagText: { color: '#B45309', fontSize: 11, fontWeight: '700' },
  bonusValue: { color: '#B45309', fontSize: 20, fontWeight: '800' },
  bonusTitle: { fontSize: 16, fontWeight: '700', color: '#0B0F26', marginTop: 4 },
  bonusSub: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  progressContainer: { gap: 6, marginTop: 4 },
  progressBar: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#D97706', borderRadius: 4 },
  progressText: { fontSize: 11, color: '#64748B' },
  sectionHeader: { fontSize: 14, fontWeight: '700', color: '#0B0F26', textTransform: 'uppercase', letterSpacing: 0.5 },
  benchmarkGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', padding: 14, gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  metricIconBox: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  metricLabel: { fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 2 },
  metricNumbers: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  metricCurrent: { fontSize: 22, fontWeight: '800', color: '#0B0F26' },
  metricTarget: { fontSize: 13, color: '#94A3B8', fontWeight: '700' },
  miniBar: { height: 4, backgroundColor: '#F1F5F9', borderRadius: 2, overflow: 'hidden', marginVertical: 4 },
  miniFill: { height: '100%', borderRadius: 2 },
  metricStatus: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', padding: 16, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  cardHeading: { fontSize: 15, fontWeight: '700', color: '#0B0F26' },
  ratioRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratioTitle: { fontSize: 13, fontWeight: '600', color: '#0B0F26' },
  ratioSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  ratioPercent: { fontSize: 18, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  rankCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#F8FAFC', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', padding: 16 },
  rankBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  rankNumber: { fontSize: 18, fontWeight: '800', color: '#4F75FF' },
  rankTitle: { fontSize: 14, fontWeight: '700', color: '#0B0F26' },
  rankSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2, lineHeight: 17 }
});
