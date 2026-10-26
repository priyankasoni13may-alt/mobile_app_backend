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
        <View style={[styles.statusIconBox, { backgroundColor: isApproved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)' }]}>
          {isApproved ? (
            <CheckCircle2 size={36} color="#10B981" />
          ) : (
            <Clock size={36} color="#F59E0B" />
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
              <Clock size={18} color="#F59E0B" />
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
          <GraduationCap size={18} color="#FFFFFF" />
          <Text style={styles.trainingBtnText}>Access Partner Training Hub</Text>
        </TouchableOpacity>

        {isApproved && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.replace('/(tabs)')}
            style={styles.dashboardBtn}
          >
            <Text style={styles.dashboardBtnText}>Enter Home Dashboard</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 24, justifyContent: 'center' },
  statusHero: { alignItems: 'center', backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 24, marginBottom: 20 },
  statusIconBox: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  statusTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  statusSubtitle: { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 8, lineHeight: 18 },
  checklistTitle: { fontSize: 13, fontWeight: 'bold', color: '#CBD5E1', marginBottom: 10 },
  checklistCard: { backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', padding: 16, gap: 12, marginBottom: 24 },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkLabel: { fontSize: 12, color: '#94A3B8', flex: 1 },
  checkLabelDone: { color: '#FFFFFF', fontWeight: '500' },
  actions: { gap: 10 },
  trainingBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#101735', height: 48, borderRadius: 10, borderWidth: 1, borderColor: '#1E294B' },
  trainingBtnText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
  dashboardBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#5B8EE2', height: 48, borderRadius: 10 },
  dashboardBtnText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }
});
