import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, ChevronLeft, RefreshCw, AlertCircle, Clock } from 'lucide-react-native';
import { apiClient } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { LumoraButton } from '../components/LumoraButton';

export default function IdentityVerificationScreen() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [status, setStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'VERIFIED'>('NOT_STARTED');
  const [sessionRef, setSessionRef] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch live verification status on mount from backend
  const fetchStatus = useCallback(async (showToast = false) => {
    try {
      if (!token) return;
      const res = await apiClient.getVerificationStatus();
      const s = (res.data?.status || '').toUpperCase();
      if (s === 'VERIFIED') {
        setStatus('VERIFIED');
      } else if (s === 'IN_PROGRESS' || s === 'PENDING') {
        setStatus('IN_PROGRESS');
      } else {
        // Fallback: check onboarding status endpoint
        try {
          const ob = await apiClient.getOnboardingStatus();
          const obs = (ob.data?.verificationStatus || '').toUpperCase();
          if (obs === 'VERIFIED') setStatus('VERIFIED');
          else if (obs === 'IN_PROGRESS' || obs === 'PENDING') setStatus('IN_PROGRESS');
          else setStatus('NOT_STARTED');
        } catch {
          setStatus('NOT_STARTED');
        }
      }
      const data = res.data as any;
      if (data?.providerReference) {
        setSessionRef(data.providerReference);
      }
      if (showToast) {
        Alert.alert('Status Updated', `Current verification status: ${s || 'NOT_STARTED'}`);
      }
    } catch (err: any) {
      console.log('Error fetching verification status:', err?.message);
    } finally {
      setInitialLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleStartVerification = async () => {
    setLoading(true);
    try {
      const res = await apiClient.startVerificationSession();
      setStatus('IN_PROGRESS');
      const data = res.data as any;
      if (data?.providerReference) {
        setSessionRef(data.providerReference);
      }
    } catch (err: any) {
      // If error or already created, maintain current progress
      setStatus('IN_PROGRESS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Identity Verification</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={36} color="#4F75FF" />
          </View>
          <Text style={styles.title}>Partner Identity Verification</Text>
          <Text style={styles.subtitle}>
            Statutory KYC & DPDP Act compliance. Ensures transparent commission disbursement and verified partner identity.
          </Text>
        </View>

        {/* Security Privacy Notice */}
        <View style={styles.privacyCard}>
          <Lock size={16} color="#4F75FF" style={{ marginTop: 2 }} />
          <Text style={styles.privacyText}>
            Your government IDs are encrypted at rest using AES-256 and verified through authorized KYC adapters.
            Full identification numbers are never exposed in plaintext.
          </Text>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Verification Status</Text>

          {initialLoading ? (
            <View style={styles.badgeRow}>
              <ActivityIndicator size="small" color="#4F75FF" />
              <Text style={styles.statusProgress}>Checking records...</Text>
            </View>
          ) : (
            <View style={styles.statusBadge}>
              {status === 'VERIFIED' ? (
                <View style={styles.badgeRow}>
                  <CheckCircle2 size={18} color="#10B981" />
                  <Text style={styles.statusVerified}>VERIFIED</Text>
                </View>
              ) : status === 'IN_PROGRESS' ? (
                <View style={styles.badgeRow}>
                  <Clock size={18} color="#4F75FF" />
                  <Text style={styles.statusProgress}>IN PROGRESS</Text>
                </View>
              ) : (
                <View style={styles.badgeRow}>
                  <AlertCircle size={18} color="#D97706" />
                  <Text style={styles.statusNotStarted}>NOT STARTED</Text>
                </View>
              )}
            </View>
          )}

          {sessionRef && (
            <Text style={styles.referenceText}>Ref: {sessionRef}</Text>
          )}

          {status === 'IN_PROGRESS' && (
            <Text style={styles.statusHint}>
              Verification session is active. Documents are under statutory review. You can proceed to the Partner Code of Conduct.
            </Text>
          )}

          {status === 'VERIFIED' && (
            <Text style={styles.statusHintSuccess}>
              Your partner identity has been confirmed and registered in compliance records.
            </Text>
          )}
        </View>

        {/* Actions */}
        {status === 'NOT_STARTED' ? (
          <LumoraButton
            title="Initiate Identity Verification"
            onPress={handleStartVerification}
            loading={loading}
            size="lg"
          />
        ) : (
          <View style={styles.actionGroup}>
            <LumoraButton
              title="Proceed to Agreement & Conduct"
              onPress={() => router.push('/s08-agreement')}
              icon={<ArrowRight size={18} color="#FFFFFF" />}
              size="lg"
            />

            <TouchableOpacity
              onPress={() => fetchStatus(true)}
              style={styles.refreshBtn}
              activeOpacity={0.7}
            >
              <RefreshCw size={14} color="#64748B" />
              <Text style={styles.refreshBtnText}>Refresh Verification Status</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A'
  },
  content: {
    padding: 24,
    paddingBottom: 40
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B0F26',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19
  },
  privacyCard: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 20
  },
  privacyText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
    lineHeight: 18
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  statusLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  statusBadge: {
    marginTop: 10
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8
  },
  statusVerified: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.5
  },
  statusProgress: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4F75FF',
    letterSpacing: 0.5
  },
  statusNotStarted: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D97706',
    letterSpacing: 0.5
  },
  referenceText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8,
    fontFamily: 'monospace'
  },
  statusHint: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 17
  },
  statusHintSuccess: {
    fontSize: 12,
    color: '#059669',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 17
  },
  actionGroup: {
    gap: 12
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12
  },
  refreshBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B'
  }
});
