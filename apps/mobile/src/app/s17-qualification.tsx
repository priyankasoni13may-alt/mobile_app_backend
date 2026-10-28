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
import { PoweredByFooter } from '../components/PoweredByFooter';

export default function QualificationFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const leadId = (params.leadId as string) || '';

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
      if (leadId) {
        await apiClient.updateLead(leadId, {
          stage: isQualified ? 'QUALIFIED' : 'UNQUALIFIED',
          unqualifiedReason: !isQualified ? unqualifiedReason : undefined
        });
      }

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
            placeholder="Enter decision-maker authority details"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>2. Timeline & Urgency</Text>
          <TextInput
            value={urgency}
            onChangeText={setUrgency}
            placeholder="Enter project timeline or urgency"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>3. Estimated Budget Range</Text>
          <TextInput
            value={budgetRange}
            onChangeText={setBudgetRange}
            placeholder="Enter estimated budget range"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>4. Current Solution / Incumbent Agency</Text>
          <TextInput
            value={currentSolution}
            onChangeText={setCurrentSolution}
            placeholder="Enter current vendor or solution"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>If Unqualified — Mandatory Reason</Text>
          <TextInput
            value={unqualifiedReason}
            onChangeText={setUnqualifiedReason}
            placeholder="Enter reason why lead is unqualified"
            placeholderTextColor="#94A3B8"
            style={styles.textArea}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
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

      <PoweredByFooter style={{ marginTop: 24, marginBottom: 10 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 60 },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0B0F26' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
  form: { gap: 14 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 48, color: '#0B0F26', fontSize: 13 },
  textArea: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, color: '#0B0F26', fontSize: 13, height: 72, textAlignVertical: 'top' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  unqualifiedBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#FEF2F2', height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#FEE2E2' },
  unqualifiedText: { fontSize: 13, fontWeight: 'bold', color: '#EF4444' },
  qualifiedBtn: { flex: 1.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#10B981', height: 48, borderRadius: 24 },
  qualifiedText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }
});
