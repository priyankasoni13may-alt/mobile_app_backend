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
import { LumoraButton } from '../components/LumoraButton';

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
              <Layers size={36} color="#4F75FF" />
            </View>
            <Text style={styles.emptyTitle}>No Active Pipeline Deals</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any deals in negotiation or closure review yet. Once you schedule discovery calls and propose diagnostic engagements, deals will appear here automatically.
            </Text>
            <View style={{ width: '100%', maxWidth: 260, marginTop: 8 }}>
              <LumoraButton
                title="Register New Prospect"
                onPress={() => router.push('/s14-add-lead')}
                icon={<Plus size={18} color="#FFFFFF" />}
                size="md"
              />
            </View>
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
                      <View style={[styles.statusBadge, { backgroundColor: deal.paymentStatus === 'VERIFIED' ? '#ECFDF5' : '#FFFBEB' }]}>
                        <Text style={[styles.statusText, { color: deal.paymentStatus === 'VERIFIED' ? '#059669' : '#D97706' }]}>
                          {deal.paymentStatus}
                        </Text>
                      </View>
                      <ChevronRight size={16} color="#64748B" />
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 60, gap: 16 },
  pipelineHeader: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', padding: 20, gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  headerTitle: { fontSize: 11, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerAmount: { fontSize: 34, fontWeight: '800', color: '#0B0F26' },
  headerSub: { fontSize: 12, color: '#64748B' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50, paddingHorizontal: 20, gap: 12 },
  emptyIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#0B0F26' },
  emptySubtitle: { fontSize: 12, color: '#64748B', textAlign: 'center', lineHeight: 18, maxWidth: 300 },
  stageSection: { gap: 8 },
  stageTitle: { fontSize: 13, fontWeight: 'bold', color: '#0B0F26', textTransform: 'uppercase', letterSpacing: 0.5 },
  dealList: { gap: 10 },
  dealCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F6', padding: 16, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  dealTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  companyName: { fontSize: 15, fontWeight: 'bold', color: '#0B0F26' },
  dealAmount: { fontSize: 15, fontWeight: 'bold', color: '#059669' },
  serviceName: { fontSize: 12, color: '#4F75FF' },
  dealFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEF2F6', paddingTop: 8, marginTop: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800' }
});
