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
  GraduationCap,
  CheckCircle2,
  PlayCircle,
  FileText,
  HelpCircle,
  ArrowRight
} from 'lucide-react-native';
import { apiClient } from '../services/api';

export default function TrainingHubScreen() {
  const router = useRouter();

  const [modules, setModules] = useState([
    {
      id: 'mod-01-compliance',
      title: 'Partner Ethics, Compliance & Anti-Spam Guidelines',
      desc: 'DPDP Act, truthful pitch representation, and code of conduct.',
      type: 'ARTICLE',
      isMandatory: true,
      completed: true,
      score: 100
    },
    {
      id: 'mod-02-lumora-pitch',
      title: 'Pitching Lumora Digital Growth & Branding',
      desc: 'Positioning performance marketing and brand identity packages.',
      type: 'VIDEO',
      isMandatory: true,
      completed: true,
      score: 100
    },
    {
      id: 'mod-03-cypher-ai',
      title: 'Pitching Cypher Swift Custom AI & SaaS Automation',
      desc: 'Qualifying enterprise AI agents and SaaS workflows.',
      type: 'QUIZ',
      isMandatory: true,
      completed: true,
      score: 100
    }
  ]);

  const allCompleted = modules.every((m) => m.completed);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <GraduationCap size={28} color="#5B8EE2" />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Partner Training Curriculum</Text>
            <Text style={styles.headerSubtitle}>
              {allCompleted ? 'All mandatory modules completed' : 'Complete modules to unlock lead registration'}
            </Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>
            Completed: {modules.filter((m) => m.completed).length} / {modules.length} Modules (100%)
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '100%' }]} />
          </View>
        </View>
      </View>

      {/* Modules List */}
      <Text style={styles.sectionTitle}>Curriculum Modules</Text>
      <View style={styles.moduleList}>
        {modules.map((m) => (
          <TouchableOpacity
            key={m.id}
            activeOpacity={0.8}
            onPress={() => alert(`Opening module: ${m.title}`)}
            style={styles.moduleCard}
          >
            <View style={styles.moduleTop}>
              <View style={styles.typeBadge}>
                {m.type === 'VIDEO' ? <PlayCircle size={14} color="#38BDF8" /> : m.type === 'QUIZ' ? <HelpCircle size={14} color="#A855F7" /> : <FileText size={14} color="#5B8EE2" />}
                <Text style={styles.typeText}>{m.type}</Text>
              </View>

              {m.completed && (
                <View style={styles.completedBadge}>
                  <CheckCircle2 size={12} color="#10B981" />
                  <Text style={styles.completedText}>Completed</Text>
                </View>
              )}
            </View>

            <Text style={styles.moduleTitle}>{m.title}</Text>
            <Text style={styles.moduleDesc}>{m.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dashboard Shortcut */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.replace('/(tabs)')}
        style={styles.continueBtn}
      >
        <Text style={styles.continueBtnText}>Proceed to Partner Dashboard</Text>
        <ArrowRight size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 60 },
  headerCard: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 18, marginBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  progressRow: { gap: 6 },
  progressLabel: { fontSize: 11, color: '#38BDF8', fontWeight: 'bold' },
  progressBarBg: { height: 6, backgroundColor: '#101735', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 3 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#CBD5E1', marginBottom: 10 },
  moduleList: { gap: 12, marginBottom: 20 },
  moduleCard: { backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', padding: 14 },
  moduleTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#101735', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  typeText: { fontSize: 10, fontWeight: 'bold', color: '#CBD5E1' },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  completedText: { fontSize: 10, fontWeight: 'bold', color: '#10B981' },
  moduleTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  moduleDesc: { fontSize: 12, color: '#94A3B8', marginTop: 2, lineHeight: 16 },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#5B8EE2', height: 48, borderRadius: 10 },
  continueBtnText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }
});
