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
  ShieldCheck,
  Users,
  AlertTriangle,
  DollarSign,
  FileCheck2,
  ExternalLink
} from 'lucide-react-native';
import { LumoraButton } from '../components/LumoraButton';
import { PoweredByFooter } from '../components/PoweredByFooter';

export default function MobileAdminOverviewScreen() {
  const router = useRouter();

  const handleOpenWebConsole = () => {
    Alert.alert(
      'Web Admin Console',
      'For complex bulk actions, data export, or audit queries, log in to the full desktop console at http://localhost:3000.'
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Executive Notice */}
      <View style={styles.banner}>
        <View style={styles.iconCircle}>
          <ShieldCheck size={22} color="#4F75FF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Executive Control Mobile Snapshot</Text>
          <Text style={styles.bannerSub}>
            Real-time operations, compliance, and financial approvals pipeline for Lumora & Cypher Swift management.
          </Text>
        </View>
      </View>

      {/* KPI Exceptions Grid */}
      <Text style={styles.sectionHeader}>Pending Management Actions</Text>
      <View style={styles.grid}>
        {/* Card 1 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => Alert.alert('Partner Queue', 'Partner applications awaiting ID and background verification.')}
          style={styles.card}
        >
          <View style={styles.rowBetween}>
            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
              <Users size={18} color="#4F75FF" />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>High Priority</Text>
            </View>
          </View>
          <Text style={styles.countText}>0</Text>
          <Text style={styles.labelText}>Partner Applications</Text>
          <Text style={styles.subText}>No applications pending</Text>
        </TouchableOpacity>

        {/* Card 2 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => Alert.alert('Duplicate Claims', 'Zero domain conflicts in arbitration queue.')}
          style={styles.card}
        >
          <View style={styles.rowBetween}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
              <AlertTriangle size={18} color="#D97706" />
            </View>
            <View style={[styles.badge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.badgeText, { color: '#10B981' }]}>Clean</Text>
            </View>
          </View>
          <Text style={styles.countText}>0</Text>
          <Text style={styles.labelText}>Lead Claim Conflicts</Text>
          <Text style={styles.subText}>No disputes pending</Text>
        </TouchableOpacity>

        {/* Card 3 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => Alert.alert('Payment Verifications', 'No client deposit bank receipts awaiting validation.')}
          style={styles.card}
        >
          <View style={styles.rowBetween}>
            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
              <FileCheck2 size={18} color="#4F75FF" />
            </View>
            <View style={[styles.badge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.badgeText, { color: '#10B981' }]}>Current</Text>
            </View>
          </View>
          <Text style={styles.countText}>0</Text>
          <Text style={styles.labelText}>Payment Evidence</Text>
          <Text style={styles.subText}>Zero pending reconciliations</Text>
        </TouchableOpacity>

        {/* Card 4 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => Alert.alert('Commissions', 'All eligible commissions processed.')}
          style={styles.card}
        >
          <View style={styles.rowBetween}>
            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
              <DollarSign size={18} color="#10B981" />
            </View>
            <View style={[styles.badge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.badgeText, { color: '#10B981' }]}>Cleared</Text>
            </View>
          </View>
          <Text style={styles.countText}>₹0</Text>
          <Text style={styles.labelText}>Eligible Commissions</Text>
          <Text style={styles.subText}>0 pending review</Text>
        </TouchableOpacity>
      </View>

      {/* Direct Desktop Console Link */}
      <View style={styles.desktopCard}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.desktopTitle}>Full Web Administrative Console</Text>
          <Text style={styles.desktopSub}>
            Access all 14 administrative modules: Partner CMS, Service Catalogue, Commission Policies, Audit Diffs, and CSV Exports.
          </Text>
        </View>
        <LumoraButton
          title="Open Console"
          onPress={handleOpenWebConsole}
          icon={<ExternalLink size={16} color="#FFFFFF" />}
        />
      </View>

      <PoweredByFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 40, gap: 16 },
  banner: { flexDirection: 'row', gap: 12, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', alignItems: 'center' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { fontSize: 15, fontWeight: '700', color: '#0B0F26' },
  bannerSub: { fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 17 },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: '#0B0F26', textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', padding: 14, gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBox: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badge: { backgroundColor: '#EEF2FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#4F75FF' },
  countText: { fontSize: 24, fontWeight: '800', color: '#0B0F26', marginTop: 4 },
  labelText: { fontSize: 13, fontWeight: '700', color: '#334155' },
  subText: { fontSize: 11, color: '#94A3B8' },
  desktopCard: { backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', padding: 16, gap: 14 },
  desktopTitle: { fontSize: 15, fontWeight: '700', color: '#0B0F26' },
  desktopSub: { fontSize: 12, color: '#64748B', lineHeight: 18 }
});
