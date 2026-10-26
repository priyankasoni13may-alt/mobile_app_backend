import React, { useState } from 'react';
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

export default function DiagnosticOfferScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const leadId = (params.leadId as string) || 'lead-01-techcorp';

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
        <AlertTriangle size={16} color="#F59E0B" />
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
            Alert.alert('Proposal Dispatched', 'Diagnostic proposal PDF link generated for client.');
          }}
          style={styles.proposalBtn}
        >
          <FileText size={18} color="#FFFFFF" />
          <Text style={styles.proposalBtnText}>Generate & Send Client Proposal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: '/s23-service-deal', params: { dealId: 'deal-01-technova', amount: '37000' } })}
          style={styles.paymentBtn}
        >
          <CreditCard size={18} color="#FFFFFF" />
          <Text style={styles.paymentBtnText}>Submit Client Payment Evidence</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 60, gap: 14 },
  heroCard: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#5B8EE2', padding: 20, gap: 8 },
  packageTag: { fontSize: 10, fontWeight: 'bold', color: '#5B8EE2', textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 },
  priceAmount: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  taxNote: { fontSize: 11, color: '#94A3B8' },
  incentivePill: { alignSelf: 'flex-start', backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginTop: 4 },
  incentiveText: { fontSize: 11, fontWeight: 'bold', color: '#10B981' },
  disclaimerBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)' },
  disclaimerText: { fontSize: 11, color: '#F59E0B', flex: 1, lineHeight: 16 },
  card: { backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', padding: 16, gap: 10 },
  cardHeading: { fontSize: 13, fontWeight: 'bold', color: '#CBD5E1', marginBottom: 4 },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  itemText: { fontSize: 12, color: '#FFFFFF', flex: 1, lineHeight: 18 },
  actions: { gap: 10, marginTop: 6 },
  proposalBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#101735', height: 48, borderRadius: 10, borderWidth: 1, borderColor: '#1E294B' },
  proposalBtnText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
  paymentBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#5B8EE2', height: 48, borderRadius: 10 },
  paymentBtnText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }
});
