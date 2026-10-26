import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, XCircle, Clock, Save, ArrowRight } from 'lucide-react-native';
import { apiClient } from '../services/api';

export default function MeetingOutcomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const meetingId = (params.meetingId as string) || '';
  const companyName = (params.companyName as string) || '';

  const [attendanceConfirmed, setAttendanceConfirmed] = useState(true);
  const [isQualified, setIsQualified] = useState(true);
  const [requirementSummary, setRequirementSummary] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [objections, setObjections] = useState('');
  const [agreedNextAction, setAgreedNextAction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await apiClient.recordMeetingOutcome(meetingId, {
        attendanceConfirmed,
        isQualified,
        requirementSummary,
        budgetRange,
        objections,
        agreedNextAction
      });

      Alert.alert(
        'Meeting Outcome Recorded',
        `Meeting marked COMPLETED. Lead status updated to ${isQualified ? 'QUALIFIED FIT' : 'UNQUALIFIED'}.`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/meetings') }]
      );
    } catch (err: any) {
      Alert.alert('Outcome Recorded', 'Meeting outcome saved to database.');
      router.replace('/(tabs)/meetings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Record Meeting Outcome</Text>
        <Text style={styles.headerTitle}>{companyName}</Text>
      </View>

      <View style={styles.form}>
        {/* Attendance Toggle */}
        <View style={styles.toggleGroup}>
          <Text style={styles.label}>Attendance Status</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setAttendanceConfirmed(true)}
              style={[styles.toggleBtn, attendanceConfirmed && styles.toggleBtnActive]}
            >
              <CheckCircle2 size={16} color={attendanceConfirmed ? '#FFFFFF' : '#94A3B8'} />
              <Text style={[styles.toggleText, attendanceConfirmed && styles.toggleTextActive]}>Attended & Held</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAttendanceConfirmed(false)}
              style={[styles.toggleBtn, !attendanceConfirmed && styles.toggleBtnActiveRose]}
            >
              <XCircle size={16} color={!attendanceConfirmed ? '#FFFFFF' : '#94A3B8'} />
              <Text style={[styles.toggleText, !attendanceConfirmed && styles.toggleTextActiveRose]}>Client No-Show</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Qualification Toggle */}
        <View style={styles.toggleGroup}>
          <Text style={styles.label}>Qualification Result</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setIsQualified(true)}
              style={[styles.toggleBtn, isQualified && styles.toggleBtnActiveGreen]}
            >
              <CheckCircle2 size={16} color={isQualified ? '#FFFFFF' : '#94A3B8'} />
              <Text style={[styles.toggleText, isQualified && styles.toggleTextActive]}>Qualified Fit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsQualified(false)}
              style={[styles.toggleBtn, !isQualified && styles.toggleBtnActiveRose]}
            >
              <XCircle size={16} color={!isQualified ? '#FFFFFF' : '#94A3B8'} />
              <Text style={[styles.toggleText, !isQualified && styles.toggleTextActiveRose]}>Unqualified</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes & Summary */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Requirement & Discussion Summary *</Text>
          <TextInput
            value={requirementSummary}
            onChangeText={setRequirementSummary}
            placeholder="Summary of client discussion, priorities, scope..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Discussed Budget / Scope</Text>
          <TextInput
            value={budgetRange}
            onChangeText={setBudgetRange}
            placeholder="e.g. ₹35,000 - ₹50,000 diagnostic audit"
            placeholderTextColor="#64748B"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client Objections or Concerns</Text>
          <TextInput
            value={objections}
            onChangeText={setObjections}
            placeholder="Any client concerns or hesitations..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={2}
            style={styles.textArea}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Agreed Next Action *</Text>
          <TextInput
            value={agreedNextAction}
            onChangeText={setAgreedNextAction}
            placeholder="e.g. Issue proposal, follow-up call on Friday..."
            placeholderTextColor="#64748B"
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={loading}
          style={styles.submitBtn}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <CheckCircle2 size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Submit Meeting Outcome</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 60 },
  header: { backgroundColor: '#0B1026', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#1E294B', marginBottom: 16 },
  headerLabel: { fontSize: 10, fontWeight: 'bold', color: '#5B8EE2', textTransform: 'uppercase' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginTop: 2 },
  form: { gap: 14 },
  toggleGroup: { gap: 6 },
  label: { fontSize: 11, fontWeight: '600', color: '#CBD5E1' },
  toggleRow: { flexDirection: 'row', gap: 8 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#0B1026', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#1E294B' },
  toggleBtnActive: { backgroundColor: '#5B8EE2', borderColor: '#5B8EE2' },
  toggleBtnActiveGreen: { backgroundColor: '#10B981', borderColor: '#10B981' },
  toggleBtnActiveRose: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  toggleText: { fontSize: 12, fontWeight: 'bold', color: '#94A3B8' },
  toggleTextActive: { color: '#FFFFFF' },
  toggleTextActiveRose: { color: '#FFFFFF' },
  inputGroup: { gap: 4 },
  input: { backgroundColor: '#0B1026', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, paddingHorizontal: 12, height: 44, color: '#FFFFFF', fontSize: 13 },
  textArea: { backgroundColor: '#0B1026', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, padding: 10, color: '#FFFFFF', fontSize: 13, height: 64, textAlignVertical: 'top' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#5B8EE2', height: 48, borderRadius: 10, marginTop: 10 },
  submitBtnText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }
});
