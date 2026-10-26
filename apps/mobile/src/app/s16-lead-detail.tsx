import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Building2,
  Globe,
  User,
  Phone,
  Mail,
  Calendar,
  Layers,
  Clock,
  Plus,
  CheckCircle2,
  FileText
} from 'lucide-react-native';

export default function LeadDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const leadId = (params.id as string) || 'lead-01-techcorp';

  const [lead, setLead] = useState({
    id: leadId,
    companyName: 'TechNova Logistics Ltd',
    website: 'technovalogistics.com',
    contactName: 'Sanjay Deshmukh',
    contactRole: 'Chief Operating Officer',
    contactEmail: 'sanjay.d@technovalogistics.com',
    contactPhone: '+91 98200 11223',
    stage: 'DIAGNOSTIC_WON',
    stageColor: '#10B981',
    businessUnit: 'Cypher Swift Technology',
    serviceInterest: 'Autonomous AI Agents',
    needSummary: 'Seeking to automate 24/7 truck driver status queries and shipment exception routing.',
    nextAction: 'Deliver diagnostic report & roadmap',
    nextActionDate: '2026-03-24'
  });

  const timeline = [
    { title: 'Diagnostic Won (₹37,000)', time: 'Yesterday', note: 'Payment receipt verified by Finance. Deal marked as Won.' },
    { title: 'Discovery Meeting Completed', time: '2 days ago', note: 'COO Sanjay confirmed readiness to deploy diagnostic audit.' },
    { title: 'Lead Registered', time: '5 days ago', note: 'Prospect registered via direct outreach.' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Company Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.stageRow}>
          <Text style={styles.buText}>{lead.businessUnit}</Text>
          <View style={[styles.stageBadge, { backgroundColor: `${lead.stageColor}20` }]}>
            <Text style={[styles.stageBadgeText, { color: lead.stageColor }]}>{lead.stage.replace('_', ' ')}</Text>
          </View>
        </View>

        <Text style={styles.companyName}>{lead.companyName}</Text>
        <Text style={styles.websiteText}>{lead.website}</Text>

        <View style={styles.contactBox}>
          <Text style={styles.contactName}>{lead.contactName} ({lead.contactRole})</Text>
          <View style={styles.contactDetailsRow}>
            <Text style={styles.contactDetail}>{lead.contactPhone}</Text>
            <Text style={styles.contactDetail}>•</Text>
            <Text style={styles.contactDetail}>{lead.contactEmail}</Text>
          </View>
        </View>
      </View>

      {/* Need Summary */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Client Need & Opportunity Scope</Text>
        <Text style={styles.infoBody}>{lead.needSummary}</Text>
        <View style={styles.serviceInterestTag}>
          <Text style={styles.serviceInterestText}>Target: {lead.serviceInterest}</Text>
        </View>
      </View>

      {/* Action Shortcuts */}
      <View style={styles.actionGrid}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/s18-book-meeting', params: { leadId: lead.id, companyName: lead.companyName } })}
          style={styles.actionBtn}
        >
          <Calendar size={18} color="#38BDF8" />
          <Text style={styles.actionBtnText}>Book Meeting</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push({ pathname: '/s17-qualification', params: { leadId: lead.id } })}
          style={styles.actionBtn}
        >
          <CheckCircle2 size={18} color="#5B8EE2" />
          <Text style={styles.actionBtnText}>Qualify Lead</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push({ pathname: '/s22-diagnostic', params: { leadId: lead.id } })}
          style={styles.actionBtn}
        >
          <Layers size={18} color="#10B981" />
          <Text style={styles.actionBtnText}>Diagnostic Deal</Text>
        </TouchableOpacity>
      </View>

      {/* Activity Timeline */}
      <Text style={styles.timelineHeader}>Activity Timeline</Text>
      <View style={styles.timelineCard}>
        {timeline.map((item, idx) => (
          <View key={idx} style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <View style={styles.timelineTop}>
                <Text style={styles.timelineTitle}>{item.title}</Text>
                <Text style={styles.timelineTime}>{item.time}</Text>
              </View>
              <Text style={styles.timelineNote}>{item.note}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 60, gap: 14 },
  headerCard: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 16 },
  stageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  buText: { fontSize: 10, fontWeight: 'bold', color: '#5B8EE2', textTransform: 'uppercase' },
  stageBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  stageBadgeText: { fontSize: 9, fontWeight: 'bold' },
  companyName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  websiteText: { fontSize: 12, color: '#38BDF8', marginTop: 1 },
  contactBox: { backgroundColor: '#101735', borderRadius: 8, padding: 10, marginTop: 12 },
  contactName: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
  contactDetailsRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  contactDetail: { fontSize: 11, color: '#94A3B8' },
  infoCard: { backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', padding: 14, gap: 6 },
  infoTitle: { fontSize: 11, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' },
  infoBody: { fontSize: 12, color: '#E2E8F0', lineHeight: 18 },
  serviceInterestTag: { alignSelf: 'flex-start', backgroundColor: '#101735', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 4 },
  serviceInterestText: { fontSize: 10, fontWeight: 'bold', color: '#5B8EE2' },
  actionGrid: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#0B1026', paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#1E294B' },
  actionBtnText: { fontSize: 11, fontWeight: 'bold', color: '#FFFFFF' },
  timelineHeader: { fontSize: 13, fontWeight: 'bold', color: '#CBD5E1', marginTop: 4 },
  timelineCard: { backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', padding: 16, gap: 16 },
  timelineItem: { flexDirection: 'row', gap: 12 },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#5B8EE2', marginTop: 4 },
  timelineContent: { flex: 1 },
  timelineTop: { flexDirection: 'row', justifyContent: 'space-between' },
  timelineTitle: { fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' },
  timelineTime: { fontSize: 10, color: '#64748B' },
  timelineNote: { fontSize: 11, color: '#94A3B8', marginTop: 2, lineHeight: 16 }
});
