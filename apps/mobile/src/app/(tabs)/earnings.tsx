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
          <FileSpreadsheet size={18} color="#5B8EE2" />
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
          <View style={styles.tierIconBox}>
            <Banknote size={16} color="#5B8EE2" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tierTitle}>Productized Growth Diagnostic</Text>
            <Text style={styles.tierSub}>₹1,000 fixed payout upon client payment verification</Text>
          </View>
          <Text style={styles.tierEarned}>₹0</Text>
        </View>

        <View style={styles.tierItem}>
          <View style={[styles.tierIconBox, { backgroundColor: '#38BDF820' }]}>
            <TrendingUp size={16} color="#38BDF8" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tierTitle}>Core Custom Software / Retainer</Text>
            <Text style={styles.tierSub}>₹10,000 fixed or tiered percentage per service client</Text>
          </View>
          <Text style={styles.tierEarned}>₹0</Text>
        </View>

        <View style={styles.tierItem}>
          <View style={[styles.tierIconBox, { backgroundColor: '#A855F720' }]}>
            <Trophy size={16} color="#A855F7" />
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
          <Trophy size={18} color="#F59E0B" />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 80, gap: 14 },
  balanceCard: { backgroundColor: '#0B1026', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#1E294B', gap: 6 },
  balanceLabel: { fontSize: 11, color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  balanceValue: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  balanceSub: { fontSize: 12, color: '#64748B' },
  payoutStatusRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#132438', borderRadius: 10, padding: 12, marginTop: 10 },
  statusCol: { flex: 1, alignItems: 'center' },
  statusColLabel: { fontSize: 10, color: '#94A3B8', marginBottom: 2 },
  statusColValue: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
  statusColValueAmber: { fontSize: 13, fontWeight: 'bold', color: '#F59E0B' },
  statusColValueGreen: { fontSize: 13, fontWeight: 'bold', color: '#10B981' },
  divider: { width: 1, backgroundColor: '#1E294B' },
  ledgerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0B1026', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#1E294B' },
  ledgerBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ledgerBtnTitle: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
  ledgerBtnSub: { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  breakdownCard: { backgroundColor: '#0B1026', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1E294B', gap: 12 },
  sectionHeading: { fontSize: 13, fontWeight: 'bold', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: 0.5 },
  tierItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  tierIconBox: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#5B8EE215', alignItems: 'center', justifyContent: 'center' },
  tierTitle: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
  tierSub: { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  tierEarned: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  bonusCard: { backgroundColor: '#0B1026', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#F59E0B40', gap: 8 },
  bonusHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bonusTitle: { fontSize: 14, fontWeight: 'bold', color: '#F59E0B' },
  bonusDescription: { fontSize: 11, color: '#94A3B8', lineHeight: 16 },
  bonusProgressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  bonusProgressCount: { fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' },
  bonusProgressLabel: { fontSize: 11, color: '#64748B' },
  bonusProgressBar: { height: 6, backgroundColor: '#132438', borderRadius: 3, overflow: 'hidden' },
  bonusProgressFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 3 }
});
