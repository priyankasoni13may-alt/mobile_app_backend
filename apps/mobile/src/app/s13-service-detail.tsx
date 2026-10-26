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
  Briefcase,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  Copy,
  Plus,
  ArrowRight
} from 'lucide-react-native';

export default function ServiceDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const serviceId = (params.id as string) || 'svc-shared-diag';

  const [activeSection, setActiveSection] = useState<'PITCH' | 'QUESTIONS' | 'OBJECTIONS' | 'CASE_STUDIES'>('PITCH');

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.header}>
        <Text style={styles.serviceCategory}>Shared Diagnostic Package</Text>
        <Text style={styles.serviceTitle}>Shared Business Growth & Technology Diagnostic</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceValue}>₹37,000</Text>
          <Text style={styles.incentiveBadge}>Partner Incentive: ₹1,000</Text>
        </View>
      </View>

      {/* Nav Tabs */}
      <View style={styles.navTabs}>
        {[
          { id: 'PITCH', label: 'Pitch Guide' },
          { id: 'QUESTIONS', label: 'Qualifying' },
          { id: 'OBJECTIONS', label: 'Objections' },
          { id: 'CASE_STUDIES', label: 'Case Studies' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveSection(tab.id as any)}
            style={[styles.tabBtn, activeSection === tab.id && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeSection === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentArea}>
        {activeSection === 'PITCH' && (
          <View style={styles.sectionArea}>
            <Text style={styles.sectionHeader}>Pitch Positioning</Text>
            <Text style={styles.bodyText}>
              "Before investing lakhs into unverified agencies or rebuilding systems blindly, this 14-day diagnostic evaluates your full customer journey, brand clarity, and technology bottlenecks with zero bias."
            </Text>

            <Text style={styles.sectionHeader}>Deliverables Included</Text>
            {[
              '360° Omnichannel Marketing & SEO Funnel Audit',
              'Cloud Architecture, Codebase Debt & API Review',
              'Competitor CAC and Tech Stack Benchmarking',
              '40-Page Actionable Growth Roadmap + Exec Presentation'
            ].map((inc, i) => (
              <View key={i} style={styles.bulletRow}>
                <CheckCircle2 size={16} color="#10B981" />
                <Text style={styles.bulletText}>{inc}</Text>
              </View>
            ))}

            <Text style={styles.sectionHeader}>Explicit Exclusions</Text>
            {[
              'Code refactoring or active bug fixes during the audit phase',
              'Ad spend media fees'
            ].map((exc, i) => (
              <View key={i} style={styles.bulletRow}>
                <XCircle size={16} color="#EF4444" />
                <Text style={styles.bulletText}>{exc}</Text>
              </View>
            ))}
          </View>
        )}

        {activeSection === 'QUESTIONS' && (
          <View style={styles.sectionArea}>
            <Text style={styles.sectionHeader}>Qualifying Questions Checklist</Text>
            {[
              '1. Are you planning significant digital marketing or tech investments over the next 6-12 months?',
              '2. What is your current monthly inbound lead volume or ad spend?',
              '3. Have you identified bottlenecks in customer retention or tech scalability?',
              '4. Who on the executive team would attend the final diagnostic presentation?'
            ].map((q, i) => (
              <View key={i} style={styles.questionCard}>
                <HelpCircle size={16} color="#38BDF8" />
                <Text style={styles.questionText}>{q}</Text>
              </View>
            ))}
          </View>
        )}

        {activeSection === 'OBJECTIONS' && (
          <View style={styles.sectionArea}>
            <Text style={styles.sectionHeader}>Objection Handling Playbook</Text>
            <View style={styles.objectionCard}>
              <Text style={styles.objQuestion}>"We already have an in-house agency."</Text>
              <Text style={styles.objAnswer}>
                Response: "Our diagnostic isn't meant to replace them, but to give executive leadership an unbiased audit of agency ROI, technical leakage, and unexploited growth vectors."
              </Text>
            </View>

            <View style={styles.objectionCard}>
              <Text style={styles.objQuestion}>"₹37,000 seems high for an audit."</Text>
              <Text style={styles.objAnswer}>
                Response: "Most companies waste ₹2-5 Lakhs every single month on misaligned ad campaigns or poor hosting architecture. This audit pays for itself by plugging leakage in the first 30 days."
              </Text>
            </View>
          </View>
        )}

        {activeSection === 'CASE_STUDIES' && (
          <View style={styles.sectionArea}>
            <Text style={styles.sectionHeader}>Verified Client Case Studies</Text>
            <View style={styles.caseCard}>
              <View style={styles.caseBadge}>
                <TrendingUp size={14} color="#10B981" />
                <Text style={styles.caseBadgeText}>3.4x Pipeline Growth</Text>
              </View>
              <Text style={styles.caseTitle}>Apex Retail Solutions</Text>
              <Text style={styles.caseDesc}>
                Identified checkout abandonment bottleneck and CRM sync delays, reducing customer drop-off by 42%.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: '/s14-add-lead', params: { serviceInterest: 'Shared Business Growth & Technology Diagnostic' } })}
          style={styles.createLeadBtn}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.createLeadText}>Create Lead For This Service</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  header: { padding: 16, backgroundColor: '#0B1026', borderBottomWidth: 1, borderBottomColor: '#1E294B' },
  serviceCategory: { fontSize: 10, fontWeight: 'bold', color: '#5B8EE2', textTransform: 'uppercase' },
  serviceTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  priceValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  incentiveBadge: { fontSize: 11, fontWeight: 'bold', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  navTabs: { flexDirection: 'row', backgroundColor: '#0B1026', borderBottomWidth: 1, borderBottomColor: '#1E294B' },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#5B8EE2' },
  tabText: { fontSize: 11, fontWeight: 'bold', color: '#94A3B8' },
  tabTextActive: { color: '#5B8EE2' },
  contentScroll: { flex: 1 },
  contentArea: { padding: 16, paddingBottom: 80 },
  sectionArea: { gap: 12 },
  sectionHeader: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF', marginTop: 4 },
  bodyText: { fontSize: 12, color: '#CBD5E1', lineHeight: 18, fontStyle: 'italic', backgroundColor: '#0B1026', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#1E294B' },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletText: { fontSize: 12, color: '#E2E8F0', flex: 1, lineHeight: 16 },
  questionCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#0B1026', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#1E294B' },
  questionText: { fontSize: 12, color: '#FFFFFF', flex: 1, lineHeight: 18 },
  objectionCard: { backgroundColor: '#0B1026', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#1E294B', gap: 6 },
  objQuestion: { fontSize: 12, fontWeight: 'bold', color: '#5B8EE2' },
  objAnswer: { fontSize: 12, color: '#CBD5E1', lineHeight: 16 },
  caseCard: { backgroundColor: '#0B1026', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#1E294B', gap: 6 },
  caseBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  caseBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#10B981' },
  caseTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  caseDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 16 },
  footer: { padding: 14, backgroundColor: '#0B1026', borderTopWidth: 1, borderTopColor: '#1E294B' },
  createLeadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#5B8EE2', height: 48, borderRadius: 10 },
  createLeadText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }
});
