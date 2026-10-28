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
  Banknote,
  TrendingUp,
  Clock,
  CheckCircle2,
  Trophy,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react-native';
import { PoweredByFooter } from '../../components/PoweredByFooter';

export default function EarningsTabScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState('ALL_TIME');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Total Earnings Balance Header */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Qualified Earnings</Text>
        <Text style={styles.balanceValue}>₹0</Text>
        <Text style={styles.balanceSub}>0 Diagnostic Closures + 0 Service Retainers</Text>

        <View style={styles.payoutStatusRow}>
          <View style={styles.statusCol}>
            <Text style={styles.statusColLabel}>Pending Review</Text>
            <Text style={styles.statusColValueAmber}>₹0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statusCol}>
            <Text style={styles.statusColLabel}>Approved</Text>
            <Text style={styles.statusColValueGreen}>₹0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statusCol}>
            <Text style={styles.statusColLabel}>Disbursed / Paid</Text>
            <Text style={styles.statusColValue}>₹0</Text>
          </View>
        </View>
      </View>

      {/* Button to Open Immutable Transaction Ledger */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/s25-earnings-ledger')}
        style={styles.ledgerButton}
      >
        <View style={styles.ledgerBtnLeft}>
          <View style={styles.ledgerIconCircle}>
            <FileSpreadsheet size={18} color="#4F75FF" />
          </View>
          <View>
            <Text style={styles.ledgerBtnTitle}>View Immutable Transaction Ledger</Text>
            <Text style={styles.ledgerBtnSub}>Append-only audit trail with policy versions</Text>
          </View>
        </View>
        <ArrowRight size={16} color="#94A3B8" />
      </TouchableOpacity>

      {/* Incentive Breakdown Summary */}
      <View style={styles.breakdownCard}>
        <Text style={styles.sectionHeading}>Incentive Structure Overview</Text>

        <View style={styles.tierItem}>
          <View style={[styles.tierIconBox, { backgroundColor: '#EFF6FF' }]}>
            <Banknote size={16} color="#4F75FF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tierTitle}>Productized Growth Diagnostic</Text>
            <Text style={styles.tierSub}>₹1,000 fixed payout upon client payment verification</Text>
          </View>
          <Text style={styles.tierEarned}>₹0</Text>
        </View>

        <View style={styles.tierItem}>
          <View style={[styles.tierIconBox, { backgroundColor: '#FDF4FF' }]}>
            <TrendingUp size={16} color="#EC4899" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tierTitle}>Core Custom Software / Retainer</Text>
            <Text style={styles.tierSub}>₹10,000 fixed or tiered percentage per service client</Text>
          </View>
          <Text style={styles.tierEarned}>₹0</Text>
        </View>

        <View style={styles.tierItem}>
          <View style={[styles.tierIconBox, { backgroundColor: '#FAF5FF' }]}>
            <Trophy size={16} color="#8B5CF6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tierTitle}>Annual Milestone Bonus</Text>
            <Text style={styles.tierSub}>₹1,00,000 lump sum for 15 closed clients in calendar year</Text>
          </View>
          <Text style={styles.tierEarned}>₹0</Text>
        </View>
      </View>

      {/* Annual Bonus Progress Card */}
      <View style={styles.bonusCard}>
        <View style={styles.bonusHeader}>
          <Trophy size={18} color="#D97706" />
          <Text style={styles.bonusTitle}>2026 Annual Bonus Progress</Text>
        </View>
        <Text style={styles.bonusDescription}>
          Close 15 qualified client engagements before Dec 31, 2026 to unlock your ₹1,00,000 achievement bonus.
        </Text>

        <View style={styles.bonusProgressRow}>
          <Text style={styles.bonusProgressCount}>0 of 15</Text>
          <Text style={styles.bonusProgressLabel}>Closed Clients (0%)</Text>
        </View>
        <View style={styles.bonusProgressBar}>
          <View style={[styles.bonusProgressFill, { width: '0%' }]} />
        </View>
      </View>

      <PoweredByFooter style={{ marginTop: 24, marginBottom: 10 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 80, gap: 14 },
  balanceCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#EEF2F6', gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  balanceLabel: { fontSize: 11, color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  balanceValue: { fontSize: 34, fontWeight: '800', color: '#0B0F26' },
  balanceSub: { fontSize: 12, color: '#64748B' },
  payoutStatusRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, marginTop: 12, borderWidth: 1, borderColor: '#EEF2F6' },
  statusCol: { flex: 1, alignItems: 'center' },
  statusColLabel: { fontSize: 10, color: '#64748B', marginBottom: 2 },
  statusColValue: { fontSize: 13, fontWeight: 'bold', color: '#0B0F26' },
  statusColValueAmber: { fontSize: 13, fontWeight: 'bold', color: '#D97706' },
  statusColValueGreen: { fontSize: 13, fontWeight: 'bold', color: '#10B981' },
  divider: { width: 1, backgroundColor: '#EEF2F6' },
  ledgerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#EEF2F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  ledgerBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ledgerIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  ledgerBtnTitle: { fontSize: 13, fontWeight: 'bold', color: '#0B0F26' },
  ledgerBtnSub: { fontSize: 11, color: '#64748B', marginTop: 1 },
  breakdownCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#EEF2F6', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  sectionHeading: { fontSize: 12, fontWeight: 'bold', color: '#0B0F26', textTransform: 'uppercase', letterSpacing: 0.5 },
  tierItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  tierIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tierTitle: { fontSize: 13, fontWeight: 'bold', color: '#0B0F26' },
  tierSub: { fontSize: 11, color: '#64748B', marginTop: 1 },
  tierEarned: { fontSize: 14, fontWeight: 'bold', color: '#0B0F26' },
  bonusCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#FEF3C7', gap: 8, shadowColor: '#D97706', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  bonusHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bonusTitle: { fontSize: 14, fontWeight: 'bold', color: '#D97706' },
  bonusDescription: { fontSize: 12, color: '#475569', lineHeight: 18 },
  bonusProgressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  bonusProgressCount: { fontSize: 12, fontWeight: 'bold', color: '#0B0F26' },
  bonusProgressLabel: { fontSize: 11, color: '#64748B' },
  bonusProgressBar: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  bonusProgressFill: { height: '100%', backgroundColor: '#4F75FF', borderRadius: 3 }
});
