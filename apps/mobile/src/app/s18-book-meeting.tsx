import React, { useState, useEffect } from 'react';
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
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Mail,
  User,
  Users,
  ShieldCheck,
  Building2,
  Bell,
  CheckCircle2,
  ChevronDown
} from 'lucide-react-native';
import { apiClient } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { LumoraButton } from '../components/LumoraButton';

export default function BookMeetingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialLeadId = (params.leadId as string) || '';
  const initialCompanyName = (params.companyName as string) || '';

  const { user } = useAuthStore();

  const [leadId, setLeadId] = useState(initialLeadId);
  const [lead, setLead] = useState<any>(null);
  const [availableLeads, setAvailableLeads] = useState<any[]>([]);
  const [loadingLead, setLoadingLead] = useState(true);

  // Date selection states
  const [dayOffset, setDayOffset] = useState(1); // 1 = Tomorrow, 2 = In 2 days, etc.
  const [timeSlot, setTimeSlot] = useState('11:00 AM'); // Default 11 AM IST

  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('Enterprise Growth Diagnostic & Technical Capabilities Presentation');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [mode, setMode] = useState<'ONLINE' | 'IN_PERSON'>('ONLINE');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/lum-disc-call');
  const [additionalInvitees, setAdditionalInvitees] = useState('');
  const [loading, setLoading] = useState(false);

  // Compute scheduled date from dayOffset + timeSlot
  const getScheduledDate = (offset: number, slot: string) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    let hours = 11;
    let mins = 0;
    if (slot === '11:00 AM') { hours = 11; mins = 0; }
    else if (slot === '02:30 PM') { hours = 14; mins = 30; }
    else if (slot === '04:00 PM') { hours = 16; mins = 0; }
    else if (slot === '05:30 PM') { hours = 17; mins = 30; }
    d.setHours(hours, mins, 0, 0);
    return d;
  };

  const currentDateObj = getScheduledDate(dayOffset, timeSlot);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const formattedDatePreview = `${days[currentDateObj.getDay()]}, ${months[currentDateObj.getMonth()]} ${currentDateObj.getDate()} at ${timeSlot}`;

  useEffect(() => {
    const loadLeadsData = async () => {
      setLoadingLead(true);
      try {
        if (leadId) {
          const res = await apiClient.getLead(leadId);
          if (res.data) {
            setLead(res.data);
            if (!title) {
              setTitle(`${res.data.companyName} — Growth & Discovery Call`);
            }
          }
        } else {
          const res = await apiClient.listLeads();
          const list = Array.isArray(res.data) ? res.data : (res.data as any)?.data || [];
          setAvailableLeads(list);
          if (list.length > 0) {
            setLeadId(list[0].id);
            setLead(list[0]);
            if (!title) {
              setTitle(`${list[0].companyName} — Growth & Discovery Call`);
            }
          }
        }
      } catch (err) {
        console.log('Error loading lead for meeting:', err);
      } finally {
        setLoadingLead(false);
      }
    };

    loadLeadsData();
  }, [leadId]);

  const handleBook = async () => {
    if (!leadId) {
      Alert.alert('Select Prospect', 'Please select a prospect company to schedule this meeting with.');
      return;
    }

    setLoading(true);
    try {
      const extraList = additionalInvitees
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 3 && s.includes('@'));

      await apiClient.createMeeting({
        leadId,
        title: title || `${lead?.companyName || 'Prospect'} — Discovery Meeting`,
        purpose,
        scheduledAtUtc: currentDateObj.toISOString(),
        timezone: 'Asia/Kolkata',
        durationMinutes,
        mode,
        meetingLinkOrLocation: meetingLink,
        inviteeEmails: extraList
      });

      Alert.alert(
        'Discovery Meeting Scheduled! 📅',
        `Meeting booked with ${lead?.companyName || 'the prospect'}.\n\n` +
          `• Invites dispatched to ${lead?.contactEmail || 'Client'}\n` +
          `• Lumora Pre-Sales Team assigned to co-host\n` +
          `• Saved in your Meetings calendar with reminders.`,
        [{ text: 'View in Meetings', onPress: () => router.replace('/(tabs)/meetings') }]
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
      {/* Target Prospect & Primary Contact Card */}
      <View style={styles.prospectCard}>
        <View style={styles.prospectHeaderRow}>
          <View style={styles.prospectIconBox}>
            <Building2 size={20} color="#4F75FF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.clientLabel}>Target Prospect</Text>
            <Text style={styles.clientName}>{lead?.companyName || initialCompanyName || 'Select Prospect'}</Text>
          </View>
          {availableLeads.length > 1 && (
            <View style={styles.switchBadge}>
              <Text style={styles.switchText}>Active</Text>
            </View>
          )}
        </View>

        {lead?.contactName ? (
          <View style={styles.contactDetailsBox}>
            <View style={styles.contactRow}>
              <User size={13} color="#4F75FF" />
              <Text style={styles.contactNameText}>
                {lead.contactName} {lead.contactRole ? `(${lead.contactRole})` : ''}
              </Text>
            </View>
            {lead.contactEmail ? (
              <View style={styles.contactRow}>
                <Mail size={13} color="#64748B" />
                <Text style={styles.contactSubText}>{lead.contactEmail}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Form Fields */}
      <View style={styles.form}>
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Meeting Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Growth & Technical Discovery Call"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        {/* Date Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Schedule Date</Text>
          <View style={styles.chipRow}>
            {[
              { offset: 1, label: 'Tomorrow' },
              { offset: 2, label: 'In 2 Days' },
              { offset: 3, label: 'In 3 Days' },
              { offset: 5, label: 'Next Week' }
            ].map((item) => (
              <TouchableOpacity
                key={item.offset}
                onPress={() => setDayOffset(item.offset)}
                style={[styles.chip, dayOffset === item.offset && styles.chipActive]}
              >
                <Text style={[styles.chipText, dayOffset === item.offset && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Slot Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time Slot (IST)</Text>
          <View style={styles.chipRow}>
            {['11:00 AM', '02:30 PM', '04:00 PM', '05:30 PM'].map((slot) => (
              <TouchableOpacity
                key={slot}
                onPress={() => setTimeSlot(slot)}
                style={[styles.chip, timeSlot === slot && styles.chipActive]}
              >
                <Text style={[styles.chipText, timeSlot === slot && styles.chipTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.datePreviewBox}>
            <Clock size={14} color="#059669" />
            <Text style={styles.datePreviewText}>Scheduled for: {formattedDatePreview}</Text>
          </View>
        </View>

        {/* Purpose / Agenda */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Purpose / Discussion Agenda</Text>
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

        {/* Duration */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration</Text>
          <View style={styles.chipRow}>
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

        {/* Mode */}
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

        {/* Meeting Link or Location */}
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

        {/* Additional Invitees */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Client Invitees (Optional)</Text>
          <TextInput
            value={additionalInvitees}
            onChangeText={setAdditionalInvitees}
            placeholder="e.g. cto@company.com, director@company.com"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        {/* 1. Attendees Transparency Section */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeaderRow}>
            <Users size={16} color="#4F75FF" />
            <Text style={styles.infoCardTitle}>Meeting Participants & Co-Hosts</Text>
          </View>

          <View style={styles.attendeeList}>
            <View style={styles.attendeeItem}>
              <View style={[styles.attendeeDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.attendeeRole}>Client Attendee:</Text>
              <Text style={styles.attendeeValue}>
                {lead?.contactName || 'Primary Contact'} ({lead?.contactEmail || 'Lead Email'})
              </Text>
            </View>

            <View style={styles.attendeeItem}>
              <View style={[styles.attendeeDot, { backgroundColor: '#4F75FF' }]} />
              <Text style={styles.attendeeRole}>Partner (You):</Text>
              <Text style={styles.attendeeValue}>
                {user?.fullName || 'Registered Partner'} ({user?.email || 'Partner Account'})
              </Text>
            </View>

            <View style={styles.attendeeItem}>
              <View style={[styles.attendeeDot, { backgroundColor: '#8B5CF6' }]} />
              <Text style={styles.attendeeRole}>Technical Co-Host:</Text>
              <Text style={styles.attendeeValue}>Lumora Enterprise Solutions Specialist</Text>
            </View>
          </View>
        </View>

        {/* 2. Notification Dispatch Section */}
        <View style={styles.notifyCard}>
          <View style={styles.infoHeaderRow}>
            <Bell size={16} color="#D97706" />
            <Text style={[styles.infoCardTitle, { color: '#B45309' }]}>Automated Notification Dispatch</Text>
          </View>

          <View style={styles.notifyList}>
            <View style={styles.notifyItem}>
              <CheckCircle2 size={13} color="#059669" />
              <Text style={styles.notifyText}>
                <Text style={{ fontWeight: '700' }}>Client Contact:</Text> Receives calendar invite with meeting link and agenda.
              </Text>
            </View>

            <View style={styles.notifyItem}>
              <CheckCircle2 size={13} color="#059669" />
              <Text style={styles.notifyText}>
                <Text style={{ fontWeight: '700' }}>Lumora Operations:</Text> Alerted in Admin Panel to assign a pre-sales solutions engineer.
              </Text>
            </View>

            <View style={styles.notifyItem}>
              <CheckCircle2 size={13} color="#059669" />
              <Text style={styles.notifyText}>
                <Text style={{ fontWeight: '700' }}>You (Partner):</Text> Added to your Meetings tab with automated T-24h and T-1h reminders.
              </Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View style={{ marginTop: 8 }}>
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
  prospectCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 16,
    gap: 10
  },
  prospectHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  prospectIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  clientLabel: { fontSize: 10, fontWeight: '800', color: '#4F75FF', textTransform: 'uppercase', letterSpacing: 0.5 },
  clientName: { fontSize: 18, fontWeight: '800', color: '#0B0F26', marginTop: 2 },
  switchBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  switchText: { fontSize: 11, fontWeight: '700', color: '#059669' },
  contactDetailsBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4
  },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  contactNameText: { fontSize: 12, fontWeight: '700', color: '#0B0F26' },
  contactSubText: { fontSize: 11, color: '#64748B' },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '700', color: '#334155' },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    color: '#0B0F26',
    fontSize: 13
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    color: '#0B0F26',
    fontSize: 13,
    minHeight: 68,
    textAlignVertical: 'top'
  },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chipActive: { backgroundColor: '#EEF2FF', borderColor: '#4F75FF' },
  chipText: { fontSize: 11, fontWeight: '600', color: '#64748B' },
  chipTextActive: { color: '#4F75FF', fontWeight: 'bold' },
  datePreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 4
  },
  datePreviewText: { fontSize: 11, fontWeight: '700', color: '#065F46' },
  durationChip: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center'
  },
  durationChipActive: { backgroundColor: '#EFF6FF', borderColor: '#4F75FF' },
  durationText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  durationTextActive: { color: '#4F75FF', fontWeight: 'bold' },
  modeRow: { flexDirection: 'row', gap: 8 },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  modeBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#4F75FF' },
  modeText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  modeTextActive: { color: '#4F75FF', fontWeight: 'bold' },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 8
  },
  infoHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoCardTitle: { fontSize: 12, fontWeight: '800', color: '#0B0F26' },
  attendeeList: { gap: 6, marginTop: 4 },
  attendeeItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  attendeeDot: { width: 6, height: 6, borderRadius: 3 },
  attendeeRole: { fontSize: 11, fontWeight: '700', color: '#475569' },
  attendeeValue: { fontSize: 11, color: '#64748B', flex: 1 },
  notifyCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 8
  },
  notifyList: { gap: 6, marginTop: 4 },
  notifyItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  notifyText: { fontSize: 11, color: '#92400E', flex: 1, lineHeight: 16 }
});
