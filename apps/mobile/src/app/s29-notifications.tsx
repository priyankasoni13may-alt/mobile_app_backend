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
  FileText,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react-native';

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
        return <Calendar size={18} color="#8CB4F5" />;
      case 'TASK_OVERDUE':
        return <AlertCircle size={18} color="#EF4444" />;
      case 'APPLICATION_STATUS':
        return <ShieldCheck size={18} color="#5B8EE2" />;
      default:
        return <Bell size={18} color="#94A3B8" />;
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
          <CheckCheck size={16} color="#8CB4F5" />
          <Text style={styles.markReadText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {displayedList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Bell size={32} color="#64748B" />
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

              <ChevronRight size={16} color="#64748B" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0B1026', padding: 14, borderBottomWidth: 1, borderBottomColor: '#1E294B' },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#132438' },
  filterChipActive: { backgroundColor: '#5B8EE2' },
  filterText: { fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  filterTextActive: { color: '#FFFFFF' },
  markReadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  markReadText: { fontSize: 12, color: '#8CB4F5', fontWeight: '600' },
  content: { padding: 14, paddingBottom: 60, gap: 10 },
  notifCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', padding: 14 },
  unreadCard: { borderColor: '#5B8EE260', backgroundColor: '#122035' },
  iconContainer: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#132438', alignItems: 'center', justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 13, fontWeight: '600', color: '#CBD5E1' },
  unreadTitle: { color: '#FFFFFF', fontWeight: 'bold' },
  timeText: { fontSize: 10, color: '#64748B' },
  messageText: { fontSize: 11, color: '#94A3B8', lineHeight: 16 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  emptySubtitle: { fontSize: 12, color: '#64748B', textAlign: 'center', paddingHorizontal: 30 }
});
