import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  Zap
} from 'lucide-react-native';
import { LumoraButton } from '../components/LumoraButton';
import { apiClient } from '../services/api';

interface ServiceDetailData {
  id: string;
  category: string;
  businessUnitId: string;
  name: string;
  price: string;
  incentive: string;
  pitch: string;
  deliverables: string[];
  exclusions: string[];
  questions: string[];
  objections: Array<{ q: string; a: string }>;
  caseStudy: {
    badge: string;
    title: string;
    desc: string;
  };
}

const SERVICE_DETAILS_MAP: Record<string, ServiceDetailData> = {
  'svc-shared-diag': {
    id: 'svc-shared-diag',
    category: 'Shared Diagnostic Package',
    businessUnitId: 'bu-lumora-growth',
    name: 'Shared Business Growth & Technology Diagnostic',
    price: '₹37,000',
    incentive: 'Partner Incentive: ₹1,000 Payout',
    pitch:
      'Before investing lakhs into unverified agencies or rebuilding systems blindly, this 14-day diagnostic evaluates your full customer journey, brand clarity, and technology bottlenecks with zero bias.',
    deliverables: [
      '360° Omnichannel Marketing & SEO Funnel Audit',
      'Cloud Architecture, Codebase Debt & API Scalability Review',
      'Competitor CAC and Tech Stack Benchmarking',
      '40-Page Actionable Growth Roadmap + Executive Board Presentation'
    ],
    exclusions: [
      'Code refactoring or active bug fixes during the audit phase',
      'Media ad spend fees paid directly to ad networks'
    ],
    questions: [
      '1. Are you planning significant digital marketing or tech investments over the next 6-12 months?',
      '2. What is your current monthly inbound lead volume or ad spend?',
      '3. Have you identified bottlenecks in customer retention or tech scalability?',
      '4. Who on the executive team would attend the final diagnostic presentation?'
    ],
    objections: [
      {
        q: 'We already have an in-house agency / marketing team.',
        a: 'Our diagnostic isn’t meant to replace them, but to give executive leadership an unbiased audit of agency ROI, technical leakage, and unexploited growth vectors.'
      },
      {
        q: '₹37,000 seems high for an exploratory audit.',
        a: 'Most mid-market companies waste ₹2-5 Lakhs every single month on misaligned ad campaigns or poor hosting architecture. This audit pays for itself by plugging leakage in the first 30 days.'
      }
    ],
    caseStudy: {
      badge: '3.4x Pipeline Growth',
      title: 'Apex Retail Omnichannel Diagnostic',
      desc: 'Identified checkout abandonment bottleneck and CRM sync delays, reducing customer drop-off by 42% within 30 days.'
    }
  },

  'svc-lumora-perf': {
    id: 'svc-lumora-perf',
    category: 'Lumora Growth Retainer',
    businessUnitId: 'bu-lumora-growth',
    name: 'Omnichannel Performance Marketing Retainer',
    price: '₹1,50,000 / mo',
    incentive: 'Partner Incentive: 10% Recurring (~₹15,000/mo)',
    pitch:
      'Stop burning cash on generic ad agencies that report vanity impressions. Lumora deploys an elite growth squad dedicated to end-to-end customer acquisition, ROAS optimization, and high-converting landing pages.',
    deliverables: [
      'Multi-platform paid media management (Google Ads, Meta Ads, LinkedIn Ads)',
      'Full-funnel Conversion Rate Optimization (CRO) & high-converting landing page builds',
      'Weekly creative experimentation squad (hooks, copy, motion graphics)',
      'First-party server-side attribution and transparent weekly ROAS executive analytics'
    ],
    exclusions: [
      'Media ad spend budget (paid directly by client to ad platforms)',
      'Offline PR, print media, or event booth sponsorships'
    ],
    questions: [
      '1. What is your current monthly ad spend across Google, Meta, or LinkedIn?',
      '2. What is your current Customer Acquisition Cost (CAC) and Customer Lifetime Value (LTV)?',
      '3. Do you have dedicated sales follow-up or automated CRM nurturing for inbound leads?',
      '4. Is your monthly digital ad budget at least ₹3-5 Lakhs?'
    ],
    objections: [
      {
        q: 'Meta and Google ads are too saturated for our niche.',
        a: 'Ad saturation only penalizes generic creatives. We engineer dynamic, first-party attributed funnels with algorithmic fatigue protection that consistently outperform generic agency campaigns.'
      },
      {
        q: 'We were burned by our previous digital marketing agency.',
        a: 'Most agencies lock you in without clear attribution. Lumora works on transparent weekly sprint deliverables, direct dashboard visibility, and strict pipeline attribution.'
      }
    ],
    caseStudy: {
      badge: '42% Lower CAC',
      title: 'FinFlow Loans Cross-Channel Scale',
      desc: 'Engineered cross-channel lookalike funnels and CRO landing pages, doubling qualified inbound pipeline in 60 days.'
    }
  },

  'svc-cypher-ai': {
    id: 'svc-cypher-ai',
    category: 'Cypher Swift AI Solutions',
    businessUnitId: 'bu-cypher-tech',
    name: 'Autonomous AI Agents & Live Consultant Implementation',
    price: '₹3,50,000',
    incentive: 'Partner Incentive: 10% Closure (~₹35,000)',
    pitch:
      'Scale your operational throughput 10x without hiring a 50-person call center. Cypher Swift deploys enterprise-grade autonomous AI agents that resolve customer queries, schedule appointments, and update ERP/CRM in real-time.',
    deliverables: [
      'Custom LLM fine-tuning with enterprise guardrails & zero-hallucination RAG',
      'Bi-directional API connectors to ERP/CRM (HubSpot, Salesforce, Zoho, SAP)',
      'Multi-channel voice & WhatsApp conversational automation workflows',
      'Enterprise VPC deployment with SOC2 & DPDP Act data privacy compliance'
    ],
    exclusions: [
      'Third-party LLM token fees (OpenAI/Anthropic consumption billed directly to client)',
      'On-premise hardware server procurement'
    ],
    questions: [
      '1. How many routine support tickets, WhatsApp inquiries, or inbound calls do you handle daily?',
      '2. What ERP, CRM, or ticketing systems (Salesforce, HubSpot, Zoho, Freshdesk) are you currently using?',
      '3. How much time does your team spend manually looking up customer data and answering repetitive queries?',
      '4. Is leadership actively budgeting for AI-driven operational efficiency this quarter?'
    ],
    objections: [
      {
        q: 'We are concerned about AI hallucinations or giving wrong information to clients.',
        a: 'We implement deterministic retrieval guardrails, strict fallback prompts, and human escalation workflows. If the AI confidence score drops below 95%, it smoothly hands off to a human agent.'
      },
      {
        q: 'Where is our confidential corporate and customer data stored?',
        a: 'All vector stores and models are deployed strictly within your private cloud VPC (AWS/GCP/Azure) with end-to-end encryption. No proprietary customer data ever leaks to public models.'
      }
    ],
    caseStudy: {
      badge: '88% First-Contact Resolution',
      title: 'LogiX Logistics Automated Dispatch',
      desc: 'Autonomous tracking & dispatch agent processed 14,000 monthly inquiries 24/7, reducing support ticket turnaround from 4 hours to 8 seconds.'
    }
  },

  'svc-cypher-custom': {
    id: 'svc-cypher-custom',
    category: 'Cypher Swift Engineering',
    businessUnitId: 'bu-cypher-tech',
    name: 'Modern Web & Cross-Platform Mobile Application Development',
    price: '₹5,00,000',
    incentive: 'Partner Incentive: 10% Milestone (~₹50,000)',
    pitch:
      'Avoid the 6-month delay and bloated costs of hiring in-house engineers. Cypher Swift delivers high-performance, battle-tested React Native mobile apps and Next.js platforms built to scale from day one.',
    deliverables: [
      'Complete UI/UX design system in Figma with clickable prototypes',
      'Cross-platform React Native iOS & Android apps with native smoothness',
      'Production-ready NestJS / PostgreSQL backend with microservices architecture',
      'Automated CI/CD pipeline, App Store / Google Play release, and 90-day post-launch warranty'
    ],
    exclusions: [
      'Third-party SaaS API license subscriptions (Twilio, AWS hosting, etc.)',
      'Ongoing post-warranty retainer (available as an optional separate maintenance contract)'
    ],
    questions: [
      '1. Do you have documented functional requirements, wireframes, or a specification document?',
      '2. What is your target go-to-market or product launch deadline?',
      '3. What backend or third-party integrations (payment gateways, ERP, auth) are required?',
      '4. Is there an approved engineering budget of ₹5 Lakhs+ for this initiative?'
    ],
    objections: [
      {
        q: 'Shouldn’t we hire an internal tech team instead of an agency?',
        a: 'Hiring, onboarding, and managing a senior engineering squad takes 4-6 months and costs ₹15-20 Lakhs before writing line one. We deploy an experienced senior team within 14 days and transfer 100% IP ownership upon completion.'
      },
      {
        q: 'Will we own the complete source code and intellectual property?',
        a: 'Yes, absolutely. 100% of the repository, source code, Figma files, and IP rights transfer exclusively to your company under a formal IP assignment agreement.'
      }
    ],
    caseStudy: {
      badge: '4.9 Stars on App Store',
      title: 'Zenith Telehealth Platform',
      desc: 'Designed and shipped HIPAA-compliant telemedicine iOS & Android application in 8 weeks, scaling to 50,000 active consultations.'
    }
  }
};

export default function ServiceDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const serviceId = (params.id as string) || 'svc-shared-diag';

  // Resolve service data from catalog (with fallback to diagnostic)
  const service = SERVICE_DETAILS_MAP[serviceId] || SERVICE_DETAILS_MAP['svc-shared-diag'];

  const [activeSection, setActiveSection] = useState<'PITCH' | 'QUESTIONS' | 'OBJECTIONS' | 'CASE_STUDIES'>('PITCH');

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          Pitch Guide & ICP
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Title Header */}
      <View style={styles.header}>
        <Text style={styles.serviceCategory}>{service.category}</Text>
        <Text style={styles.serviceTitle}>{service.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceValue}>{service.price}</Text>
          <Text style={styles.incentiveBadge}>{service.incentive}</Text>
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
            <Text style={styles.sectionHeader}>Pitch Positioning Script</Text>
            <Text style={styles.bodyText}>"{service.pitch}"</Text>

            <Text style={styles.sectionHeader}>Deliverables Included</Text>
            {service.deliverables.map((inc, i) => (
              <View key={i} style={styles.bulletRow}>
                <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2 }} />
                <Text style={styles.bulletText}>{inc}</Text>
              </View>
            ))}

            <Text style={styles.sectionHeader}>Explicit Exclusions</Text>
            {service.exclusions.map((exc, i) => (
              <View key={i} style={styles.bulletRow}>
                <XCircle size={16} color="#EF4444" style={{ marginTop: 2 }} />
                <Text style={styles.bulletText}>{exc}</Text>
              </View>
            ))}
          </View>
        )}

        {activeSection === 'QUESTIONS' && (
          <View style={styles.sectionArea}>
            <Text style={styles.sectionHeader}>Qualifying Questions Checklist</Text>
            {service.questions.map((q, i) => (
              <View key={i} style={styles.questionCard}>
                <HelpCircle size={16} color="#4F75FF" style={{ marginTop: 2 }} />
                <Text style={styles.questionText}>{q}</Text>
              </View>
            ))}
          </View>
        )}

        {activeSection === 'OBJECTIONS' && (
          <View style={styles.sectionArea}>
            <Text style={styles.sectionHeader}>Objection Handling Playbook</Text>
            {service.objections.map((item, i) => (
              <View key={i} style={styles.objectionCard}>
                <Text style={styles.objQuestion}>"{item.q}"</Text>
                <Text style={styles.objAnswer}>
                  <Text style={{ fontWeight: '700', color: '#0F172A' }}>Consultant Script: </Text>
                  {item.a}
                </Text>
              </View>
            ))}
          </View>
        )}

        {activeSection === 'CASE_STUDIES' && (
          <View style={styles.sectionArea}>
            <Text style={styles.sectionHeader}>Verified Client Case Study</Text>
            <View style={styles.caseCard}>
              <View style={styles.caseBadge}>
                <TrendingUp size={14} color="#059669" />
                <Text style={styles.caseBadgeText}>{service.caseStudy.badge}</Text>
              </View>
              <Text style={styles.caseTitle}>{service.caseStudy.title}</Text>
              <Text style={styles.caseDesc}>{service.caseStudy.desc}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Footer */}
      <View style={styles.footer}>
        <LumoraButton
          title={`Register Lead For ${service.name.length > 25 ? service.name.slice(0, 22) + '...' : service.name}`}
          onPress={() =>
            router.push({
              pathname: '/s14-add-lead',
              params: {
                serviceInterest: service.name,
                businessUnitId: service.businessUnitId
              }
            })
          }
          icon={<Plus size={18} color="#FFFFFF" />}
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center'
  },
  header: { padding: 18, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EEF2F6' },
  serviceCategory: { fontSize: 11, fontWeight: '800', color: '#4F75FF', textTransform: 'uppercase', letterSpacing: 0.5 },
  serviceTitle: { fontSize: 18, fontWeight: '800', color: '#0B0F26', marginTop: 4, lineHeight: 24 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' },
  priceValue: { fontSize: 22, fontWeight: '800', color: '#0B0F26' },
  incentiveBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  navTabs: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EEF2F6' },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#4F75FF' },
  tabText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#4F75FF' },
  contentScroll: { flex: 1 },
  contentArea: { padding: 16, paddingBottom: 80 },
  sectionArea: { gap: 14 },
  sectionHeader: { fontSize: 14, fontWeight: '800', color: '#0B0F26', marginTop: 4 },
  bodyText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    fontStyle: 'italic',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6'
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletText: { fontSize: 13, color: '#334155', flex: 1, lineHeight: 18 },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6'
  },
  questionText: { fontSize: 13, color: '#0B0F26', flex: 1, lineHeight: 18, fontWeight: '500' },
  objectionCard: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#EEF2F6', gap: 6 },
  objQuestion: { fontSize: 13, fontWeight: '800', color: '#4F75FF' },
  objAnswer: { fontSize: 12, color: '#475569', lineHeight: 18 },
  caseCard: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EEF2F6', gap: 6 },
  caseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  caseBadgeText: { fontSize: 11, fontWeight: '800', color: '#059669' },
  caseTitle: { fontSize: 15, fontWeight: '800', color: '#0B0F26' },
  caseDesc: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  footer: { padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEF2F6' }
});
