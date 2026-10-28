import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ShieldAlert,
  CheckCircle2,
  Building2,
  ArrowRight,
  AlertTriangle,
  Lock
} from 'lucide-react-native';
import { LumoraButton } from '../components/LumoraButton';
import { PoweredByFooter } from '../components/PoweredByFooter';

export default function DuplicateCheckScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const companyName = (params.companyName as string) || '';
  const domain = (params.companyWebsite as string) || '';

  const [hasMatches, setHasMatches] = useState(Boolean(params.companyName || params.companyWebsite));

  const handleRequestReview = () => {
    Alert.alert(
      'Ownership Conflict Claim Submitted',
      'Your claim has been submitted to Operations for arbitration under Rule 5.2. You will receive an in-app notification when reviewed.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ShieldAlert size={36} color="#D97706" />
        <Text style={styles.title}>Duplicate & Conflict Check</Text>
        <Text style={styles.subtitle}>
          Checking database for matching domains, emails, or company registrations.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.matchCard}>
          <View style={styles.matchTop}>
            <AlertTriangle size={18} color="#D97706" />
            <Text style={styles.matchAlert}>Potential Matching Lead Found</Text>
          </View>

          <View style={styles.matchDetails}>
            <Text style={styles.matchCompany}>{companyName || 'Lead Record'}</Text>
            {domain ? <Text style={styles.matchDomain}>Domain: {domain}</Text> : null}
            <View style={styles.stageTag}>
              <Text style={styles.stageText}>Stage: CONTACTED</Text>
            </View>
          </View>

          {/* Privacy Notice */}
          <View style={styles.privacyNote}>
            <Lock size={14} color="#4F75FF" />
            <Text style={styles.privacyText}>
              Partner Privacy Protection Active: Contact phone, email, and meeting notes are protected and cannot be viewed across partners.
            </Text>
          </View>
        </View>

        <PoweredByFooter style={{ marginTop: 24, marginBottom: 10 }} />
      </ScrollView>

      <View style={styles.footer}>
        <LumoraButton
          title="Request Ownership Review"
          onPress={handleRequestReview}
          size="md"
        />

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.cancelBtn}
        >
          <Text style={styles.cancelBtnText}>Cancel & Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0B0F26', marginTop: 10 },
  subtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 4, lineHeight: 18 },
  content: { flex: 1 },
  matchCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', padding: 18, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  matchTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  matchAlert: { fontSize: 13, fontWeight: 'bold', color: '#D97706' },
  matchDetails: { gap: 4 },
  matchCompany: { fontSize: 16, fontWeight: 'bold', color: '#0B0F26' },
  matchDomain: { fontSize: 12, color: '#4F75FF' },
  stageTag: { alignSelf: 'flex-start', backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginTop: 4 },
  stageText: { fontSize: 10, fontWeight: 'bold', color: '#4F75FF' },
  privacyNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#EFF6FF', padding: 12, borderRadius: 8, marginTop: 4, borderWidth: 1, borderColor: '#DBEAFE' },
  privacyText: { fontSize: 11, color: '#1E40AF', flex: 1, lineHeight: 16 },
  footer: { gap: 10, paddingBottom: 10 },
  cancelBtn: { backgroundColor: '#F1F5F9', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  cancelBtnText: { fontSize: 13, fontWeight: 'bold', color: '#0B0F26' }
});
