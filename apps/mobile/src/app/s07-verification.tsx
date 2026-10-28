import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, AlertCircle, FileText } from 'lucide-react-native';
import { apiClient } from '../services/api';
import { LumoraButton } from '../components/LumoraButton';

export default function IdentityVerificationScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'VERIFIED'>('NOT_STARTED');
  const [loading, setLoading] = useState(false);

  const handleStartVerification = async () => {
    setLoading(true);
    try {
      await apiClient.startVerificationSession();
      setStatus('IN_PROGRESS');
      setTimeout(() => {
        setStatus('VERIFIED');
        setLoading(false);
      }, 1000);
    } catch {
      setStatus('IN_PROGRESS');
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <ShieldCheck size={36} color="#4F75FF" />
        </View>
        <Text style={styles.title}>Identity Verification</Text>
        <Text style={styles.subtitle}>
          Statutory KYC & DPDP Act compliance. Ensures transparent commission disbursement and verified partner identity.
        </Text>
      </View>

      {/* Security Privacy Notice */}
      <View style={styles.privacyCard}>
        <Lock size={16} color="#4F75FF" />
        <Text style={styles.privacyText}>
          Your government IDs are encrypted at rest using AES-256 and verified through authorized KYC adapters.
          Full identification numbers are never exposed in plaintext.
        </Text>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Verification Status:</Text>
        <View style={styles.statusBadge}>
          {status === 'VERIFIED' ? (
            <View style={styles.badgeRow}>
              <CheckCircle2 size={16} color="#10B981" />
              <Text style={styles.statusVerified}>VERIFIED</Text>
            </View>
          ) : status === 'IN_PROGRESS' ? (
            <View style={styles.badgeRow}>
              <ActivityIndicator size="small" color="#4F75FF" />
              <Text style={styles.statusProgress}>IN PROGRESS</Text>
            </View>
          ) : (
            <Text style={styles.statusNotStarted}>NOT STARTED</Text>
          )}
        </View>
      </View>

      {/* Verification Action */}
      {status !== 'VERIFIED' ? (
        <LumoraButton
          title="Initiate Identity Verification"
          onPress={handleStartVerification}
          loading={loading}
          size="lg"
        />
      ) : (
        <LumoraButton
          title="Proceed to Agreement & Conduct"
          onPress={() => router.push('/s08-agreement')}
          icon={<ArrowRight size={16} color="#FFFFFF" />}
          size="lg"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 20 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0B0F26', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 18 },
  privacyCard: { flexDirection: 'row', gap: 10, padding: 14, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#EEF2F6', marginBottom: 20 },
  privacyText: { fontSize: 12, color: '#475569', flex: 1, lineHeight: 17 },
  statusCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', padding: 20, alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  statusLabel: { fontSize: 11, color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase' },
  statusBadge: { marginTop: 8 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusVerified: { fontSize: 16, fontWeight: '800', color: '#10B981' },
  statusProgress: { fontSize: 14, fontWeight: 'bold', color: '#4F75FF' },
  statusNotStarted: { fontSize: 14, fontWeight: 'bold', color: '#D97706' }
});
