import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react-native';
import { apiClient } from '../services/api';

export default function QualificationFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const leadId = (params.leadId as string) || 'lead-03-finlink';

  const [decisionMaker, setDecisionMaker] = useState('');
  const [urgency, setUrgency] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [currentSolution, setCurrentSolution] = useState('');
  const [unqualifiedReason, setUnqualifiedReason] = useState('');

  const handleQualify = async (isQualified: boolean) => {
    if (!isQualified && !unqualifiedReason.trim()) {
      Alert.alert('Reason Required', 'Please specify why the lead is unqualified.');
      return;
    }

    try {
      await apiClient.updateLead(leadId, {
        stage: isQualified ? 'QUALIFIED' : 'UNQUALIFIED',
        unqualifiedReason: !isQualified ? unqualifiedReason : undefined
      });

      Alert.alert(
        'Lead Qualification Recorded',
        `Lead has been marked as ${isQualified ? 'QUALIFIED FIT' : 'UNQUALIFIED'}.`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/leads') }]
      );
    } catch {
      router.replace('/(tabs)/leads');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Lead Qualification Form</Text>
        <Text style={styles.subtitle}>Assess prospect readiness before committing sales resources</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>1. Decision-Maker Authority</Text>
          <TextInput
            value={decisionMaker}
            onChangeText={setDecisionMaker}
            placeholder="e.g. Yes — VP / CTO direct"
            placeholderTextColor="#64748B"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>2. Timeline & Urgency</Text>
          <TextInput
            value={urgency}
            onChangeText={setUrgency}
            placeholder="e.g. High — next 30 days"
            placeholderTextColor="#64748B"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>3. Estimated Budget Range</Text>
          <TextInput
            value={budgetRange}
            onChangeText={setBudgetRange}
            placeholder="e.g. ₹35,000 - ₹5,00,000"
            placeholderTextColor="#64748B"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>4. Current Solution / Incumbent Agency</Text>
          <TextInput
            value={currentSolution}
            onChangeText={setCurrentSolution}
            placeholder="e.g. In-house manual or agency"
            placeholderTextColor="#64748B"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>If Unqualified — Mandatory Reason</Text>
          <TextInput
            value={unqualifiedReason}
            onChangeText={setUnqualifiedReason}
            placeholder="e.g. Budget too low, no executive buy-in, wrong industry..."
            placeholderTextColor="#64748B"
            style={styles.textArea}
            multiline
          />
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            onPress={() => handleQualify(false)}
            style={styles.unqualifiedBtn}
          >
            <XCircle size={16} color="#EF4444" />
            <Text style={styles.unqualifiedText}>Mark Unqualified</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleQualify(true)}
            style={styles.qualifiedBtn}
          >
            <CheckCircle2 size={16} color="#FFFFFF" />
            <Text style={styles.qualifiedText}>Mark Qualified Fit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 60 },
  header: { marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  form: { gap: 14 },
  inputGroup: { gap: 4 },
  label: { fontSize: 11, fontWeight: '600', color: '#CBD5E1' },
  input: { backgroundColor: '#0B1026', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, paddingHorizontal: 12, height: 44, color: '#FFFFFF', fontSize: 13 },
  textArea: { backgroundColor: '#0B1026', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, padding: 10, color: '#FFFFFF', fontSize: 13, height: 60, textAlignVertical: 'top' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  unqualifiedBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(239, 68, 68, 0.15)', height: 48, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  unqualifiedText: { fontSize: 12, fontWeight: 'bold', color: '#EF4444' },
  qualifiedBtn: { flex: 1.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#10B981', height: 48, borderRadius: 10 },
  qualifiedText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }
});
