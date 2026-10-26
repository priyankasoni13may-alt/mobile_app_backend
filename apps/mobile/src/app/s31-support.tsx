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
import {
  HelpCircle,
  MessageSquare,
  Plus,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  ShieldAlert
} from 'lucide-react-native';

interface TicketItem {
  id: string;
  category: string;
  subject: string;
  status: 'PENDING' | 'IN_REVIEW' | 'RESOLVED';
  createdAt: string;
  responseSnippet?: string;
}

const mockTickets: TicketItem[] = [];

export default function SupportDeskScreen() {
  const [tickets, setTickets] = useState<TicketItem[]>(mockTickets);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [category, setCategory] = useState('LEAD_CLAIM');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const faqs = [
    {
      q: 'How long does duplicate lead conflict review take?',
      a: 'Operations reviews duplicate claims within 24 business hours using primary registration timestamps, prior relationship proofs, and client confirmation.'
    },
    {
      q: 'When are diagnostic and service commissions paid?',
      a: 'Commissions are approved by Finance after client payment verification and disbursed in weekly payout batches directly via NEFT/IMPS bank transfer.'
    },
    {
      q: 'What is the mandatory criterion for meeting qualification?',
      a: 'A meeting is formally qualified only after the attendee outcome, requirement fit, decision-maker presence, and next action date are recorded in Screen 20.'
    }
  ];

  const handleCreateTicket = () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Required Fields', 'Please complete both subject and description.');
      return;
    }

    const newTicket: TicketItem = {
      id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
      category,
      subject,
      status: 'PENDING',
      createdAt: 'Just now'
    };

    setTickets([newTicket, ...tickets]);
    setSubject('');
    setDescription('');
    Alert.alert('Ticket Submitted', `Ticket ${newTicket.id} created. Partner Operations will respond within 24 hours.`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* FAQ Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <HelpCircle size={18} color="#8CB4F5" />
          <Text style={styles.cardTitle}>Frequently Asked Questions</Text>
        </View>

        {faqs.map((f, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.8}
            onPress={() => setActiveFaq(activeFaq === i ? null : i)}
            style={styles.faqItem}
          >
            <View style={styles.rowBetween}>
              <Text style={styles.faqQuestion}>{f.q}</Text>
              {activeFaq === i ? <ChevronUp size={16} color="#94A3B8" /> : <ChevronDown size={16} color="#94A3B8" />}
            </View>
            {activeFaq === i && <Text style={styles.faqAnswer}>{f.a}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Create Ticket Form */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MessageSquare size={18} color="#5B8EE2" />
          <Text style={styles.cardTitle}>Submit a Partner Support Request</Text>
        </View>

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {[
            { id: 'LEAD_CLAIM', label: 'Lead Claim' },
            { id: 'COMMISSION_DISPUTE', label: 'Incentives' },
            { id: 'PLATFORM_ISSUE', label: 'Tech / App' }
          ].map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              style={[styles.categoryChip, category === cat.id && styles.categoryChipActive]}
            >
              <Text style={[styles.categoryText, category === cat.id && styles.categoryTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="Brief summary of inquiry"
          placeholderTextColor="#64748B"
          value={subject}
          onChangeText={setSubject}
        />

        <Text style={styles.label}>Detailed Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the issue, lead domain, or payment reference..."
          placeholderTextColor="#64748B"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleCreateTicket}
          style={styles.submitBtn}
        >
          <Send size={16} color="#FFFFFF" />
          <Text style={styles.submitBtnText}>Dispatch Ticket to Operations</Text>
        </TouchableOpacity>
      </View>

      {/* Ticket History */}
      <Text style={styles.sectionHeader}>Your Support Tickets ({tickets.length})</Text>
      {tickets.map((t) => (
        <View key={t.id} style={styles.ticketCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.ticketId}>{t.id} • {t.category}</Text>
            <View style={[styles.statusBadge, { backgroundColor: t.status === 'RESOLVED' ? '#10B98115' : '#F59E0B15' }]}>
              <Text style={[styles.statusText, { color: t.status === 'RESOLVED' ? '#10B981' : '#F59E0B' }]}>
                {t.status}
              </Text>
            </View>
          </View>

          <Text style={styles.ticketSubject}>{t.subject}</Text>
          <Text style={styles.ticketDate}>Submitted: {t.createdAt}</Text>

          {t.responseSnippet && (
            <View style={styles.responseBox}>
              <Text style={styles.responseTitle}>Operations Note:</Text>
              <Text style={styles.responseText}>{t.responseSnippet}</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 60, gap: 14 },
  card: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 16, gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  faqItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1E293B', gap: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 13, fontWeight: '600', color: '#CBD5E1', flex: 1, paddingRight: 8 },
  faqAnswer: { fontSize: 12, color: '#94A3B8', lineHeight: 18, marginTop: 4 },
  label: { fontSize: 12, fontWeight: '600', color: '#CBD5E1' },
  categoryRow: { flexDirection: 'row', gap: 8 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#132438' },
  categoryChipActive: { backgroundColor: '#5B8EE2' },
  categoryText: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  categoryTextActive: { color: '#FFFFFF' },
  input: { backgroundColor: '#070B19', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#FFFFFF', fontSize: 13 },
  textArea: { backgroundColor: '#070B19', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, padding: 12, color: '#FFFFFF', fontSize: 13, textAlignVertical: 'top' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#5B8EE2', paddingVertical: 12, borderRadius: 8, marginTop: 4 },
  submitBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 6 },
  ticketCard: { backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', padding: 14, gap: 6 },
  ticketId: { fontSize: 11, fontWeight: '700', color: '#8CB4F5' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: '800' },
  ticketSubject: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  ticketDate: { fontSize: 11, color: '#64748B' },
  responseBox: { backgroundColor: '#132438', padding: 10, borderRadius: 8, gap: 4, marginTop: 4 },
  responseTitle: { fontSize: 11, fontWeight: 'bold', color: '#10B981' },
  responseText: { fontSize: 11, color: '#CBD5E1', lineHeight: 16 }
});
