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
import { LumoraButton } from '../components/LumoraButton';

export default function ServiceDealScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dealId = (params.dealId as string) || '';
  const clientName = (params.companyName as string) || (params.clientName as string) || '';

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
            <Briefcase size={12} color="#4F75FF" />
            <Text style={styles.tagText}>Cypher Swift Custom Software</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: closureSubmitted ? '#10B98115' : '#4F75FF15' }]}>
            <Text style={[styles.statusText, { color: closureSubmitted ? '#10B981' : '#4F75FF' }]}>
              {closureSubmitted ? 'CLOSURE IN REVIEW' : 'CONTRACT EXECUTION'}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Enterprise Workflow Automation & AI Agent Deployment</Text>
        {clientName ? <Text style={styles.clientSubtitle}>Lead: {clientName}</Text> : null}

        <View style={styles.dealMetrics}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Total Contract Value</Text>
            <Text style={styles.metricValue}>₹5,00,000</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Expected Partner Incentive</Text>
            <Text style={[styles.metricValue, { color: '#059669' }]}>₹10,000</Text>
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
          <Text style={[styles.badgeText, { color: evidenceSubmitted ? '#059669' : '#D97706' }]}>
            {evidenceSubmitted ? 'Evidence In Review' : 'Pending Payment'}
          </Text>
        </View>

        <View style={styles.milestoneItem}>
          <View style={[styles.milestoneDot, { backgroundColor: '#CBD5E1' }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.milestoneName}>Milestone 2: Beta Delivery & Acceptance (50%)</Text>
            <Text style={styles.milestoneAmount}>₹2,50,000 • In 60 Days</Text>
          </View>
          <Text style={[styles.badgeText, { color: '#94A3B8' }]}>Scheduled</Text>
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
            placeholder="Enter bank UTR or NEFT reference number"
            placeholderTextColor="#94A3B8"
            value={paymentRef}
            onChangeText={setPaymentRef}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount Deposited (INR)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter deposited amount in INR"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={amountPaid}
            onChangeText={setAmountPaid}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmitEvidence}
          style={styles.actionBtn}
        >
          <Upload size={18} color="#4F75FF" />
          <Text style={styles.actionBtnText}>{evidenceSubmitted ? 'Update Evidence' : 'Submit Payment Evidence'}</Text>
        </TouchableOpacity>
      </View>

      {/* Final Closure Submission */}
      <LumoraButton
        title={closureSubmitted ? 'Closure Request Submitted' : 'Submit Deal for Closure Review'}
        onPress={handleSubmitClosure}
        disabled={closureSubmitted}
        icon={<FileCheck2 size={20} color="#FFFFFF" />}
        size="lg"
      />

      <View style={styles.disclaimerBox}>
        <AlertCircle size={16} color="#D97706" />
        <Text style={styles.disclaimerText}>
          Commissions are generated inside an isolated database transaction upon Finance approval. Partners cannot self-approve payouts.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 60, gap: 14 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', padding: 18, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  tagText: { color: '#4F75FF', fontSize: 11, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800' },
  title: { fontSize: 17, fontWeight: 'bold', color: '#0B0F26', marginTop: 4, lineHeight: 22 },
  clientSubtitle: { fontSize: 12, color: '#64748B' },
  dealMetrics: { flexDirection: 'row', gap: 12, marginTop: 8 },
  metricBox: { flex: 1, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#EEF2F6' },
  metricLabel: { fontSize: 11, color: '#64748B' },
  metricValue: { fontSize: 18, fontWeight: 'bold', color: '#0B0F26', marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0B0F26' },
  hint: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  milestoneItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#EEF2F6' },
  milestoneDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4F75FF' },
  milestoneName: { fontSize: 12, fontWeight: '600', color: '#334155' },
  milestoneAmount: { fontSize: 11, color: '#64748B' },
  badgeText: { fontSize: 11, fontWeight: '600' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#EEF2F6' },
  checkboxActive: { borderColor: '#A7F3D0', backgroundColor: '#ECFDF5' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  checkedBox: { backgroundColor: '#10B981', borderColor: '#10B981' },
  checkboxLabel: { fontSize: 13, color: '#0B0F26', fontWeight: '600' },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#0B0F26', fontSize: 14 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 8, marginTop: 4, backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#DBEAFE' },
  actionBtnText: { color: '#4F75FF', fontWeight: '700', fontSize: 13 },
  disclaimerBox: { flexDirection: 'row', gap: 10, backgroundColor: '#FFFBEB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FDE68A' },
  disclaimerText: { flex: 1, fontSize: 11, color: '#B45309', lineHeight: 16 }
});
