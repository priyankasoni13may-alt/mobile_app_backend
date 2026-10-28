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
  Check
} from 'lucide-react-native';
import { LumoraButton } from '../components/LumoraButton';
import { PoweredByFooter } from '../components/PoweredByFooter';

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
        return '#4F75FF';
      case 'MEDIUM':
        return '#8B5CF6';
      case 'LOW':
        return '#64748B';
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

          <View style={[styles.priorityBadge, { backgroundColor: `${pColor}15` }]}>
            <Text style={[styles.priorityText, { color: pColor }]}>{t.priority}</Text>
          </View>
        </View>

        <View style={styles.taskFooter}>
          <View style={styles.timeRow}>
            <Clock size={12} color={t.dueCategory === 'OVERDUE' ? '#EF4444' : '#64748B'} />
            <Text style={[styles.dueText, t.dueCategory === 'OVERDUE' && { color: '#EF4444', fontWeight: '700' }]}>
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
        {/* Create Task Button */}
        <LumoraButton
          title="New Follow-up Task"
          onPress={() => setCreateModal(true)}
          icon={<Plus size={18} color="#FFFFFF" />}
        />

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

        {/* Today's Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Clock size={16} color="#4F75FF" />
            <Text style={[styles.sectionTitle, { color: '#4F75FF' }]}>Due Today ({todayTasks.length})</Text>
          </View>
          {todayTasks.length === 0 ? (
            <Text style={styles.emptyText}>No follow-ups due today. You are caught up!</Text>
          ) : (
            todayTasks.map(renderTask)
          )}
        </View>

        {/* Upcoming Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <CheckCircle2 size={16} color="#64748B" />
            <Text style={styles.sectionTitle}>Upcoming Follow-ups ({upcomingTasks.length})</Text>
          </View>
          {upcomingTasks.length === 0 ? (
            <Text style={styles.emptyText}>No upcoming follow-ups scheduled.</Text>
          ) : (
            upcomingTasks.map(renderTask)
          )}
        </View>

        {/* Completed Section */}
        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#64748B' }]}>Completed ({completedTasks.length})</Text>
            {completedTasks.map(renderTask)}
          </View>
        )}

        <PoweredByFooter />
      </ScrollView>

      {/* Create Task Modal */}
      <Modal visible={createModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Follow-up Task</Text>

            <Text style={styles.label}>Task Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter task description or action"
              placeholderTextColor="#94A3B8"
              value={newTitle}
              onChangeText={setNewTitle}
              cursorColor="#4F75FF"
              selectionColor="#4F75FF"
            />

            <Text style={styles.label}>Associated Lead / Company</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter client company name"
              placeholderTextColor="#94A3B8"
              value={newLead}
              onChangeText={setNewLead}
              cursorColor="#4F75FF"
              selectionColor="#4F75FF"
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 40, gap: 16 },
  section: { gap: 10 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#0B0F26', textTransform: 'uppercase', letterSpacing: 0.5 },
  emptyText: { fontSize: 13, color: '#64748B', fontStyle: 'italic', paddingVertical: 4 },
  taskCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', padding: 14, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  overdueBorder: { borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
  taskHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkboxDone: { backgroundColor: '#10B981', borderColor: '#10B981' },
  taskTitle: { fontSize: 14, fontWeight: '600', color: '#0B0F26', lineHeight: 18 },
  taskDoneText: { textDecorationLine: 'line-through', color: '#94A3B8' },
  leadTag: { marginTop: 4 },
  leadTagText: { fontSize: 12, color: '#4F75FF', fontWeight: '600' },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  priorityText: { fontSize: 10, fontWeight: '700' },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dueText: { fontSize: 12, color: '#64748B' },
  snoozeBtn: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#F1F5F9', borderRadius: 6 },
  snoozeText: { fontSize: 11, color: '#475569', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(11, 15, 38, 0.4)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', padding: 20, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 8 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#0B0F26' },
  label: { fontSize: 13, fontWeight: '600', color: '#334155' },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#EEF2F6', borderRadius: 10, padding: 12, color: '#0B0F26', fontSize: 14 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelText: { color: '#64748B', fontWeight: '600', fontSize: 14 },
  saveBtn: { backgroundColor: '#4F75FF', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 }
});
