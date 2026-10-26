import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Calendar,
  Phone,
  Mail,
  FileText,
  Check,
  ChevronRight
} from 'lucide-react-native';

interface Task {
  id: string;
  leadId: string;
  leadName: string;
  title: string;
  taskType: 'CALL' | 'EMAIL' | 'MEETING_PREP' | 'CONTRACT_FOLLOWUP';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueCategory: 'TODAY' | 'OVERDUE' | 'UPCOMING';
  dueDate: string;
  completed: boolean;
}

const mockTasks: Task[] = [];

export default function FollowUpsTasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [createModal, setCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLead, setNewLead] = useState('');

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleSnooze = (id: string) => {
    Alert.alert('Task Snoozed', 'Follow-up postponed by 24 hours.');
  };

  const handleCreateTask = () => {
    if (!newTitle.trim()) {
      Alert.alert('Required', 'Please enter a task title.');
      return;
    }
    const newTask: Task = {
      id: `t-${Date.now()}`,
      leadId: 'lead-custom',
      leadName: newLead || 'General Follow-up',
      title: newTitle,
      taskType: 'CALL',
      priority: 'HIGH',
      dueCategory: 'TODAY',
      dueDate: 'Today, 6:00 PM',
      completed: false
    };
    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewLead('');
    setCreateModal(false);
    Alert.alert('Task Added', 'New follow-up task scheduled.');
  };

  const overdueTasks = tasks.filter((t) => t.dueCategory === 'OVERDUE' && !t.completed);
  const todayTasks = tasks.filter((t) => t.dueCategory === 'TODAY' && !t.completed);
  const upcomingTasks = tasks.filter((t) => t.dueCategory === 'UPCOMING' && !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const getPriorityColor = (p: Task['priority']) => {
    switch (p) {
      case 'URGENT':
        return '#EF4444';
      case 'HIGH':
        return '#5B8EE2';
      case 'MEDIUM':
        return '#8CB4F5';
      case 'LOW':
        return '#94A3B8';
    }
  };

  const renderTask = (t: Task) => {
    const pColor = getPriorityColor(t.priority);
    return (
      <View key={t.id} style={[styles.taskCard, t.dueCategory === 'OVERDUE' && styles.overdueBorder]}>
        <View style={styles.taskHeader}>
          <TouchableOpacity
            onPress={() => handleToggleComplete(t.id)}
            style={[styles.checkbox, t.completed && styles.checkboxDone]}
          >
            {t.completed && <Check size={14} color="#FFFFFF" />}
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={[styles.taskTitle, t.completed && styles.taskDoneText]}>{t.title}</Text>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/s16-lead-detail', params: { leadId: t.leadId } })}
              style={styles.leadTag}
            >
              <Text style={styles.leadTagText}>{t.leadName} ›</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.priorityBadge, { backgroundColor: `${pColor}18` }]}>
            <Text style={[styles.priorityText, { color: pColor }]}>{t.priority}</Text>
          </View>
        </View>

        <View style={styles.taskFooter}>
          <View style={styles.timeRow}>
            <Clock size={12} color={t.dueCategory === 'OVERDUE' ? '#EF4444' : '#94A3B8'} />
            <Text style={[styles.dueText, t.dueCategory === 'OVERDUE' && { color: '#EF4444', fontWeight: 'bold' }]}>
              {t.dueDate}
            </Text>
          </View>

          {!t.completed && (
            <TouchableOpacity onPress={() => handleSnooze(t.id)} style={styles.snoozeBtn}>
              <Text style={styles.snoozeText}>Snooze 24h</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setCreateModal(true)}
          style={styles.newTaskBtn}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.newTaskBtnText}>Schedule New Follow-up Task</Text>
        </TouchableOpacity>

        {/* Overdue Section */}
        {overdueTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <AlertCircle size={16} color="#EF4444" />
              <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Overdue Actions ({overdueTasks.length})</Text>
            </View>
            {overdueTasks.map(renderTask)}
          </View>
        )}

        {/* Today Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Due Today ({todayTasks.length})</Text>
          {todayTasks.length === 0 ? (
            <Text style={styles.emptyText}>No pending tasks scheduled for today.</Text>
          ) : (
            todayTasks.map(renderTask)
          )}
        </View>

        {/* Upcoming Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming ({upcomingTasks.length})</Text>
          {upcomingTasks.map(renderTask)}
        </View>

        {/* Completed Section */}
        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#64748B' }]}>Completed ({completedTasks.length})</Text>
            {completedTasks.map(renderTask)}
          </View>
        )}
      </ScrollView>

      {/* Create Task Modal */}
      <Modal visible={createModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Follow-up Task</Text>

            <Text style={styles.label}>Task Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Call CEO to finalize diagnostic roadmap"
              placeholderTextColor="#64748B"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.label}>Associated Lead / Company</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. TechNova Logistics"
              placeholderTextColor="#64748B"
              value={newLead}
              onChangeText={setNewLead}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setCreateModal(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreateTask} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Save Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 60, gap: 16 },
  newTaskBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#5B8EE2', paddingVertical: 12, borderRadius: 10 },
  newTaskBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  section: { gap: 10 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: 0.5 },
  emptyText: { fontSize: 12, color: '#64748B', fontStyle: 'italic', paddingVertical: 4 },
  taskCard: { backgroundColor: '#0B1026', borderRadius: 10, borderWidth: 1, borderColor: '#1E294B', padding: 12, gap: 10 },
  overdueBorder: { borderColor: '#EF444460', backgroundColor: '#13111C' },
  taskHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#64748B', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkboxDone: { backgroundColor: '#10B981', borderColor: '#10B981' },
  taskTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', lineHeight: 18 },
  taskDoneText: { textDecorationLine: 'line-through', color: '#64748B' },
  leadTag: { marginTop: 4 },
  leadTagText: { fontSize: 11, color: '#8CB4F5', fontWeight: '600' },
  priorityBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  priorityText: { fontSize: 9, fontWeight: 'bold' },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 8 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dueText: { fontSize: 11, color: '#94A3B8' },
  snoozeBtn: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#132438', borderRadius: 4 },
  snoozeText: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: '#00000099', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 20, gap: 12 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  label: { fontSize: 12, fontWeight: '600', color: '#CBD5E1' },
  input: { backgroundColor: '#070B19', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, padding: 10, color: '#FFFFFF' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  cancelBtn: { paddingVertical: 8, paddingHorizontal: 14 },
  cancelText: { color: '#94A3B8' },
  saveBtn: { backgroundColor: '#5B8EE2', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold' }
});
