import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { FileCheck, Shield, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { apiClient } from '../services/api';
import { LumoraButton } from '../components/LumoraButton';

export default function AgreementScreen() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await apiClient.acceptAgreement('agr-2026-v1');
      setAccepted(true);
      router.push('/s09-status');
    } catch {
      // In dev fallback, proceed
      setAccepted(true);
      router.push('/s09-status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Partner Code of Conduct</Text>
        <Text style={styles.subtitle}>
          Version 2026.1 — Effective January 1, 2026
        </Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
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
      </ScrollView>

      <View style={styles.footer}>
        <LumoraButton
          title="I Accept Terms & Code of Conduct"
          onPress={handleAccept}
          loading={loading}
          icon={<CheckCircle2 size={18} color="#FFFFFF" />}
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0B0F26' },
  subtitle: { fontSize: 13, color: '#4F75FF', marginTop: 3, fontWeight: '600' },
  scrollArea: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', marginBottom: 16 },
  scrollContent: { padding: 18, gap: 10 },
  sectionHeading: { fontSize: 13, fontWeight: 'bold', color: '#0B0F26', marginTop: 6 },
  bodyText: { fontSize: 12, color: '#475569', lineHeight: 18 },
  footer: { paddingBottom: 10 }
});
