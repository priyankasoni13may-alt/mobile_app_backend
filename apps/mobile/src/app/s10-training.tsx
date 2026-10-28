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
import { LumoraButton } from '../components/LumoraButton';
import { PoweredByFooter } from '../components/PoweredByFooter';

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
          <View style={styles.iconCircle}>
            <GraduationCap size={24} color="#4F75FF" />
          </View>
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
                {m.type === 'VIDEO' ? <PlayCircle size={14} color="#4F75FF" /> : m.type === 'QUIZ' ? <HelpCircle size={14} color="#8B5CF6" /> : <FileText size={14} color="#4F75FF" />}
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
      <LumoraButton
        title="Proceed to Partner Dashboard"
        onPress={() => router.replace('/(tabs)')}
        icon={<ArrowRight size={18} color="#FFFFFF" />}
      />

      <PoweredByFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 40 },
  headerCard: { backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', padding: 18, marginBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0B0F26' },
  headerSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  progressRow: { gap: 6 },
  progressLabel: { fontSize: 12, color: '#4F75FF', fontWeight: '700' },
  progressBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 3 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0B0F26', marginBottom: 12 },
  moduleList: { gap: 12, marginBottom: 24 },
  moduleCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  moduleTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  typeText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  completedText: { fontSize: 11, fontWeight: '700', color: '#10B981' },
  moduleTitle: { fontSize: 15, fontWeight: '700', color: '#0B0F26' },
  moduleDesc: { fontSize: 13, color: '#64748B', marginTop: 4, lineHeight: 18 }
});
