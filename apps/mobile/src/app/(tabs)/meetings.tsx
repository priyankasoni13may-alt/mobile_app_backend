import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react-native';
import { LumoraButton } from '../../components/LumoraButton';
import { AppHeader } from '../../components/AppHeader';

export default function MeetingsTabScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [meetings, setMeetings] = useState<any[]>([]);

  const filteredMeetings = meetings.filter((m) =>
    activeTab === 'UPCOMING' ? m.isUpcoming : !m.isUpcoming
  );

  return (
    <View style={styles.container}>
      {/* Branded Executive Top Bar */}
      <AppHeader
        title="Discovery Meetings"
        subtitle="Presentations & Client Calendar"
        showLogo={false}
        showNotifications={true}
      />

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('UPCOMING')}
          style={[styles.tabBtn, activeTab === 'UPCOMING' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'UPCOMING' && styles.tabBtnTextActive]}>
            Upcoming ({meetings.filter((m) => m.isUpcoming).length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('PAST')}
          style={[styles.tabBtn, activeTab === 'PAST' && styles.tabBtnActive]}
        >
          <Text style={[styles.tabBtnText, activeTab === 'PAST' && styles.tabBtnTextActive]}>
            Past & Completed ({meetings.filter((m) => !m.isUpcoming).length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredMeetings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Calendar size={36} color="#4F75FF" />
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === 'UPCOMING' ? 'No Upcoming Meetings' : 'No Past Meetings'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'UPCOMING'
                ? 'You have no discovery sessions scheduled on your calendar. Add a lead and book a meeting to engage decision-makers.'
                : 'Completed discovery calls and recorded qualification outcomes will be archived here.'}
            </Text>
            {activeTab === 'UPCOMING' && (
              <View style={{ width: '100%', maxWidth: 260, marginTop: 8 }}>
                <LumoraButton
                  title="Book Discovery Meeting"
                  onPress={() => router.push('/s18-book-meeting')}
                  icon={<Plus size={18} color="#FFFFFF" />}
                  size="md"
                />
              </View>
            )}
          </View>
        ) : (
          filteredMeetings.map((m) => (
            <View key={m.id} style={styles.meetingCard}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.meetingTitle}>{m.title}</Text>
                  <Text style={styles.companyName}>{m.companyName}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: m.status === 'COMPLETED' ? '#10B98118' : '#4F75FF15' }]}>
                  <Text style={[styles.statusText, { color: m.status === 'COMPLETED' ? '#10B981' : '#4F75FF' }]}>
                    {m.status}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Clock size={13} color="#64748B" />
                <Text style={styles.metaText}>{m.scheduledAt} • {m.duration}</Text>
              </View>

              <View style={styles.metaRow}>
                {m.mode === 'ONLINE' ? <Video size={13} color="#4F75FF" /> : <MapPin size={13} color="#8B5CF6" />}
                <Text style={styles.metaText}>{m.linkOrLocation}</Text>
              </View>

              {m.outcome && (
                <View style={styles.outcomeBox}>
                  <Text style={styles.outcomeLabel}>Qualification Outcome:</Text>
                  <Text style={styles.outcomeText}>{m.outcome}</Text>
                </View>
              )}

              {activeTab === 'UPCOMING' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: '/s20-meeting-outcome', params: { meetingId: m.id } })}
                    style={styles.outcomeBtn}
                  >
                    <CheckCircle2 size={14} color="#10B981" />
                    <Text style={styles.outcomeBtnText}>Record Outcome</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  tabBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 8, borderBottomWidth: 1, borderBottomColor: '#EEF2F6', gap: 8 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#F1F5F9' },
  tabBtnText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  tabBtnTextActive: { color: '#4F75FF', fontWeight: 'bold' },
  content: { padding: 16, paddingBottom: 80, gap: 12 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 20, gap: 12 },
  emptyIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#0B0F26' },
  emptySubtitle: { fontSize: 12, color: '#64748B', textAlign: 'center', lineHeight: 18, maxWidth: 300 },
  meetingCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#EEF2F6', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  meetingTitle: { fontSize: 14, fontWeight: 'bold', color: '#0B0F26', lineHeight: 18 },
  companyName: { fontSize: 11, color: '#64748B', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 12, color: '#334155' },
  outcomeBox: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, marginTop: 4, borderWidth: 1, borderColor: '#EEF2F6' },
  outcomeLabel: { fontSize: 10, color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' },
  outcomeText: { fontSize: 12, color: '#10B981', marginTop: 2, fontWeight: '600' },
  actionRow: { borderTopWidth: 1, borderTopColor: '#EEF2F6', paddingTop: 10, marginTop: 4, flexDirection: 'row', justifyContent: 'flex-end' },
  outcomeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#10B98115', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  outcomeBtnText: { color: '#10B981', fontSize: 12, fontWeight: 'bold' }
});
