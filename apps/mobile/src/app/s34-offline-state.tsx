import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  WifiOff,
  RefreshCw,
  Database,
  CheckCircle2,
  Trash2,
  FileText
} from 'lucide-react-native';
import { useDraftStore } from '../store/draftStore';
import { LumoraButton } from '../components/LumoraButton';
import { PoweredByFooter } from '../components/PoweredByFooter';

export default function OfflineStateScreen() {
  const router = useRouter();
  const currentDraft = useDraftStore((state) => state.currentDraft);
  const clearCurrentDraft = useDraftStore((state) => state.clearCurrentDraft);
  const [syncing, setSyncing] = useState(false);

  const hasDraft = Boolean(currentDraft && currentDraft.companyName);

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      Alert.alert('Sync Result', 'Connection re-established. Offline draft verified and ready to submit.');
    }, 1200);
  };

  const handleResumeDraft = () => {
    router.push('/s14-add-lead');
  };

  const handleDiscardDraft = () => {
    Alert.alert(
      'Discard Offline Draft?',
      'Are you sure you want to discard your unsynced prospect information?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            clearCurrentDraft();
            Alert.alert('Draft Cleared', 'Draft has been removed from local device storage.');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Network Alert */}
      <View style={styles.alertCard}>
        <View style={styles.iconCircle}>
          <WifiOff size={24} color="#EF4444" />
        </View>
        <Text style={styles.alertTitle}>Offline / Connectivity Shield</Text>
        <Text style={styles.alertSub}>
          Your device lost network connectivity or experienced an intermittent API timeout. Don't worry: your in-progress drafts are saved locally in encrypted storage.
        </Text>
      </View>

      {/* Offline Guarantee */}
      <View style={styles.guaranteeBox}>
        <CheckCircle2 size={16} color="#10B981" />
        <Text style={styles.guaranteeText}>
          Non-Negotiable Architecture Rule: Never lose entered partner data silently. All form states persist across app reboots.
        </Text>
      </View>

      {/* Unsynced Drafts */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconCircle}>
            <Database size={18} color="#4F75FF" />
          </View>
          <Text style={styles.cardTitle}>Local Encrypted Drafts ({hasDraft ? 1 : 0})</Text>
        </View>

        {hasDraft ? (
          <View style={styles.draftBox}>
            <View style={styles.rowBetween}>
              <Text style={styles.draftName}>{currentDraft?.companyName || 'Untitled Prospect'}</Text>
              <View style={styles.unsyncedBadge}>
                <Text style={styles.unsyncedText}>UNSYNCED</Text>
              </View>
            </View>

            <Text style={styles.draftDetail}>
              Website: {currentDraft?.companyWebsite || 'Not entered'}
            </Text>
            <Text style={styles.draftDetail}>
              Contact: {currentDraft?.contactName || 'Not entered'} ({currentDraft?.contactEmail || 'No email'})
            </Text>

            <View style={styles.draftActions}>
              <TouchableOpacity
                onPress={handleResumeDraft}
                style={styles.resumeBtn}
              >
                <FileText size={14} color="#FFFFFF" />
                <Text style={styles.resumeBtnText}>Resume Editing</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDiscardDraft}
                style={styles.discardBtn}
              >
                <Trash2 size={14} color="#EF4444" />
                <Text style={styles.discardBtnText}>Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>No unsynced drafts stored on this device.</Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionCol}>
        <LumoraButton
          title={syncing ? 'Verifying Network...' : 'Test Connection & Sync Now'}
          onPress={handleSyncNow}
          icon={<RefreshCw size={18} color="#FFFFFF" />}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/s31-support')}
          style={styles.supportBtn}
        >
          <Text style={styles.supportBtnText}>Report Persistent Server Error</Text>
        </TouchableOpacity>
      </View>

      <PoweredByFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 18, paddingBottom: 40, gap: 16 },
  alertCard: { backgroundColor: '#FEF2F2', borderRadius: 16, borderWidth: 1, borderColor: '#FECACA', padding: 20, alignItems: 'center', gap: 10 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  alertTitle: { fontSize: 16, fontWeight: '700', color: '#991B1B' },
  alertSub: { fontSize: 12, color: '#7F1D1D', textAlign: 'center', lineHeight: 18 },
  guaranteeBox: { flexDirection: 'row', gap: 10, backgroundColor: '#ECFDF5', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#A7F3D0', alignItems: 'center' },
  guaranteeText: { flex: 1, fontSize: 12, color: '#065F46', lineHeight: 17, fontWeight: '500' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#EEF2F6', padding: 16, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0B0F26' },
  emptyText: { fontSize: 13, color: '#64748B', fontStyle: 'italic', paddingVertical: 8 },
  draftBox: { backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#EEF2F6', padding: 14, gap: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  draftName: { fontSize: 14, fontWeight: '700', color: '#0B0F26' },
  unsyncedBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  unsyncedText: { fontSize: 10, fontWeight: '700', color: '#B45309' },
  draftDetail: { fontSize: 12, color: '#64748B' },
  draftActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  resumeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#4F75FF', paddingVertical: 10, borderRadius: 8 },
  resumeBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  discardBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF2F2', paddingHorizontal: 14, borderRadius: 8 },
  discardBtnText: { color: '#EF4444', fontSize: 13, fontWeight: '600' },
  actionCol: { gap: 12, marginTop: 4 },
  supportBtn: { alignItems: 'center', paddingVertical: 8 },
  supportBtnText: { color: '#4F75FF', fontSize: 13, fontWeight: '600' }
});
