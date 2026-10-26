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

export default function MeetingsTabScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [meetings, setMeetings] = useState<any[]>([]);

  const filteredMeetings = meetings.filter((m) =>
    activeTab === 'UPCOMING' ? m.isUpcoming : !m.isUpcoming
  );

  return (
    <View style={styles.container}>
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
              <Calendar size={36} color="#64748B" />
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
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/s18-book-meeting')}
                style={styles.bookBtn}
              >
                <Plus size={18} color="#FFFFFF" />
                <Text style={styles.bookBtnText}>Book Discovery Meeting</Text>
              </TouchableOpacity>
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
                <View style={[styles.statusBadge, { backgroundColor: m.status === 'COMPLETED' ? '#10B98120' : '#38BDF820' }]}>
                  <Text style={[styles.statusText, { color: m.status === 'COMPLETED' ? '#10B981' : '#38BDF8' }]}>
                    {m.status}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Clock size={13} color="#94A3B8" />
                <Text style={styles.metaText}>{m.scheduledAt} • {m.duration}</Text>
              </View>

              <View style={styles.metaRow}>
                {m.mode === 'ONLINE' ? <Video size={13} color="#38BDF8" /> : <MapPin size={13} color="#5B8EE2" />}
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
  container: { flex: 1, backgroundColor: '#070B19' },
  tabBar: { flexDirection: 'row', backgroundColor: '#0B1026', padding: 8, borderBottomWidth: 1, borderBottomColor: '#1E294B', gap: 8 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#132438' },
  tabBtnText: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  tabBtnTextActive: { color: '#5B8EE2', fontWeight: 'bold' },
  content: { padding: 16, paddingBottom: 80, gap: 12 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 20, gap: 12 },
  emptyIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#132438', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },
  emptySubtitle: { fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 18, maxWidth: 300 },
  bookBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#5B8EE2', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, marginTop: 8 },
  bookBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  meetingCard: { backgroundColor: '#0B1026', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#1E294B', gap: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  meetingTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF', lineHeight: 18 },
  companyName: { fontSize: 11, color: '#64748B', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: '800' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 12, color: '#CBD5E1' },
  outcomeBox: { backgroundColor: '#132438', padding: 10, borderRadius: 8, marginTop: 4 },
  outcomeLabel: { fontSize: 10, color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' },
  outcomeText: { fontSize: 12, color: '#10B981', marginTop: 2, fontWeight: '600' },
  actionRow: { borderTopWidth: 1, borderTopColor: '#1E294B', paddingTop: 10, marginTop: 4, flexDirection: 'row', justifyContent: 'flex-end' },
  outcomeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#10B98115', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  outcomeBtnText: { color: '#10B981', fontSize: 12, fontWeight: 'bold' }
});
