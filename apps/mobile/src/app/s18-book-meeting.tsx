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
import { Calendar, Clock, Video, MapPin, Mail, ArrowRight } from 'lucide-react-native';
import { apiClient } from '../services/api';
import { LumoraButton } from '../components/LumoraButton';

export default function BookMeetingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const leadId = (params.leadId as string) || '';
  const companyName = (params.companyName as string) || '';

  const [title, setTitle] = useState(companyName ? `${companyName} — Growth & Discovery Call` : '');
  const [purpose, setPurpose] = useState('');
  const [scheduledAtUtc, setScheduledAtUtc] = useState(new Date(Date.now() + 24 * 3600 * 1000).toISOString());
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [mode, setMode] = useState<'ONLINE' | 'IN_PERSON'>('ONLINE');
  const [meetingLink, setMeetingLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    setLoading(true);
    try {
      await apiClient.createMeeting({
        leadId,
        title,
        purpose,
        scheduledAtUtc,
        timezone: 'Asia/Kolkata',
        durationMinutes,
        mode,
        meetingLinkOrLocation: meetingLink,
        inviteeEmails: []
      });

      Alert.alert(
        'Meeting Scheduled',
        `Discovery call confirmed for ${companyName}. Reminders scheduled at T-24h and T-1h.`,
        [{ text: 'View Meetings', onPress: () => router.replace('/(tabs)/meetings') }]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to book meeting');
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
      {companyName ? (
        <View style={styles.header}>
          <Text style={styles.clientLabel}>Target Prospect</Text>
          <Text style={styles.clientName}>{companyName}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Meeting Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter meeting title"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Purpose / Agenda</Text>
          <TextInput
            value={purpose}
            onChangeText={setPurpose}
            placeholder="Enter meeting objective and discussion agenda..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={2}
            style={styles.textArea}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration</Text>
          <View style={styles.durationRow}>
            {[30, 45, 60].map((mins) => (
              <TouchableOpacity
                key={mins}
                onPress={() => setDurationMinutes(mins)}
                style={[styles.durationChip, durationMinutes === mins && styles.durationChipActive]}
              >
                <Text style={[styles.durationText, durationMinutes === mins && styles.durationTextActive]}>
                  {mins} Minutes
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mode of Meeting</Text>
          <View style={styles.modeRow}>
            <TouchableOpacity
              onPress={() => setMode('ONLINE')}
              style={[styles.modeBtn, mode === 'ONLINE' && styles.modeBtnActive]}
            >
              <Video size={16} color={mode === 'ONLINE' ? '#4F75FF' : '#64748B'} />
              <Text style={[styles.modeText, mode === 'ONLINE' && styles.modeTextActive]}>Google Meet / Online</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode('IN_PERSON')}
              style={[styles.modeBtn, mode === 'IN_PERSON' && styles.modeBtnActive]}
            >
              <MapPin size={16} color={mode === 'IN_PERSON' ? '#4F75FF' : '#64748B'} />
              <Text style={[styles.modeText, mode === 'IN_PERSON' && styles.modeTextActive]}>In-Person Office</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{mode === 'ONLINE' ? 'Video Conference Link' : 'Office Location Address'}</Text>
          <TextInput
            value={meetingLink}
            onChangeText={setMeetingLink}
            placeholder={mode === 'ONLINE' ? 'Enter Google Meet / Zoom link' : 'Enter office location address'}
            placeholderTextColor="#94A3B8"
            style={styles.input}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <LumoraButton
            title="Schedule Client Meeting"
            onPress={handleBook}
            loading={loading}
            icon={<Calendar size={18} color="#FFFFFF" />}
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
  clientLabel: { fontSize: 11, fontWeight: 'bold', color: '#4F75FF', textTransform: 'uppercase' },
  clientName: { fontSize: 17, fontWeight: 'bold', color: '#0B0F26', marginTop: 3 },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 14, height: 48, color: '#0B0F26', fontSize: 13 },
  textArea: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, color: '#0B0F26', fontSize: 13, minHeight: 68, textAlignVertical: 'top' },
  durationRow: { flexDirection: 'row', gap: 8 },
  durationChip: { flex: 1, backgroundColor: '#F8FAFC', paddingVertical: 11, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  durationChipActive: { backgroundColor: '#EFF6FF', borderColor: '#4F75FF' },
  durationText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  durationTextActive: { color: '#4F75FF', fontWeight: 'bold' },
  modeRow: { flexDirection: 'row', gap: 8 },
  modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F8FAFC', paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  modeBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#4F75FF' },
  modeText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  modeTextActive: { color: '#4F75FF', fontWeight: 'bold' }
});
