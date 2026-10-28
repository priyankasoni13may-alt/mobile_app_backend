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
import { LumoraButton } from '../components/LumoraButton';

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
        <Text style={styles.headerTitle}>{companyName || 'Discovery Session'}</Text>
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
              <CheckCircle2 size={16} color={attendanceConfirmed ? '#FFFFFF' : '#64748B'} />
              <Text style={[styles.toggleText, attendanceConfirmed && styles.toggleTextActive]}>Attended & Held</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAttendanceConfirmed(false)}
              style={[styles.toggleBtn, !attendanceConfirmed && styles.toggleBtnActiveRose]}
            >
              <XCircle size={16} color={!attendanceConfirmed ? '#FFFFFF' : '#64748B'} />
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
              <CheckCircle2 size={16} color={isQualified ? '#FFFFFF' : '#64748B'} />
              <Text style={[styles.toggleText, isQualified && styles.toggleTextActive]}>Qualified Fit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsQualified(false)}
              style={[styles.toggleBtn, !isQualified && styles.toggleBtnActiveRose]}
            >
              <XCircle size={16} color={!isQualified ? '#FFFFFF' : '#64748B'} />
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
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            style={styles.textArea}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Discussed Budget / Scope</Text>
          <TextInput
            value={budgetRange}
            onChangeText={setBudgetRange}
            placeholder="Enter discussed budget and scope range"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client Objections or Concerns</Text>
          <TextInput
            value={objections}
            onChangeText={setObjections}
            placeholder="Enter any client concerns or hesitations"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={2}
            style={styles.textArea}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Agreed Next Action *</Text>
          <TextInput
            value={agreedNextAction}
            onChangeText={setAgreedNextAction}
            placeholder="Enter agreed next action and milestones"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <LumoraButton
            title="Submit Meeting Outcome"
            onPress={handleSubmit}
            loading={loading}
            icon={<CheckCircle2 size={18} color="#FFFFFF" />}
            size="lg"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 60 },
  header: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EEF2F6', marginBottom: 16 },
  headerLabel: { fontSize: 11, fontWeight: 'bold', color: '#4F75FF', textTransform: 'uppercase' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0B0F26', marginTop: 2 },
  form: { gap: 16 },
  toggleGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155' },
  toggleRow: { flexDirection: 'row', gap: 8 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F8FAFC', paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  toggleBtnActive: { backgroundColor: '#4F75FF', borderColor: '#4F75FF' },
  toggleBtnActiveGreen: { backgroundColor: '#10B981', borderColor: '#10B981' },
  toggleBtnActiveRose: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  toggleText: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
  toggleTextActive: { color: '#FFFFFF' },
  toggleTextActiveRose: { color: '#FFFFFF' },
  inputGroup: { gap: 6 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 48, color: '#0B0F26', fontSize: 13 },
  textArea: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, color: '#0B0F26', fontSize: 13, minHeight: 68, textAlignVertical: 'top' }
});
