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
        <ShieldAlert size={36} color="#F59E0B" />
        <Text style={styles.title}>Duplicate & Conflict Check</Text>
        <Text style={styles.subtitle}>
          Checking database for matching domains, emails, or company registrations.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.matchCard}>
          <View style={styles.matchTop}>
            <AlertTriangle size={18} color="#F59E0B" />
            <Text style={styles.matchAlert}>Potential Matching Lead Found</Text>
          </View>

          <View style={styles.matchDetails}>
            <Text style={styles.matchCompany}>{companyName}</Text>
            <Text style={styles.matchDomain}>Domain: {domain}</Text>
            <View style={styles.stageTag}>
              <Text style={styles.stageText}>Stage: CONTACTED</Text>
            </View>
          </View>

          {/* Privacy Notice */}
          <View style={styles.privacyNote}>
            <Lock size={14} color="#38BDF8" />
            <Text style={styles.privacyText}>
              Partner Privacy Protection Active: Contact phone, email, and meeting notes are protected and cannot be viewed across partners.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleRequestReview}
          style={styles.conflictBtn}
        >
          <Text style={styles.conflictBtnText}>Request Ownership Review / Claim Conflict</Text>
        </TouchableOpacity>

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
  container: { flex: 1, backgroundColor: '#070B19', padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginTop: 10 },
  subtitle: { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 4, lineHeight: 16 },
  content: { flex: 1 },
  matchCard: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 18, gap: 12 },
  matchTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  matchAlert: { fontSize: 13, fontWeight: 'bold', color: '#F59E0B' },
  matchDetails: { gap: 4 },
  matchCompany: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  matchDomain: { fontSize: 12, color: '#38BDF8' },
  stageTag: { alignSelf: 'flex-start', backgroundColor: '#101735', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginTop: 4 },
  stageText: { fontSize: 10, fontWeight: 'bold', color: '#CBD5E1' },
  privacyNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: 12, borderRadius: 8, marginTop: 4 },
  privacyText: { fontSize: 11, color: '#94A3B8', flex: 1, lineHeight: 16 },
  footer: { gap: 10, paddingBottom: 10 },
  conflictBtn: { backgroundColor: '#5B8EE2', height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  conflictBtnText: { fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' },
  cancelBtn: { backgroundColor: '#101735', height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E294B' },
  cancelBtnText: { fontSize: 12, fontWeight: 'bold', color: '#CBD5E1' }
});
