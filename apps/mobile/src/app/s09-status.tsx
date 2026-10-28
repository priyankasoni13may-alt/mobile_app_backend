import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react-native';
import { useAuthStore } from '../store/authStore';
import { LumoraButton } from '../components/LumoraButton';

export default function ApplicationStatusScreen() {
  const router = useRouter();
  const { user, profile } = useAuthStore();

  const isApproved = profile?.onboardingStatus === 'APPROVED' || user?.status === 'ACTIVE';

  const checklist = [
    { label: 'Corporate Registration & Account', done: true },
    { label: 'Professional Profile & Industry Focus', done: true },
    { label: 'Identity Verification (KYC)', done: true },
    { label: 'Partner Code of Conduct Acceptance', done: true },
    { label: 'Mandatory Compliance & Pitch Training', done: isApproved, pending: !isApproved }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Status Card */}
      <View style={styles.statusHero}>
        <View style={[styles.statusIconBox, { backgroundColor: isApproved ? '#ECFDF5' : '#FFFBEB' }]}>
          {isApproved ? (
            <CheckCircle2 size={36} color="#10B981" />
          ) : (
            <Clock size={36} color="#D97706" />
          )}
        </View>

        <Text style={styles.statusTitle}>
          {isApproved ? 'Partner Application Approved' : 'Application Under Review'}
        </Text>
        <Text style={styles.statusSubtitle}>
          {isApproved
            ? 'Your account is active. You are fully authorized to generate leads and book discovery meetings.'
            : 'Operations is verifying your profile credentials. Complete mandatory training modules to expedite review.'}
        </Text>
      </View>

      {/* Checklist */}
      <Text style={styles.checklistTitle}>Onboarding Gates Checklist</Text>
      <View style={styles.checklistCard}>
        {checklist.map((item, idx) => (
          <View key={idx} style={styles.checkItem}>
            {item.done ? (
              <CheckCircle2 size={18} color="#10B981" />
            ) : (
              <Clock size={18} color="#D97706" />
            )}
            <Text style={[styles.checkLabel, item.done && styles.checkLabelDone]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Action CTA */}
      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/s10-training')}
          style={styles.trainingBtn}
        >
          <GraduationCap size={18} color="#0B0F26" />
          <Text style={styles.trainingBtnText}>Access Partner Training Hub</Text>
        </TouchableOpacity>

        {isApproved && (
          <LumoraButton
            title="Enter Home Dashboard"
            onPress={() => router.replace('/(tabs)')}
            icon={<ArrowRight size={16} color="#FFFFFF" />}
            size="lg"
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24, justifyContent: 'center' },
  statusHero: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', padding: 24, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  statusIconBox: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  statusTitle: { fontSize: 20, fontWeight: 'bold', color: '#0B0F26', textAlign: 'center' },
  statusSubtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 18 },
  checklistTitle: { fontSize: 13, fontWeight: 'bold', color: '#0B0F26', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  checklistCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', padding: 18, gap: 14, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkLabel: { fontSize: 13, color: '#64748B', flex: 1 },
  checkLabelDone: { color: '#0B0F26', fontWeight: '600' },
  actions: { gap: 12 },
  trainingBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#F1F5F9', height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  trainingBtnText: { fontSize: 13, fontWeight: 'bold', color: '#0B0F26' }
});
