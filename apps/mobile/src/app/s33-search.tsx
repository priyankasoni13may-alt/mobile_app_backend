import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  X,
  Building,
  Briefcase,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react-native';
import { PoweredByFooter } from '../components/PoweredByFooter';

interface SearchResult {
  id: string;
  type: 'LEAD' | 'DEAL' | 'SERVICE';
  title: string;
  subtitle: string;
  badge: string;
  targetPath: string;
}

const mockSearchData: SearchResult[] = [
  {
    id: 'res-4',
    type: 'SERVICE',
    title: 'AI Sales Agents & Autonomous Chat Consultants',
    subtitle: 'Cypher Swift InfoTech • ICP: Mid-market B2B & Retail',
    badge: 'Catalogue',
    targetPath: '/s13-service-detail'
  },
  {
    id: 'res-5',
    type: 'SERVICE',
    title: 'Omnichannel Performance Marketing & SEO Scale',
    subtitle: 'Lumora Digital Branding • ICP: Direct-to-Consumer & SaaS',
    badge: 'Catalogue',
    targetPath: '/s13-service-detail'
  },
  {
    id: 'res-6',
    type: 'SERVICE',
    title: 'Shared Business Growth & Technology Diagnostic (₹37,000)',
    subtitle: 'Joint Lumora & Cypher Swift Diagnostic Assessment',
    badge: 'Catalogue',
    targetPath: '/s22-diagnostic'
  }
];

export default function GlobalSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'LEAD' | 'DEAL' | 'SERVICE'>('ALL');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const filteredResults = mockSearchData.filter((item) => {
    const matchesFilter = selectedFilter === 'ALL' || item.type === selectedFilter;
    const matchesQuery =
      query.trim() === '' ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const handleSelectRecent = (term: string) => {
    setQuery(term);
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'LEAD':
        return <Building size={16} color="#4F75FF" />;
      case 'DEAL':
        return <Briefcase size={16} color="#8B5CF6" />;
      case 'SERVICE':
        return <Sparkles size={16} color="#EC4899" />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.inputWrapper}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.input}
            placeholder="Search leads, deals, service catalogue..."
            placeholderTextColor="#94A3B8"
            autoFocus
            value={query}
            onChangeText={setQuery}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {(['ALL', 'LEAD', 'DEAL', 'SERVICE'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                {filter === 'ALL' ? 'All Results' : filter + 'S'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Recent Searches */}
        {query.length === 0 && recentSearches.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={() => setRecentSearches([])}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recentChips}>
              {recentSearches.map((term, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleSelectRecent(term)}
                  style={styles.recentChip}
                >
                  <Clock size={12} color="#94A3B8" />
                  <Text style={styles.recentChipText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Permission isolation note */}
        <Text style={styles.permissionHint}>
          Role Isolation Active: Only displaying authorized leads, verified deals, and published catalogue items.
        </Text>

        {/* Results List */}
        {filteredResults.length === 0 ? (
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconCircle}>
              <Search size={28} color="#4F75FF" />
            </View>
            <Text style={styles.emptyTitle}>No matching items found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your keywords or category filters.</Text>
          </View>
        ) : (
          filteredResults.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => router.push(item.targetPath as any)}
              style={styles.resultCard}
            >
              <View style={styles.typeIcon}>{getTypeIcon(item.type)}</View>

              <View style={{ flex: 1, gap: 2 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                </View>
                <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
              </View>

              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>
          ))
        )}

        <PoweredByFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  searchHeader: { backgroundColor: '#FFFFFF', padding: 14, gap: 10, borderBottomWidth: 1, borderBottomColor: '#EEF2F6' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#EEF2F6', gap: 8 },
  input: { flex: 1, color: '#0B0F26', paddingVertical: 10, fontSize: 14 },
  filterScroll: { gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F1F5F9' },
  filterChipActive: { backgroundColor: '#4F75FF' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  filterTextActive: { color: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  recentSection: { gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#0B0F26', textTransform: 'uppercase', letterSpacing: 0.5 },
  clearText: { fontSize: 12, color: '#4F75FF', fontWeight: '600' },
  recentChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  recentChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  recentChipText: { fontSize: 12, color: '#334155' },
  permissionHint: { fontSize: 11, color: '#64748B', fontStyle: 'italic', marginVertical: 2 },
  resultCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  typeIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  resultTitle: { fontSize: 14, fontWeight: '700', color: '#0B0F26' },
  resultSubtitle: { fontSize: 12, color: '#64748B', lineHeight: 17 },
  badge: { backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 11, color: '#4F75FF', fontWeight: '600' },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 8 },
  emptyIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#0B0F26' },
  emptySubtitle: { fontSize: 13, color: '#64748B' }
});
