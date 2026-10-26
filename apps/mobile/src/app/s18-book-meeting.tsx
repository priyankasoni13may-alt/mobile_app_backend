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
      <View style={styles.header}>
        <Text style={styles.clientLabel}>Target Prospect</Text>
        <Text style={styles.clientName}>{companyName}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Meeting Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Discovery & Needs Assessment Call"
            placeholderTextColor="#64748B"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Purpose / Agenda</Text>
          <TextInput
            value={purpose}
            onChangeText={setPurpose}
            placeholder="Meeting objective and discussion agenda..."
            placeholderTextColor="#64748B"
            multiline
            numberOfLines={2}
            style={styles.textArea}
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
              <Video size={16} color={mode === 'ONLINE' ? '#FFFFFF' : '#94A3B8'} />
              <Text style={[styles.modeText, mode === 'ONLINE' && styles.modeTextActive]}>Google Meet / Online</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode('IN_PERSON')}
              style={[styles.modeBtn, mode === 'IN_PERSON' && styles.modeBtnActive]}
            >
              <MapPin size={16} color={mode === 'IN_PERSON' ? '#FFFFFF' : '#94A3B8'} />
              <Text style={[styles.modeText, mode === 'IN_PERSON' && styles.modeTextActive]}>In-Person Office</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{mode === 'ONLINE' ? 'Video Conference Link' : 'Office Location Address'}</Text>
          <TextInput
            value={meetingLink}
            onChangeText={setMeetingLink}
            placeholder={mode === 'ONLINE' ? 'https://meet.google.com/...' : 'Office location address'}
            placeholderTextColor="#64748B"
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleBook}
          disabled={loading}
          style={styles.bookBtn}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Calendar size={18} color="#FFFFFF" />
              <Text style={styles.bookBtnText}>Schedule Client Meeting</Text>
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
  clientLabel: { fontSize: 10, fontWeight: 'bold', color: '#5B8EE2', textTransform: 'uppercase' },
  clientName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginTop: 2 },
  form: { gap: 14 },
  inputGroup: { gap: 4 },
  label: { fontSize: 11, fontWeight: '600', color: '#CBD5E1' },
  input: { backgroundColor: '#0B1026', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, paddingHorizontal: 12, height: 44, color: '#FFFFFF', fontSize: 13 },
  textArea: { backgroundColor: '#0B1026', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, padding: 10, color: '#FFFFFF', fontSize: 13, height: 60, textAlignVertical: 'top' },
  durationRow: { flexDirection: 'row', gap: 8 },
  durationChip: { flex: 1, backgroundColor: '#0B1026', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#1E294B', alignItems: 'center' },
  durationChipActive: { backgroundColor: '#5B8EE2', borderColor: '#5B8EE2' },
  durationText: { fontSize: 11, fontWeight: 'bold', color: '#94A3B8' },
  durationTextActive: { color: '#FFFFFF' },
  modeRow: { flexDirection: 'row', gap: 8 },
  modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#0B1026', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#1E294B' },
  modeBtnActive: { backgroundColor: '#101735', borderColor: '#38BDF8' },
  modeText: { fontSize: 11, fontWeight: 'bold', color: '#94A3B8' },
  modeTextActive: { color: '#38BDF8' },
  bookBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#5B8EE2', height: 48, borderRadius: 10, marginTop: 10 },
  bookBtnText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }
});
