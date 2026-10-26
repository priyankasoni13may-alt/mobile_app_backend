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
  Layers,
  ChevronRight,
  Plus,
  TrendingUp,
  Banknote,
  CheckCircle2,
  Building2
} from 'lucide-react-native';

export default function SalesPipelineScreen() {
  const router = useRouter();

  const [stages, setStages] = useState([
    { id: 'WON', name: 'Closed Won (0)', deals: [] },
    { id: 'PROPOSAL', name: 'Proposed & In Review (0)', deals: [] },
    { id: 'QUALIFIED', name: 'Qualified Pipeline (0)', deals: [] }
  ]);

  const totalPipelineDeals = stages.reduce((acc, s) => acc + s.deals.length, 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.pipelineHeader}>
          <Text style={styles.headerTitle}>Active Pipeline Revenue</Text>
          <Text style={styles.headerAmount}>₹0</Text>
          <Text style={styles.headerSub}>Across Diagnostic Audits & Technology Engagements</Text>
        </View>

        {totalPipelineDeals === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Layers size={36} color="#64748B" />
            </View>
            <Text style={styles.emptyTitle}>No Active Pipeline Deals</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any deals in negotiation or closure review yet. Once you schedule discovery calls and propose diagnostic engagements, deals will appear here automatically.
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
          stages.map((stage) => (
            <View key={stage.id} style={styles.stageSection}>
              <Text style={styles.stageTitle}>{stage.name}</Text>

              <View style={styles.dealList}>
                {stage.deals.map((deal: any) => (
                  <TouchableOpacity
                    key={deal.id}
                    activeOpacity={0.85}
                    onPress={() => router.push(deal.route as any)}
                    style={styles.dealCard}
                  >
                    <View style={styles.dealTop}>
                      <Text style={styles.companyName}>{deal.companyName}</Text>
                      <Text style={styles.dealAmount}>{deal.amount}</Text>
                    </View>

                    <Text style={styles.serviceName}>{deal.serviceName}</Text>

                    <View style={styles.dealFooter}>
                      <View style={[styles.statusBadge, { backgroundColor: deal.paymentStatus === 'VERIFIED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)' }]}>
                        <Text style={[styles.statusText, { color: deal.paymentStatus === 'VERIFIED' ? '#10B981' : '#F59E0B' }]}>
                          {deal.paymentStatus}
                        </Text>
                      </View>
                      <ChevronRight size={16} color="#94A3B8" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 60, gap: 16 },
  pipelineHeader: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 20, gap: 6 },
  headerTitle: { fontSize: 11, fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerAmount: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  headerSub: { fontSize: 11, color: '#64748B' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50, paddingHorizontal: 20, gap: 12 },
  emptyIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#132438', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },
  emptySubtitle: { fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 18, maxWidth: 300 },
  addLeadBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#5B8EE2', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, marginTop: 8 },
  addLeadBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  stageSection: { gap: 8 },
  stageTitle: { fontSize: 13, fontWeight: 'bold', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: 0.5 },
  dealList: { gap: 10 },
  dealCard: { backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', padding: 14, gap: 8 },
  dealTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  companyName: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  dealAmount: { fontSize: 15, fontWeight: 'bold', color: '#10B981' },
  serviceName: { fontSize: 12, color: '#38BDF8' },
  dealFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1E294B', paddingTop: 8, marginTop: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: '800' }
});
