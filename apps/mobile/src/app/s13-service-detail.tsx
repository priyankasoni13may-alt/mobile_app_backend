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
import { LumoraButton } from '../components/LumoraButton';
import { PoweredByFooter } from '../components/PoweredByFooter';

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
                <TrendingUp size={14} color="#059669" />
                <Text style={styles.caseBadgeText}>3.4x Pipeline Growth</Text>
              </View>
              <Text style={styles.caseTitle}>Omnichannel Retail Growth & Diagnostic</Text>
              <Text style={styles.caseDesc}>
                Identified checkout abandonment bottleneck and CRM sync delays, reducing customer drop-off by 42%.
              </Text>
            </View>
          </View>
        )}

        <PoweredByFooter style={{ marginTop: 24, marginBottom: 10 }} />
      </ScrollView>

      {/* Bottom Action Footer */}
      <View style={styles.footer}>
        <LumoraButton
          title="Create Lead For This Service"
          onPress={() => router.push({ pathname: '/s14-add-lead', params: { serviceInterest: 'Shared Business Growth & Technology Diagnostic' } })}
          icon={<Plus size={18} color="#FFFFFF" />}
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 18, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EEF2F6' },
  serviceCategory: { fontSize: 11, fontWeight: 'bold', color: '#4F75FF', textTransform: 'uppercase', letterSpacing: 0.5 },
  serviceTitle: { fontSize: 18, fontWeight: 'bold', color: '#0B0F26', marginTop: 4, lineHeight: 24 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  priceValue: { fontSize: 22, fontWeight: '800', color: '#0B0F26' },
  incentiveBadge: { fontSize: 11, fontWeight: 'bold', color: '#059669', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: '#A7F3D0' },
  navTabs: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EEF2F6' },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#4F75FF' },
  tabText: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
  tabTextActive: { color: '#4F75FF' },
  contentScroll: { flex: 1 },
  contentArea: { padding: 16, paddingBottom: 80 },
  sectionArea: { gap: 14 },
  sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#0B0F26', marginTop: 4 },
  bodyText: { fontSize: 13, color: '#334155', lineHeight: 20, fontStyle: 'italic', backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#EEF2F6' },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletText: { fontSize: 13, color: '#334155', flex: 1, lineHeight: 18 },
  questionCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#EEF2F6' },
  questionText: { fontSize: 13, color: '#0B0F26', flex: 1, lineHeight: 18 },
  objectionCard: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#EEF2F6', gap: 6 },
  objQuestion: { fontSize: 13, fontWeight: 'bold', color: '#4F75FF' },
  objAnswer: { fontSize: 12, color: '#475569', lineHeight: 18 },
  caseCard: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EEF2F6', gap: 6 },
  caseBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: '#A7F3D0' },
  caseBadgeText: { fontSize: 11, fontWeight: 'bold', color: '#059669' },
  caseTitle: { fontSize: 15, fontWeight: 'bold', color: '#0B0F26' },
  caseDesc: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  footer: { padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEF2F6' }
});
