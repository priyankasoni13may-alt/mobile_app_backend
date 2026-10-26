import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  Filter,
  Plus
} from 'lucide-react-native';

export default function LeadsTabScreen() {
  const router = useRouter();
  const [activeStage, setActiveStage] = useState('ALL');
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState<any[]>([]);

  const filteredLeads = leads.filter((l) => {
    if (activeStage !== 'ALL' && l.stage !== activeStage) return false;
    if (search && !l.companyName.toLowerCase().includes(search.toLowerCase()) && !l.contactName?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            placeholder="Search company or contact name..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Stage Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'MEETING_SCHEDULED', 'DIAGNOSTIC_WON'].map((st) => (
            <TouchableOpacity
              key={st}
              onPress={() => setActiveStage(st)}
              style={[styles.chip, activeStage === st && styles.chipActive]}
            >
              <Text style={[styles.chipText, activeStage === st && styles.chipTextActive]}>
                {st.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Leads List or Clean Empty State */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredLeads.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Building2 size={36} color="#64748B" />
            </View>
            <Text style={styles.emptyTitle}>No Leads Registered</Text>
            <Text style={styles.emptySubtitle}>
              You haven't registered any prospect records yet. Tap below to add your first client opportunity with zero duplicate risk!
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/s14-add-lead')}
              style={styles.addLeadBtn}
            >
              <Plus size={18} color="#FFFFFF" />
              <Text style={styles.addLeadBtnText}>Register New Prospect</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredLeads.map((lead) => (
            <TouchableOpacity
              key={lead.id}
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: '/s16-lead-detail', params: { id: lead.id } })}
              style={styles.leadCard}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.companyName}>{lead.companyName}</Text>
                  <Text style={styles.leadWebsite}>{lead.website}</Text>
                </View>
                <View style={[styles.stageBadge, { backgroundColor: `${lead.stageColor}20`, borderColor: `${lead.stageColor}50` }]}>
                  <Text style={[styles.stageText, { color: lead.stageColor }]}>{lead.stage.replace('_', ' ')}</Text>
                </View>
              </View>

              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Key Contact:</Text>
                <Text style={styles.contactValue}>{lead.contactName} ({lead.contactRole})</Text>
              </View>

              <View style={styles.serviceRow}>
                <Text style={styles.contactLabel}>Interest:</Text>
                <Text style={styles.serviceValue}>{lead.serviceInterest}</Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nextActionLabel}>Next Step:</Text>
                  <Text style={styles.nextActionValue}>{lead.nextAction}</Text>
                </View>
                <View style={styles.actionShortcuts}>
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: '/s18-book-meeting', params: { leadId: lead.id, companyName: lead.companyName } })}
                    style={styles.shortcutBtn}
                  >
                    <Calendar size={14} color="#38BDF8" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: '/s16-lead-detail', params: { id: lead.id } })}
                    style={styles.shortcutBtn}
                  >
                    <ChevronRight size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  searchContainer: { padding: 12, backgroundColor: '#0B1026', borderBottomWidth: 1, borderBottomColor: '#1E294B' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#101735', borderRadius: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: '#1E294B', height: 40 },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 13, marginLeft: 8 },
  filterScroll: { flexDirection: 'row', gap: 6, marginTop: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, backgroundColor: '#132438' },
  chipActive: { backgroundColor: '#5B8EE2' },
  chipText: { color: '#94A3B8', fontSize: 11, fontWeight: '700' },
  chipTextActive: { color: '#FFFFFF' },
  listContent: { padding: 16, paddingBottom: 80, gap: 12 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 20, gap: 12 },
  emptyIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#132438', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },
  emptySubtitle: { fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 18, maxWidth: 300 },
  addLeadBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#5B8EE2', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, marginTop: 8 },
  addLeadBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  leadCard: { backgroundColor: '#0B1026', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#1E294B', gap: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  companyName: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  leadWebsite: { fontSize: 11, color: '#64748B', marginTop: 1 },
  stageBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, borderWidth: 1 },
  stageText: { fontSize: 10, fontWeight: '800' },
  contactRow: { flexDirection: 'row', gap: 6 },
  contactLabel: { fontSize: 11, color: '#64748B', width: 70 },
  contactValue: { fontSize: 11, color: '#CBD5E1', flex: 1, fontWeight: '500' },
  serviceRow: { flexDirection: 'row', gap: 6 },
  serviceValue: { fontSize: 11, color: '#38BDF8', flex: 1, fontWeight: '500' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1E294B', paddingTop: 8, marginTop: 4 },
  nextActionLabel: { fontSize: 10, color: '#64748B' },
  nextActionValue: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
  actionShortcuts: { flexDirection: 'row', gap: 8 },
  shortcutBtn: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#132438', alignItems: 'center', justifyContent: 'center' }
});
