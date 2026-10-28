import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CreditCard,
  ArrowRight
} from 'lucide-react-native';
import { LumoraButton } from '../components/LumoraButton';
import { PoweredByFooter } from '../components/PoweredByFooter';

export default function DiagnosticOfferScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const leadId = (params.leadId as string) || '';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Price Header */}
      <View style={styles.heroCard}>
        <Text style={styles.packageTag}>Productized Diagnostic Engagement</Text>
        <Text style={styles.title}>Shared Business Growth & Technology Diagnostic</Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceAmount}>₹37,000</Text>
          <Text style={styles.taxNote}>+ Applicable GST (18%)</Text>
        </View>

        <View style={styles.incentivePill}>
          <Text style={styles.incentiveText}>Partner Incentive on Closure: ₹1,000</Text>
        </View>
      </View>

      {/* Mandatory Commercial Governance Disclaimer */}
      <View style={styles.disclaimerBox}>
        <AlertTriangle size={16} color="#D97706" />
        <Text style={styles.disclaimerText}>
          Commercial Notice: Treat price, taxes, scope, duration, and deliverables as configurable commercial proposals awaiting formal business contract execution. Never represent proposed commercial terms as formally approved.
        </Text>
      </View>

      {/* Core Deliverables */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>Key Diagnostic Deliverables</Text>
        {[
          '1. Brand Architecture & Positioning Review',
          '2. Omnichannel Funnel & SEO Conversion Audit',
          '3. Core Tech Stack, Database & Security Health Check',
          '4. Executive Roadmap Presentation with prioritized action ROI'
        ].map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <CheckCircle2 size={16} color="#10B981" />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            Alert.alert('Proposal Dispatched', 'Diagnostic proposal link generated for client.');
          }}
          style={styles.proposalBtn}
        >
          <FileText size={18} color="#0B0F26" />
          <Text style={styles.proposalBtnText}>Generate & Send Client Proposal</Text>
        </TouchableOpacity>

        <LumoraButton
          title="Submit Client Payment Evidence"
          onPress={() => router.push({ pathname: '/s23-service-deal', params: { leadId, amount: '37000' } })}
          icon={<CreditCard size={18} color="#FFFFFF" />}
          size="lg"
        />
      </View>

      <PoweredByFooter style={{ marginTop: 24, marginBottom: 10 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 60, gap: 14 },
  heroCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', padding: 20, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  packageTag: { fontSize: 11, fontWeight: 'bold', color: '#4F75FF', textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0B0F26', lineHeight: 24 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 },
  priceAmount: { fontSize: 32, fontWeight: '800', color: '#0B0F26' },
  taxNote: { fontSize: 12, color: '#64748B' },
  incentivePill: { alignSelf: 'flex-start', backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, marginTop: 4, borderWidth: 1, borderColor: '#A7F3D0' },
  incentiveText: { fontSize: 11, fontWeight: 'bold', color: '#059669' },
  disclaimerBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#FFFBEB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FDE68A' },
  disclaimerText: { fontSize: 11, color: '#B45309', flex: 1, lineHeight: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', padding: 16, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  cardHeading: { fontSize: 13, fontWeight: 'bold', color: '#0B0F26', marginBottom: 4 },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  itemText: { fontSize: 12, color: '#334155', flex: 1, lineHeight: 18 },
  actions: { gap: 12, marginTop: 6 },
  proposalBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#F1F5F9', height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  proposalBtnText: { fontSize: 13, fontWeight: 'bold', color: '#0B0F26' }
});
