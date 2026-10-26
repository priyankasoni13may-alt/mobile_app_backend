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
      badgeColor: '#5B8EE2',
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
      badgeColor: '#5B8EE2',
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
      badgeColor: '#38BDF8',
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
      badgeColor: '#38BDF8',
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
              <View style={[styles.badge, { backgroundColor: `${svc.badgeColor}20`, borderColor: `${svc.badgeColor}40` }]}>
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
              <ChevronRight size={16} color="#5B8EE2" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  filterRow: { flexDirection: 'row', padding: 12, backgroundColor: '#0B1026', borderBottomWidth: 1, borderBottomColor: '#1E294B', gap: 6 },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: '#101735', borderWidth: 1, borderColor: '#1E294B' },
  pillActive: { backgroundColor: '#5B8EE2', borderColor: '#5B8EE2' },
  pillText: { fontSize: 11, fontWeight: 'bold', color: '#94A3B8' },
  pillTextActive: { color: '#FFFFFF' },
  listContent: { padding: 14, paddingBottom: 60, gap: 14 },
  card: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  badgeText: { fontSize: 9, fontWeight: 'bold' },
  priceText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  cardTagline: { fontSize: 12, color: '#94A3B8', marginTop: 4, lineHeight: 16 },
  icpBox: { backgroundColor: '#101735', padding: 10, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#1E294B' },
  icpLabel: { fontSize: 10, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' },
  icpValue: { fontSize: 11, color: '#E2E8F0', marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#101735' },
  ctaText: { fontSize: 12, fontWeight: 'bold', color: '#5B8EE2' }
});
