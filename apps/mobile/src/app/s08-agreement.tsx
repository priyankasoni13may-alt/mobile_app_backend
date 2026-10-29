import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  FileCheck,
  Shield,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Calendar,
  Lock,
  Sparkles
} from 'lucide-react-native';
import { apiClient } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { LumoraButton } from '../components/LumoraButton';

export default function AgreementScreen() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  const [isAccepted, setIsAccepted] = useState(false);
  const [acceptedAt, setAcceptedAt] = useState<string | null>(null);
  const [agreementVersion, setAgreementVersion] = useState('2026.1');
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch agreement status on mount from backend
  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      try {
        if (!token) return;

        // 1. List active agreements and user acceptance records
        const res = await apiClient.listAgreements();
        if (!isMounted) return;

        const list = Array.isArray(res.data) ? res.data : (res.data as any)?.data || [];
        const currentAgr = list.find((a: any) => a.id === 'agr-2026-v1') || list[0];

        if (currentAgr) {
          setAgreementVersion(currentAgr.version || '2026.1');
          if (currentAgr.accepted) {
            setIsAccepted(true);
            if (currentAgr.acceptedAt) setAcceptedAt(currentAgr.acceptedAt);
            return;
          }
        }

        // 2. Fallback check: onboarding status endpoint
        const statusRes = await apiClient.getOnboardingStatus();
        if (!isMounted) return;
        if (statusRes.data?.agreementAccepted) {
          setIsAccepted(true);
        }
      } catch (err) {
        console.log('Failed to check agreement status:', err);
      } finally {
        if (isMounted) setLoadingInitial(false);
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const res = await apiClient.acceptAgreement('agr-2026-v1');
      setIsAccepted(true);
      const timestamp = (res.data as any)?.acceptedAt || new Date().toISOString();
      setAcceptedAt(timestamp);

      Alert.alert(
        'Agreement Accepted! ✅',
        'Your digital signature and acceptance of Partner Code of Conduct (v2026.1) have been recorded in the permanent ledger.',
        [
          {
            text: 'Continue',
            onPress: () => {
              if (user?.status === 'ACTIVE') {
                router.replace('/(tabs)/profile');
              } else {
                router.push('/s09-status');
              }
            }
          }
        ]
      );
    } catch (err: any) {
      // If already accepted on server, mark as accepted
      if (err.message?.toLowerCase().includes('already') || err.message?.toLowerCase().includes('conflict')) {
        setIsAccepted(true);
        Alert.alert('Notice', 'This agreement has already been signed by your account.');
      } else {
        Alert.alert('Notice', err.message || 'Failed to record agreement acceptance. Please retry.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatAcceptedDate = (dateVal?: string | null) => {
    if (!dateVal) return 'Recently';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return 'Recently';
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const hours = d.getHours();
      const mins = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${formattedHours}:${mins} ${ampm}`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Back Navigation Pill */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.back()}
        style={styles.backRow}
      >
        <ChevronLeft size={18} color="#4F75FF" />
        <Text style={styles.backText}>Back to Profile</Text>
      </TouchableOpacity>

      {/* Screen Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Partner Code of Conduct</Text>
        </View>
        <Text style={styles.subtitle}>
          Version {agreementVersion} — Effective January 1, 2026
        </Text>
      </View>

      {/* Verified Signed Banner (Shown when already accepted) */}
      {isAccepted && (
        <View style={styles.verifiedSignedCard}>
          <View style={styles.verifiedHeaderRow}>
            <View style={styles.verifiedIconBox}>
              <ShieldCheck size={20} color="#059669" />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <View style={styles.verifiedBadgeRow}>
                <Text style={styles.verifiedCardTitle}>AGREEMENT SIGNED & ACTIVE</Text>
                <View style={styles.verifiedPill}>
                  <Text style={styles.verifiedPillText}>VERIFIED</Text>
                </View>
              </View>
              <Text style={styles.verifiedCardSub}>
                Digital signature recorded for {user?.fullName || 'Partner'}
              </Text>
            </View>
          </View>
          <View style={styles.verifiedMetaBox}>
            <View style={styles.metaRow}>
              <Calendar size={13} color="#059669" />
              <Text style={styles.metaDateText}>
                Signed: {formatAcceptedDate(acceptedAt)}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Lock size={12} color="#059669" />
              <Text style={styles.metaAuditText}>
                Audit Hash: SHA-256 • Immutable Compliance Ledger
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Agreement Body Text */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.sectionHeading}>1. Purpose & Relationship</Text>
        <Text style={styles.bodyText}>
          This Partner Network Agreement establishes an independent business development relationship between the Partner and Lumora Digital Solutions Private Limited and Cypher Swift InfoTech Solutions Private Limited.
        </Text>

        <Text style={styles.sectionHeading}>2. Truthful Representation & Anti-Spam</Text>
        <Text style={styles.bodyText}>
          Partners agree to represent service deliverables, capabilities, and commercial offerings truthfully. Cold email spam, unsolicited robocalls, and deceptive lead generation techniques are strictly prohibited and result in immediate termination without incentive payout.
        </Text>

        <Text style={styles.sectionHeading}>3. Commercial Terms & Diagnostic Proposal</Text>
        <Text style={styles.bodyText}>
          Proposed commercial packages (including the ₹37,000 Shared Business Growth & Technology Diagnostic) are subject to client contract execution. Commercial terms may be adjusted based on formal client scope.
        </Text>

        <Text style={styles.sectionHeading}>4. Financial Governance & Segregation of Duties</Text>
        <Text style={styles.bodyText}>
          All partner incentives require independent review and approval by authorized Finance personnel. Partners cannot verify payments or approve their own commissions. Payout adjustments and clawbacks are recorded in immutable append-only ledgers.
        </Text>

        <Text style={styles.sectionHeading}>5. Dispute Resolution</Text>
        <Text style={styles.bodyText}>
          Lead ownership conflicts and payout inquiries must be submitted through the internal dispute ticket workflow and are arbitrated within 7 business days.
        </Text>

        <View style={styles.finePrintBox}>
          <Text style={styles.finePrintText}>
            By accessing or signing this agreement, you affirm that you have read and agree to all terms herein under the Information Technology Act (Digital Signatures).
          </Text>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        {loadingInitial ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#4F75FF" />
            <Text style={styles.loadingText}>Checking compliance signature...</Text>
          </View>
        ) : isAccepted ? (
          <View style={styles.acceptedFooterBox}>
            <View style={styles.signedPillButton}>
              <CheckCircle2 size={18} color="#059669" />
              <Text style={styles.signedPillText}>Agreement Signed & Accepted ✓</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.replace('/(tabs)/profile')}
              style={styles.returnProfileBtn}
            >
              <Text style={styles.returnProfileText}>Return to Profile</Text>
              <ArrowRight size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <LumoraButton
            title="I Accept Terms & Code of Conduct"
            onPress={handleAccept}
            loading={loading}
            icon={<CheckCircle2 size={18} color="#FFFFFF" />}
            size="lg"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  backText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F75FF'
  },
  header: { marginBottom: 14, gap: 4 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: { fontSize: 22, fontWeight: '900', color: '#0B0F26', letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: '#4F75FF', fontWeight: '700' },
  /* Verified Signed Card */
  verifiedSignedCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    padding: 14,
    marginBottom: 14,
    gap: 10
  },
  verifiedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  verifiedIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  verifiedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  verifiedCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5
  },
  verifiedPill: {
    backgroundColor: '#059669',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  verifiedPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  verifiedCardSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857'
  },
  verifiedMetaBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: '#D1FAE5'
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  metaDateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46'
  },
  metaAuditText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669'
  },
  /* Agreement Text Scroll Area */
  scrollArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
    marginBottom: 14
  },
  scrollContent: { padding: 16, gap: 10 },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B0F26',
    marginTop: 6
  },
  bodyText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    fontWeight: '500'
  },
  finePrintBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },
  finePrintText: {
    fontSize: 10,
    color: '#94A3B8',
    lineHeight: 15,
    fontStyle: 'italic'
  },
  /* Footer Actions */
  footer: { paddingBottom: 10 },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B'
  },
  acceptedFooterBox: {
    gap: 10
  },
  signedPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    paddingVertical: 12,
    borderRadius: 14
  },
  signedPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46'
  },
  returnProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F75FF',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#4F75FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3
  },
  returnProfileText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});
