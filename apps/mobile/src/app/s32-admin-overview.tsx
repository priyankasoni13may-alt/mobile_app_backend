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
  ExternalLink,
  ChevronRight,
  BarChart3
} from 'lucide-react-native';

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
        <ShieldCheck size={20} color="#5B8EE2" />
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
          onPress={() => Alert.alert('Partner Queue', '3 partner applications awaiting ID and background verification.')}
          style={styles.card}
        >
          <View style={styles.rowBetween}>
            <View style={[styles.iconBox, { backgroundColor: '#5B8EE215' }]}>
              <Users size={18} color="#5B8EE2" />
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
            <View style={[styles.iconBox, { backgroundColor: '#F59E0B15' }]}>
              <AlertTriangle size={18} color="#F59E0B" />
            </View>
            <View style={[styles.badge, { backgroundColor: '#10B98120' }]}>
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
            <View style={[styles.iconBox, { backgroundColor: '#8CB4F515' }]}>
              <FileCheck2 size={18} color="#8CB4F5" />
            </View>
            <View style={[styles.badge, { backgroundColor: '#10B98120' }]}>
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
            <View style={[styles.iconBox, { backgroundColor: '#10B98115' }]}>
              <DollarSign size={18} color="#10B981" />
            </View>
            <View style={[styles.badge, { backgroundColor: '#10B98120' }]}>
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
        <TouchableOpacity onPress={handleOpenWebConsole} style={styles.desktopBtn}>
          <ExternalLink size={18} color="#FFFFFF" />
          <Text style={styles.desktopBtnText}>Open Console</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 60, gap: 16 },
  banner: { flexDirection: 'row', gap: 12, backgroundColor: '#0B1026', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#5B8EE240' },
  bannerTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  bannerSub: { fontSize: 11, color: '#94A3B8', marginTop: 4, lineHeight: 16 },
  sectionHeader: { fontSize: 13, fontWeight: 'bold', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', padding: 14, gap: 4 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badge: { backgroundColor: '#5B8EE220', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 9, fontWeight: 'bold', color: '#5B8EE2' },
  countText: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginTop: 4 },
  labelText: { fontSize: 12, fontWeight: '700', color: '#E2E8F0' },
  subText: { fontSize: 10, color: '#64748B' },
  desktopCard: { backgroundColor: '#132438', borderRadius: 12, borderWidth: 1, borderColor: '#8CB4F540', padding: 16, gap: 12 },
  desktopTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  desktopSub: { fontSize: 11, color: '#94A3B8', lineHeight: 16 },
  desktopBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#003566', paddingVertical: 10, borderRadius: 8 },
  desktopBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 }
});
