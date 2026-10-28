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
  Send,
  ChevronDown,
  ChevronUp
} from 'lucide-react-native';
import { LumoraButton } from '../components/LumoraButton';

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
          <View style={styles.iconCircle}>
            <HelpCircle size={20} color="#4F75FF" />
          </View>
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
              {activeFaq === i ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
            </View>
            {activeFaq === i && <Text style={styles.faqAnswer}>{f.a}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Create Ticket Form */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#FDF2F8' }]}>
            <MessageSquare size={20} color="#EC4899" />
          </View>
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
          placeholderTextColor="#94A3B8"
          value={subject}
          onChangeText={setSubject}
          cursorColor="#4F75FF"
          selectionColor="#4F75FF"
        />

        <Text style={styles.label}>Detailed Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the issue, lead domain, or payment reference..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          cursorColor="#4F75FF"
          selectionColor="#4F75FF"
        />

        <LumoraButton
          title="Dispatch Ticket to Operations"
          onPress={handleCreateTicket}
          icon={<Send size={16} color="#FFFFFF" />}
        />
      </View>

      {/* Ticket History */}
      {tickets.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Your Support Tickets ({tickets.length})</Text>
          {tickets.map((t) => (
            <View key={t.id} style={styles.ticketCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.ticketId}>{t.id} • {t.category}</Text>
                <View style={[styles.statusBadge, { backgroundColor: t.status === 'RESOLVED' ? '#ECFDF5' : '#FEF3C7' }]}>
                  <Text style={[styles.statusText, { color: t.status === 'RESOLVED' ? '#10B981' : '#D97706' }]}>
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
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 40, gap: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', padding: 18, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0B0F26' },
  faqItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 13, fontWeight: '600', color: '#0B0F26', flex: 1, paddingRight: 8 },
  faqAnswer: { fontSize: 12, color: '#64748B', lineHeight: 18, marginTop: 4 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155' },
  categoryRow: { flexDirection: 'row', gap: 8 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9' },
  categoryChipActive: { backgroundColor: '#4F75FF' },
  categoryText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  categoryTextActive: { color: '#FFFFFF' },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#EEF2F6', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, color: '#0B0F26', fontSize: 13 },
  textArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#EEF2F6', borderRadius: 10, padding: 12, color: '#0B0F26', fontSize: 13, textAlignVertical: 'top' },
  sectionHeader: { fontSize: 14, fontWeight: '700', color: '#0B0F26', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 6 },
  ticketCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', padding: 14, gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  ticketId: { fontSize: 12, fontWeight: '700', color: '#4F75FF' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '700' },
  ticketSubject: { fontSize: 14, fontWeight: '600', color: '#0B0F26' },
  ticketDate: { fontSize: 11, color: '#94A3B8' },
  responseBox: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, gap: 4, marginTop: 4 },
  responseTitle: { fontSize: 11, fontWeight: '700', color: '#10B981' },
  responseText: { fontSize: 12, color: '#475569', lineHeight: 16 }
});
