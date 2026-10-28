import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Briefcase,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react-native';
import { PoweredByFooter } from '../components/PoweredByFooter';

export default function ServicesCatalogueScreen() {
  const router = useRouter();
  const [buFilter, setBuFilter] = useState<'ALL' | 'LUMORA' | 'CYPHER' | 'SHARED'>('ALL');

  const services = [
    {
      id: 'svc-shared-diag',
      name: 'Shared Business Growth & Technology Diagnostic',
      category: 'SHARED',
      categoryName: 'Shared Diagnostic',
      price: '₹37,000',
      badgeColor: '#4F75FF',
      tagline: 'Comprehensive 360° audit of marketing funnel, brand, and core IT infrastructure.',
      problemSolved: 'Identifies why conversion has stalled and where tech debt is hurting growth.',
      icp: 'Companies ($1M - $25M revenue) planning major digital expansion.'
    },
    {
      id: 'svc-lumora-perf',
      name: 'Omnichannel Performance Marketing Retainer',
      category: 'LUMORA',
      categoryName: 'Lumora Growth',
      price: '₹1,50,000 / mo',
      badgeColor: '#EC4899',
      tagline: 'Full-funnel demand generation, paid ads CRO, and creative experimentation squad.',
      problemSolved: 'Fixes high customer acquisition costs (CAC) and inconsistent inbound leads.',
      icp: 'D2C and B2B high-ticket clients needing profitable scalability.'
    },
    {
      id: 'svc-cypher-custom-ai',
      name: 'Autonomous AI Agents & Live Consultant Implementation',
      category: 'CYPHER',
      categoryName: 'Cypher Swift Tech',
      price: '₹3,50,000',
      badgeColor: '#8B5CF6',
      tagline: 'End-to-end deployment of conversational AI voice/text agents with ERP/CRM workflows.',
      problemSolved: 'Eliminates 70% of routine customer support tickets and dispatch calls.',
      icp: 'Logistics, healthcare clinics, and customer support heavy mid-market operations.'
    },
    {
      id: 'svc-cypher-web-app',
      name: 'Modern Web & Cross-Platform Mobile Application Development',
      category: 'CYPHER',
      categoryName: 'Cypher Swift Tech',
      price: '₹5,00,000',
      badgeColor: '#4F75FF',
      tagline: 'Production-ready Next.js web consoles and React Native iOS/Android mobile apps.',
      problemSolved: 'Overcomes legacy portal tech debt with clean architecture and zero bugs.',
      icp: 'Startups and scale-ups shipping high-performance digital products.'
    }
  ];

  const filtered = services.filter((s) => {
    if (buFilter === 'ALL') return true;
    return s.category === buFilter;
  });

  return (
    <View style={styles.container}>
      {/* Category Filter Pills */}
      <View style={styles.filterRow}>
        {[
          { id: 'ALL', label: 'All Services' },
          { id: 'SHARED', label: 'Diagnostic' },
          { id: 'LUMORA', label: 'Lumora Growth' },
          { id: 'CYPHER', label: 'Cypher Swift AI' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setBuFilter(tab.id as any)}
            style={[styles.pill, buFilter === tab.id && styles.pillActive]}
          >
            <Text style={[styles.pillText, buFilter === tab.id && styles.pillTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Services List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filtered.map((svc) => (
          <TouchableOpacity
            key={svc.id}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/s13-service-detail', params: { id: svc.id } })}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { backgroundColor: `${svc.badgeColor}15`, borderColor: `${svc.badgeColor}30` }]}>
                <Text style={[styles.badgeText, { color: svc.badgeColor }]}>{svc.categoryName}</Text>
              </View>
              <Text style={styles.priceText}>{svc.price}</Text>
            </View>

            <Text style={styles.cardTitle}>{svc.name}</Text>
            <Text style={styles.cardTagline}>{svc.tagline}</Text>

            <View style={styles.icpBox}>
              <Text style={styles.icpLabel}>Ideal Client:</Text>
              <Text style={styles.icpValue}>{svc.icp}</Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.ctaText}>View Pitch Guide & Questions</Text>
              <ChevronRight size={16} color="#4F75FF" />
            </View>
          </TouchableOpacity>
        ))}

        <PoweredByFooter style={{ marginTop: 24, marginBottom: 10 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  filterRow: { flexDirection: 'row', padding: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EEF2F6', gap: 8 },
  pill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  pillActive: { backgroundColor: '#4F75FF', borderColor: '#4F75FF' },
  pillText: { fontSize: 11, fontWeight: 'bold', color: '#64748B' },
  pillTextActive: { color: '#FFFFFF' },
  listContent: { padding: 16, paddingBottom: 60, gap: 14 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  priceText: { fontSize: 15, fontWeight: '800', color: '#0B0F26' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0B0F26', lineHeight: 22 },
  cardTagline: { fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 18 },
  icpBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginTop: 12, borderWidth: 1, borderColor: '#EEF2F6' },
  icpLabel: { fontSize: 10, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' },
  icpValue: { fontSize: 12, color: '#334155', marginTop: 2, lineHeight: 17 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EEF2F6' },
  ctaText: { fontSize: 12, fontWeight: 'bold', color: '#4F75FF' }
});
