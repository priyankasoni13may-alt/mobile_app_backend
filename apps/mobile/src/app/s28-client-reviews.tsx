import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Star,
  ShieldCheck,
  AlertTriangle,
  Send,
  MessageSquare,
  Building,
  UserCheck,
  CheckCircle2
} from 'lucide-react-native';
import { LumoraButton } from '../components/LumoraButton';

interface ReviewItem {
  id: string;
  clientCompany: string;
  contactName: string;
  service: string;
  status: 'COMPLETED' | 'REQUESTED' | 'DECLINED';
  rating?: number;
  snippet?: string;
  date: string;
}

const mockReviews: ReviewItem[] = [];

export default function ClientReviewsScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewItem[]>(mockReviews);
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');

  const handleSendRequest = () => {
    if (!clientEmail.trim() || !clientCompany.trim()) {
      Alert.alert('Validation Error', 'Please specify both client company name and authorized contact email.');
      return;
    }

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      clientCompany,
      contactName: clientEmail,
      service: 'Shared Business Diagnostic',
      status: 'REQUESTED',
      date: 'Just now'
    };
    setReviews([newRev, ...reviews]);
    setClientEmail('');
    setClientCompany('');
    Alert.alert('Feedback Request Dispatched', 'A standardized, compliant feedback survey invitation has been emailed to the client.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Strict Ethical & Regulatory Disclaimer */}
      <View style={styles.complianceBox}>
        <AlertTriangle size={18} color="#D97706" />
        <View style={{ flex: 1 }}>
          <Text style={styles.complianceTitle}>Review Integrity & Anti-Gating Policy</Text>
          <Text style={styles.complianceText}>
            Lumora & Cypher Swift strictly prohibit fake reviews, review gating, or offering rewards/incentives for positive feedback. All submitted client reviews are independently audited.
          </Text>
        </View>
      </View>

      {/* Request Feedback Form */}
      <View style={styles.card}>
        <Text style={styles.cardHeading}>Request Client Verification & Review</Text>
        <Text style={styles.hint}>
          Invite a client from a completed diagnostic or delivered service engagement to submit an un-gated review.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client Company Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter client company name"
            placeholderTextColor="#94A3B8"
            value={clientCompany}
            onChangeText={setClientCompany}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Signatory / Decision Maker Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter official email address"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={clientEmail}
            onChangeText={setClientEmail}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={{ marginTop: 6 }}>
          <LumoraButton
            title="Dispatch Standard Feedback Survey"
            onPress={handleSendRequest}
            icon={<Send size={16} color="#FFFFFF" />}
            size="md"
          />
        </View>
      </View>

      {/* Past Reviews & Feedback History */}
      <Text style={styles.sectionHeader}>Client Feedback History</Text>
      {reviews.length === 0 ? (
        <View style={styles.emptyCard}>
          <MessageSquare size={32} color="#94A3B8" />
          <Text style={styles.emptyTitle}>No Client Reviews Yet</Text>
          <Text style={styles.emptySub}>Client responses to dispatched feedback surveys will appear here.</Text>
        </View>
      ) : (
        reviews.map((rev) => (
          <View key={rev.id} style={styles.reviewCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.companyName}>{rev.clientCompany}</Text>
              <View style={[styles.badge, { backgroundColor: rev.status === 'COMPLETED' ? '#ECFDF5' : '#EFF6FF' }]}>
                <Text style={[styles.badgeText, { color: rev.status === 'COMPLETED' ? '#059669' : '#4F75FF' }]}>
                  {rev.status}
                </Text>
              </View>
            </View>

            <Text style={styles.contactName}>{rev.contactName} • {rev.service}</Text>

            {rev.rating && (
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    color={star <= rev.rating! ? '#D97706' : '#CBD5E1'}
                    fill={star <= rev.rating! ? '#D97706' : 'transparent'}
                  />
                ))}
                <Text style={styles.dateText}>{rev.date}</Text>
              </View>
            )}

            {rev.snippet && (
              <Text style={styles.snippetText}>"{rev.snippet}"</Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 60, gap: 14 },
  complianceBox: { flexDirection: 'row', gap: 10, backgroundColor: '#FFFBEB', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#FDE68A' },
  complianceTitle: { fontSize: 13, fontWeight: 'bold', color: '#B45309' },
  complianceText: { fontSize: 12, color: '#92400E', marginTop: 4, lineHeight: 17 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', padding: 18, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  cardHeading: { fontSize: 16, fontWeight: 'bold', color: '#0B0F26' },
  hint: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#0B0F26', fontSize: 13 },
  sectionHeader: { fontSize: 13, fontWeight: 'bold', color: '#0B0F26', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
  emptyCard: { backgroundColor: '#F8FAFC', borderRadius: 14, padding: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EEF2F6', gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: 'bold', color: '#0B0F26' },
  emptySub: { fontSize: 12, color: '#64748B', textAlign: 'center', maxWidth: 260 },
  reviewCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', padding: 16, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  companyName: { fontSize: 15, fontWeight: '700', color: '#0B0F26' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  contactName: { fontSize: 12, color: '#64748B' },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 11, color: '#64748B', marginLeft: 8 },
  snippetText: { fontSize: 12, color: '#475569', fontStyle: 'italic', lineHeight: 18 }
});
