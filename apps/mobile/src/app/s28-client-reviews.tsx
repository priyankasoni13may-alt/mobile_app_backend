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
        <AlertTriangle size={18} color="#F59E0B" />
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
            placeholder="e.g. Zenith Health Systems"
            placeholderTextColor="#64748B"
            value={clientCompany}
            onChangeText={setClientCompany}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Signatory / Decision Maker Email</Text>
          <TextInput
            style={styles.input}
            placeholder="decisionmaker@company.com"
            placeholderTextColor="#64748B"
            keyboardType="email-address"
            value={clientEmail}
            onChangeText={setClientEmail}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSendRequest}
          style={styles.sendBtn}
        >
          <Send size={16} color="#FFFFFF" />
          <Text style={styles.sendBtnText}>Dispatch Standard Feedback Survey</Text>
        </TouchableOpacity>
      </View>

      {/* Past Reviews & Feedback History */}
      <Text style={styles.sectionHeader}>Client Feedback History</Text>
      {reviews.map((rev) => (
        <View key={rev.id} style={styles.reviewCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.companyName}>{rev.clientCompany}</Text>
            <View style={[styles.badge, { backgroundColor: rev.status === 'COMPLETED' ? '#10B98115' : '#5B8EE215' }]}>
              <Text style={[styles.badgeText, { color: rev.status === 'COMPLETED' ? '#10B981' : '#5B8EE2' }]}>
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
                  color={star <= rev.rating! ? '#F59E0B' : '#64748B'}
                  fill={star <= rev.rating! ? '#F59E0B' : 'transparent'}
                />
              ))}
              <Text style={styles.dateText}>{rev.date}</Text>
            </View>
          )}

          {rev.snippet && (
            <Text style={styles.snippetText}>"{rev.snippet}"</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 60, gap: 14 },
  complianceBox: { flexDirection: 'row', gap: 10, backgroundColor: '#F59E0B15', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#F59E0B40' },
  complianceTitle: { fontSize: 13, fontWeight: 'bold', color: '#FCD34D' },
  complianceText: { fontSize: 11, color: '#CBD5E1', marginTop: 4, lineHeight: 16 },
  card: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 16, gap: 12 },
  cardHeading: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  hint: { fontSize: 12, color: '#94A3B8', lineHeight: 18 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '600', color: '#CBD5E1' },
  input: { backgroundColor: '#070B19', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#FFFFFF', fontSize: 13 },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#5B8EE2', paddingVertical: 12, borderRadius: 8, marginTop: 4 },
  sendBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
  reviewCard: { backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', padding: 14, gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  companyName: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  contactName: { fontSize: 12, color: '#94A3B8' },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 11, color: '#64748B', marginLeft: 8 },
  snippetText: { fontSize: 12, color: '#CBD5E1', fontStyle: 'italic', lineHeight: 18 }
});
