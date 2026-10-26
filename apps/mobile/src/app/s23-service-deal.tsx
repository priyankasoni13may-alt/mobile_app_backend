import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Briefcase,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Upload,
  Calendar,
  Building,
  DollarSign
} from 'lucide-react-native';

export default function ServiceDealScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dealId = (params.dealId as string) || 'deal-srv-01';

  const [contractSigned, setContractSigned] = useState(false);
  const [evidenceSubmitted, setEvidenceSubmitted] = useState(false);
  const [closureSubmitted, setClosureSubmitted] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmitEvidence = () => {
    if (!paymentRef.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid bank reference or transaction ID.');
      return;
    }
    setEvidenceSubmitted(true);
    Alert.alert('Payment Evidence Submitted', `Transaction ${paymentRef} submitted for finance verification. Partner incentive will be credited upon confirmation.`);
  };

  const handleSubmitClosure = () => {
    if (!contractSigned || !evidenceSubmitted) {
      Alert.alert('Prerequisites Incomplete', 'Both signed contract and verified payment evidence are required before requesting closure review.');
      return;
    }
    setClosureSubmitted(true);
    Alert.alert('Closure Review Submitted', 'Operations and Finance will review this deal for closure and calculate corresponding commission.');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header Info */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.tag}>
            <Briefcase size={12} color="#8CB4F5" />
            <Text style={styles.tagText}>Cypher Swift Custom Software</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: closureSubmitted ? '#10B98120' : '#5B8EE220' }]}>
            <Text style={[styles.statusText, { color: closureSubmitted ? '#10B981' : '#5B8EE2' }]}>
              {closureSubmitted ? 'CLOSURE IN REVIEW' : 'CONTRACT EXECUTION'}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Enterprise Workflow Automation & AI Agent Deployment</Text>
        <Text style={styles.clientSubtitle}>Lead: Apex Logistics Solutions Ltd</Text>

        <View style={styles.dealMetrics}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Total Contract Value</Text>
            <Text style={styles.metricValue}>₹5,00,000</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Expected Partner Incentive</Text>
            <Text style={[styles.metricValue, { color: '#10B981' }]}>₹10,000</Text>
          </View>
        </View>
      </View>

      {/* Commercial Terms & Milestones */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Commercial Milestones</Text>
        <View style={styles.milestoneItem}>
          <View style={styles.milestoneDot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.milestoneName}>Milestone 1: Project Kickoff & Architecture (50%)</Text>
            <Text style={styles.milestoneAmount}>₹2,50,000 • Due Upon Signing</Text>
          </View>
          <Text style={[styles.badgeText, { color: evidenceSubmitted ? '#10B981' : '#F59E0B' }]}>
            {evidenceSubmitted ? 'Evidence In Review' : 'Pending Payment'}
          </Text>
        </View>

        <View style={styles.milestoneItem}>
          <View style={[styles.milestoneDot, { backgroundColor: '#64748B' }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.milestoneName}>Milestone 2: Beta Delivery & Acceptance (50%)</Text>
            <Text style={styles.milestoneAmount}>₹2,50,000 • In 60 Days</Text>
          </View>
          <Text style={[styles.badgeText, { color: '#64748B' }]}>Scheduled</Text>
        </View>
      </View>

      {/* Contract Verification */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>1. Client Contract Verification</Text>
        <Text style={styles.hint}>Confirm that the master service agreement (MSA) has been digitally signed by the authorized decision-maker.</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setContractSigned(!contractSigned)}
          style={[styles.checkboxRow, contractSigned && styles.checkboxActive]}
        >
          <View style={[styles.checkbox, contractSigned && styles.checkedBox]}>
            {contractSigned && <CheckCircle2 size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>MSA Signed by Authorized Signatory</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Evidence Submission */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>2. Submit Milestone Payment Evidence</Text>
        <Text style={styles.hint}>Enter the bank reference or UTR number of the client deposit. Finance will cross-check with bank statements.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bank UTR / Transaction Reference</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. UTR / NEFT Reference Number"
            placeholderTextColor="#64748B"
            value={paymentRef}
            onChangeText={setPaymentRef}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount Deposited (INR)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 50000"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
            value={amountPaid}
            onChangeText={setAmountPaid}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmitEvidence}
          style={[styles.actionBtn, { backgroundColor: '#003566' }]}
        >
          <Upload size={18} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>{evidenceSubmitted ? 'Update Evidence' : 'Submit Payment Evidence'}</Text>
        </TouchableOpacity>
      </View>

      {/* Final Closure Submission */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSubmitClosure}
        disabled={closureSubmitted}
        style={[styles.primaryBtn, closureSubmitted && { backgroundColor: '#1E293B' }]}
      >
        <FileCheck2 size={20} color="#FFFFFF" />
        <Text style={styles.primaryBtnText}>
          {closureSubmitted ? 'Closure Request Submitted' : 'Submit Deal for Closure Review'}
        </Text>
      </TouchableOpacity>

      <View style={styles.disclaimerBox}>
        <AlertCircle size={16} color="#F59E0B" />
        <Text style={styles.disclaimerText}>
          Commissions are generated inside an isolated database transaction upon Finance approval. Partners cannot self-approve payouts.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 60, gap: 14 },
  card: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 16, gap: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#8CB4F515', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  tagText: { color: '#8CB4F5', fontSize: 11, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginTop: 4 },
  clientSubtitle: { fontSize: 12, color: '#94A3B8' },
  dealMetrics: { flexDirection: 'row', gap: 12, marginTop: 8 },
  metricBox: { flex: 1, backgroundColor: '#132438', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#1E3A5F' },
  metricLabel: { fontSize: 11, color: '#94A3B8' },
  metricValue: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  hint: { fontSize: 12, color: '#94A3B8', lineHeight: 18 },
  milestoneItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  milestoneDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#5B8EE2' },
  milestoneName: { fontSize: 12, fontWeight: '600', color: '#E2E8F0' },
  milestoneAmount: { fontSize: 11, color: '#94A3B8' },
  badgeText: { fontSize: 11, fontWeight: '600' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#132438', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#1E294B' },
  checkboxActive: { borderColor: '#10B981', backgroundColor: '#10B98110' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#64748B', alignItems: 'center', justifyContent: 'center' },
  checkedBox: { backgroundColor: '#10B981', borderColor: '#10B981' },
  checkboxLabel: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#CBD5E1' },
  input: { backgroundColor: '#070B19', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#FFFFFF', fontSize: 14 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 8, marginTop: 4 },
  actionBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#5B8EE2', paddingVertical: 14, borderRadius: 10 },
  primaryBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  disclaimerBox: { flexDirection: 'row', gap: 10, backgroundColor: '#F59E0B15', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#F59E0B40' },
  disclaimerText: { flex: 1, fontSize: 11, color: '#FCD34D', lineHeight: 16 }
});
