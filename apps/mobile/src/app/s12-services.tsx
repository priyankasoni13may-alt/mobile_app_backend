import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Gift
} from 'lucide-react-native';
import { apiClient } from '../services/api';

export interface ServiceCatalogItem {
  id: string;
  name: string;
  category: 'SHARED' | 'LUMORA' | 'CYPHER';
  categoryName: string;
  businessUnitId: string;
  price: string;
  incentive: string;
  badgeColor: string;
  tagline: string;
  problemSolved: string;
  icp: string;
}

export const CATALOG_SERVICES: ServiceCatalogItem[] = [
  {
    id: 'svc-shared-diag',
    name: 'Shared Business Growth & Technology Diagnostic',
    category: 'SHARED',
    categoryName: 'Shared Diagnostic',
    businessUnitId: 'bu-lumora-growth',
    price: '₹37,000',
    incentive: '₹1,000 Payout',
    badgeColor: '#4F75FF',
    tagline: 'Comprehensive 360° audit of marketing funnel, brand clarity, and core IT infrastructure.',
    problemSolved: 'Identifies why conversion has stalled and where tech debt is hurting growth.',
    icp: 'Companies ($1M - $25M revenue) planning major digital expansion.'
  },
  {
    id: 'svc-lumora-perf',
    name: 'Omnichannel Performance Marketing Retainer',
    category: 'LUMORA',
    categoryName: 'Lumora Growth',
    businessUnitId: 'bu-lumora-growth',
    price: '₹1,50,000 / mo',
    incentive: '10% Recurring / mo',
    badgeColor: '#EC4899',
    tagline: 'Full-funnel demand generation, paid ads CRO, and creative experimentation squad.',
    problemSolved: 'Fixes high customer acquisition costs (CAC) and inconsistent inbound leads.',
    icp: 'D2C and B2B high-ticket clients needing profitable scalability.'
  },
  {
    id: 'svc-cypher-ai',
    name: 'Autonomous AI Agents & Live Consultant Implementation',
    category: 'CYPHER',
    categoryName: 'Cypher Swift Tech',
    businessUnitId: 'bu-cypher-tech',
    price: '₹3,50,000',
    incentive: '₹35,000 (10% Deal)',
    badgeColor: '#8B5CF6',
    tagline: 'End-to-end deployment of conversational AI voice/text agents with ERP/CRM workflows.',
    problemSolved: 'Eliminates 70% of routine customer support tickets and dispatch calls.',
    icp: 'Logistics, healthcare clinics, and customer support heavy mid-market operations.'
  },
  {
    id: 'svc-cypher-custom',
    name: 'Modern Web & Cross-Platform Mobile Application Development',
    category: 'CYPHER',
    categoryName: 'Cypher Swift Tech',
    businessUnitId: 'bu-cypher-tech',
    price: '₹5,00,000',
    incentive: '₹50,000 (10% Milestone)',
    badgeColor: '#0284C7',
    tagline: 'Production-ready Next.js web consoles and React Native iOS/Android mobile apps.',
    problemSolved: 'Overcomes legacy portal tech debt with clean architecture and zero bugs.',
    icp: 'Startups and scale-ups shipping high-performance digital products.'
  }
];

export default function ServicesCatalogueScreen() {
  const router = useRouter();
  const [buFilter, setBuFilter] = useState<'ALL' | 'LUMORA' | 'CYPHER' | 'SHARED'>('ALL');
  const [servicesList, setServicesList] = useState<ServiceCatalogItem[]>(CATALOG_SERVICES);

  // Sync with backend API if online
  useEffect(() => {
    let isMounted = true;
    apiClient
      .listServices()
      .then((res) => {
        if (!isMounted || !res.data || !Array.isArray(res.data) || res.data.length === 0) return;
        // Merge or update prices from server
        const updated = CATALOG_SERVICES.map((local) => {
          const match = res.data.find((remote) => remote.id === local.id);
          if (match && match.priceMinorUnits) {
            const rawVal = Number(match.priceMinorUnits) / 100;
            const formatted = rawVal > 0 ? `₹${rawVal.toLocaleString('en-IN')}` : local.price;
            return {
              ...local,
              name: match.name || local.name,
              tagline: match.description || local.tagline,
              icp: match.icp || local.icp
            };
          }
          return local;
        });
        setServicesList(updated);
      })
      .catch(() => {
        // Fallback to high-quality offline catalog
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = servicesList.filter((s) => {
    if (buFilter === 'ALL') return true;
    return s.category === buFilter;
  });

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
        <Text style={styles.navTitle}>Services Catalogue</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Horizontally Scrollable Category Filter Pills */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {[
            { id: 'ALL', label: 'All Services' },
            { id: 'SHARED', label: 'Diagnostic' },
            { id: 'LUMORA', label: 'Lumora Growth' },
            { id: 'CYPHER', label: 'Cypher Swift Tech' }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setBuFilter(tab.id as any)}
              style={[styles.pill, buFilter === tab.id && styles.pillActive]}
              activeOpacity={0.75}
            >
              <Text style={[styles.pillText, buFilter === tab.id && styles.pillTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Services List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.map((svc) => (
          <TouchableOpacity
            key={svc.id}
            activeOpacity={0.88}
            onPress={() => router.push({ pathname: '/s13-service-detail', params: { id: svc.id } })}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { backgroundColor: `${svc.badgeColor}15`, borderColor: `${svc.badgeColor}35` }]}>
                <Text style={[styles.badgeText, { color: svc.badgeColor }]}>{svc.categoryName}</Text>
              </View>
              <Text style={styles.priceText}>{svc.price}</Text>
            </View>

            <Text style={styles.cardTitle}>{svc.name}</Text>
            <Text style={styles.cardTagline}>{svc.tagline}</Text>

            {/* Incentive Badge Row */}
            <View style={styles.incentiveRow}>
              <View style={styles.incentiveTag}>
                <Gift size={13} color="#059669" />
                <Text style={styles.incentiveText}>{svc.incentive}</Text>
              </View>
            </View>

            <View style={styles.icpBox}>
              <Text style={styles.icpLabel}>Ideal Client (ICP):</Text>
              <Text style={styles.icpValue}>{svc.icp}</Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.ctaText}>View Pitch Guide & Questions</Text>
              <ChevronRight size={16} color="#4F75FF" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
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
    color: '#0F172A'
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    paddingVertical: 10
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center'
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  pillActive: {
    backgroundColor: '#4F75FF',
    borderColor: '#4F75FF'
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B'
  },
  pillTextActive: {
    color: '#FFFFFF'
  },
  listContent: {
    padding: 16,
    paddingBottom: 60,
    gap: 14
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800'
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B0F26'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B0F26',
    lineHeight: 22
  },
  cardTagline: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 5,
    lineHeight: 18
  },
  incentiveRow: {
    marginTop: 10,
    flexDirection: 'row'
  },
  incentiveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  incentiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669'
  },
  icpBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6'
  },
  icpLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  icpValue: {
    fontSize: 12,
    color: '#334155',
    marginTop: 3,
    lineHeight: 17
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6'
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F75FF'
  }
});
