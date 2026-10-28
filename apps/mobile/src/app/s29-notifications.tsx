import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  CheckCheck,
  Calendar,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react-native';
import { PoweredByFooter } from '../components/PoweredByFooter';

interface NotificationItem {
  id: string;
  type: 'APPLICATION_STATUS' | 'LEAD_ASSIGNED' | 'MEETING_REMINDER' | 'COMMISSION_STATUS' | 'PAYOUT_STATUS' | 'POLICY_CHANGE' | 'TASK_OVERDUE';
  title: string;
  message: string;
  time: string;
  read: boolean;
  targetPath?: string;
}

const mockNotifications: NotificationItem[] = [];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [filterUnread, setFilterUnread] = useState(false);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    Alert.alert('All Caught Up', 'All notifications marked as read.');
  };

  const handlePressNotification = (item: NotificationItem) => {
    setNotifications(
      notifications.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    if (item.targetPath) {
      router.push(item.targetPath as any);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'COMMISSION_STATUS':
      case 'PAYOUT_STATUS':
        return <DollarSign size={18} color="#10B981" />;
      case 'MEETING_REMINDER':
        return <Calendar size={18} color="#4F75FF" />;
      case 'TASK_OVERDUE':
        return <AlertCircle size={18} color="#EF4444" />;
      case 'APPLICATION_STATUS':
        return <ShieldCheck size={18} color="#8B5CF6" />;
      default:
        return <Bell size={18} color="#64748B" />;
    }
  };

  const displayedList = filterUnread
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <View style={styles.container}>
      {/* Top Bar Actions */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setFilterUnread(!filterUnread)}
          style={[styles.filterChip, filterUnread && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, filterUnread && styles.filterTextActive]}>
            {filterUnread ? 'Showing Unread' : 'Filter Unread'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleMarkAllRead} style={styles.markReadBtn}>
          <CheckCheck size={16} color="#4F75FF" />
          <Text style={styles.markReadText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {displayedList.length === 0 ? (
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconCircle}>
              <Bell size={28} color="#4F75FF" />
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up with your partner alerts and tasks.</Text>
          </View>
        ) : (
          displayedList.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => handlePressNotification(item)}
              style={[styles.notifCard, !item.read && styles.unreadCard]}
            >
              <View style={styles.iconContainer}>{getIcon(item.type)}</View>

              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <Text style={styles.messageText}>{item.message}</Text>
              </View>

              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>
          ))
        )}

        <PoweredByFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEF2F6' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F1F5F9' },
  filterChipActive: { backgroundColor: '#4F75FF' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  filterTextActive: { color: '#FFFFFF' },
  markReadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  markReadText: { fontSize: 13, color: '#4F75FF', fontWeight: '600' },
  content: { padding: 16, paddingBottom: 40, gap: 10 },
  notifCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  unreadCard: { borderColor: '#BFDBFE', backgroundColor: '#F8FAFC' },
  iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 13, fontWeight: '600', color: '#334155' },
  unreadTitle: { color: '#0B0F26', fontWeight: '700' },
  timeText: { fontSize: 11, color: '#94A3B8' },
  messageText: { fontSize: 12, color: '#64748B', lineHeight: 17 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 8 },
  emptyIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#0B0F26' },
  emptySubtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', paddingHorizontal: 30 }
});
