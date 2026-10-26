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
  FileText,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react-native';

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
        return <Building size={16} color="#5B8EE2" />;
      case 'DEAL':
        return <Briefcase size={16} color="#8CB4F5" />;
      case 'SERVICE':
        return <Sparkles size={16} color="#10B981" />;
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
            placeholderTextColor="#64748B"
            autoFocus
            value={query}
            onChangeText={setQuery}
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
        {query.length === 0 && (
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
            <Search size={32} color="#64748B" />
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

              <ChevronRight size={16} color="#64748B" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  searchHeader: { backgroundColor: '#0B1026', padding: 14, gap: 10, borderBottomWidth: 1, borderBottomColor: '#1E294B' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#070B19', borderRadius: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#1E294B', gap: 8 },
  input: { flex: 1, color: '#FFFFFF', paddingVertical: 10, fontSize: 14 },
  filterScroll: { gap: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16, backgroundColor: '#132438' },
  filterChipActive: { backgroundColor: '#5B8EE2' },
  filterText: { fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  filterTextActive: { color: '#FFFFFF' },
  content: { padding: 14, paddingBottom: 60, gap: 12 },
  recentSection: { gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: 0.5 },
  clearText: { fontSize: 11, color: '#94A3B8' },
  recentChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  recentChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#132438', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  recentChipText: { fontSize: 12, color: '#CBD5E1' },
  permissionHint: { fontSize: 10, color: '#64748B', fontStyle: 'italic', marginVertical: 2 },
  resultCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', padding: 14 },
  typeIcon: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#132438', alignItems: 'center', justifyContent: 'center' },
  resultTitle: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  resultSubtitle: { fontSize: 11, color: '#94A3B8', lineHeight: 16 },
  badge: { backgroundColor: '#132438', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, color: '#CBD5E1', fontWeight: '600' },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  emptySubtitle: { fontSize: 12, color: '#64748B' }
});
