import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ShieldAlert,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Lock
} from 'lucide-react-native';

interface LedgerItem {
  id: string;
  dealName: string;
  leadCompany: string;
  amountMinorUnits: string; // paise
  amountDisplay: string;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  triggerEvent: string;
  policyVersion: string;
  approvedBy?: string;
  paymentRef?: string;
  createdAt: string;
}

const mockLedger: LedgerItem[] = [];

export default function EarningsLedgerScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'APPROVED' | 'PENDING'>('ALL');
  const [search, setSearch] = useState('');
  const [disputeModalVisible, setDisputeModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LedgerItem | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  const filteredItems = mockLedger.filter((item) => {
    const matchesFilter = filter === 'ALL' || item.status === filter;
    const matchesSearch =
      item.dealName.toLowerCase().includes(search.toLowerCase()) ||
      item.leadCompany.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenDispute = (entry: LedgerItem) => {
    setSelectedEntry(entry);
    setDisputeReason('');
    setDisputeModalVisible(true);
  };

  const handleSubmitDispute = () => {
    if (!disputeReason.trim()) {
      Alert.alert('Required Field', 'Please provide a reason for the calculation dispute.');
      return;
    }
    setDisputeModalVisible(false);
    Alert.alert(
      'Dispute Lodged',
      `Dispute for ledger item ${selectedEntry?.id} has been submitted to Finance Audit. Ref ticket created.`
    );
  };

  const getStatusColor = (status: LedgerItem['status']) => {
    switch (status) {
      case 'PAID':
        return '#10B981';
      case 'APPROVED':
        return '#8CB4F5';
      case 'PENDING':
        return '#F59E0B';
      case 'REJECTED':
        return '#EF4444';
    }
  };

  return (
    <View style={styles.container}>
      {/* Search and Filters */}
      <View style={styles.headerFilter}>
        <View style={styles.searchBar}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search deals, clients..."
            placeholderTextColor="#64748B"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {(['ALL', 'PENDING', 'APPROVED', 'PAID'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab)}
              style={[styles.filterChip, filter === tab && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Ledger Feed */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.securityBanner}>
          <Lock size={14} color="#94A3B8" />
          <Text style={styles.securityText}>
            Append-Only Financial Ledger: Records are immutable. Reversals or corrections are recorded as adjustment entries.
          </Text>
        </View>

        {filteredItems.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 50, paddingHorizontal: 20, gap: 12 }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#132438', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={36} color="#64748B" />
            </View>
            <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' }}>No Commission Records</Text>
            <Text style={{ fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 18, maxWidth: 300 }}>
              You have no ledger entries yet. When you close a diagnostic or service deal and client payment is verified, your append-only incentive entries will appear here.
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => {
          const color = getStatusColor(item.status);
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <View style={[styles.statusBadge, { backgroundColor: `${color}18` }]}>
                  <Text style={[styles.statusText, { color }]}>{item.status}</Text>
                </View>
                <Text style={styles.date}>{item.createdAt}</Text>
              </View>

              <Text style={styles.dealTitle}>{item.dealName}</Text>
              <Text style={styles.companyName}>Client: {item.leadCompany}</Text>

              <View style={styles.divider} />

              <View style={styles.detailGrid}>
                <View>
                  <Text style={styles.gridLabel}>Incentive Amount</Text>
                  <Text style={[styles.gridValue, { color: '#FFFFFF', fontSize: 18 }]}>{item.amountDisplay}</Text>
                </View>
                <View>
                  <Text style={styles.gridLabel}>Policy Version</Text>
                  <Text style={styles.gridValue}>{item.policyVersion}</Text>
                </View>
              </View>

              {item.paymentRef && (
                <View style={styles.refBox}>
                  <Text style={styles.refLabel}>Bank Reference:</Text>
                  <Text style={styles.refValue}>{item.paymentRef}</Text>
                </View>
              )}

              {item.approvedBy && (
                <Text style={styles.approverText}>Approved by: {item.approvedBy}</Text>
              )}

              <View style={styles.cardActions}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push({ pathname: '/s16-lead-detail', params: { leadId: 'lead-01' } })}
                  style={styles.secondaryBtn}
                >
                  <FileText size={14} color="#8CB4F5" />
                  <Text style={styles.secondaryBtnText}>View Deal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleOpenDispute(item)}
                  style={styles.disputeBtn}
                >
                  <ShieldAlert size={14} color="#EF4444" />
                  <Text style={styles.disputeBtnText}>Raise Dispute</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
      </ScrollView>

      {/* Dispute Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={disputeModalVisible}
        onRequestClose={() => setDisputeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Raise Calculation Dispute</Text>
            <Text style={styles.modalSub}>
              Ledger ID: {selectedEntry?.id} ({selectedEntry?.dealName})
            </Text>

            <Text style={styles.label}>Reason for Dispute</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Explain discrepancy with deal contract value or policy terms..."
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={4}
              value={disputeReason}
              onChangeText={setDisputeReason}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setDisputeModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmitDispute}
                style={styles.submitDisputeBtn}
              >
                <Text style={styles.submitDisputeText}>Submit to Finance</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  headerFilter: { backgroundColor: '#0B1026', padding: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: '#1E294B' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#070B19', borderRadius: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#1E294B' },
  searchInput: { flex: 1, color: '#FFFFFF', paddingVertical: 8, fontSize: 13, marginLeft: 8 },
  filterScroll: { gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#132438' },
  filterChipActive: { backgroundColor: '#5B8EE2' },
  filterText: { color: '#94A3B8', fontSize: 11, fontWeight: '700' },
  filterTextActive: { color: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 60, gap: 12 },
  securityBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#132438', padding: 10, borderRadius: 8 },
  securityText: { flex: 1, fontSize: 11, color: '#94A3B8' },
  card: { backgroundColor: '#0B1026', borderRadius: 12, borderWidth: 1, borderColor: '#1E294B', padding: 14, gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: '800' },
  date: { fontSize: 11, color: '#64748B' },
  dealTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginTop: 2 },
  companyName: { fontSize: 12, color: '#94A3B8' },
  divider: { height: 1, backgroundColor: '#1E293B', marginVertical: 4 },
  detailGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  gridLabel: { fontSize: 11, color: '#64748B' },
  gridValue: { fontSize: 13, fontWeight: '600', color: '#CBD5E1', marginTop: 2 },
  refBox: { backgroundColor: '#132438', padding: 8, borderRadius: 6, flexDirection: 'row', gap: 6 },
  refLabel: { fontSize: 11, color: '#94A3B8' },
  refValue: { fontSize: 11, fontWeight: 'bold', color: '#8CB4F5' },
  approverText: { fontSize: 11, color: '#64748B', fontStyle: 'italic' },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#8CB4F515', borderRadius: 6 },
  secondaryBtnText: { color: '#8CB4F5', fontSize: 12, fontWeight: '600' },
  disputeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#EF444415', borderRadius: 6 },
  disputeBtnText: { color: '#EF4444', fontSize: 12, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: '#00000099', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 20, gap: 12 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  modalSub: { fontSize: 12, color: '#94A3B8' },
  label: { fontSize: 12, fontWeight: '600', color: '#CBD5E1' },
  textArea: { backgroundColor: '#070B19', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, padding: 10, color: '#FFFFFF', textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  cancelBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  cancelText: { color: '#94A3B8', fontWeight: '600' },
  submitDisputeBtn: { backgroundColor: '#EF4444', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  submitDisputeText: { color: '#FFFFFF', fontWeight: 'bold' }
});
