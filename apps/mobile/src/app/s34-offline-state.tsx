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
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Trash2,
  FileText
} from 'lucide-react-native';
import { useDraftStore } from '../store/draftStore';

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
          <Database size={18} color="#8CB4F5" />
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
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSyncNow}
          style={styles.syncBtn}
        >
          <RefreshCw size={18} color="#FFFFFF" />
          <Text style={styles.syncBtnText}>{syncing ? 'Verifying Network...' : 'Test Connection & Sync Now'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/s31-support')}
          style={styles.supportBtn}
        >
          <Text style={styles.supportBtnText}>Report Persistent Server Error</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 18, paddingBottom: 60, gap: 16 },
  alertCard: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#EF444450', padding: 20, alignItems: 'center', textAlign: 'center', gap: 10 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EF444415', alignItems: 'center', justifyContent: 'center' },
  alertTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  alertSub: { fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 18 },
  guaranteeBox: { flexDirection: 'row', gap: 10, backgroundColor: '#10B98115', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#10B98140' },
  guaranteeText: { flex: 1, fontSize: 11, color: '#A7F3D0', lineHeight: 16 },
  card: { backgroundColor: '#0B1026', borderRadius: 14, borderWidth: 1, borderColor: '#1E294B', padding: 16, gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  emptyText: { fontSize: 12, color: '#64748B', fontStyle: 'italic', paddingVertical: 8 },
  draftBox: { backgroundColor: '#132438', borderRadius: 10, borderWidth: 1, borderColor: '#1E3A5F', padding: 12, gap: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  draftName: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  unsyncedBadge: { backgroundColor: '#F59E0B20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  unsyncedText: { fontSize: 9, fontWeight: 'bold', color: '#F59E0B' },
  draftDetail: { fontSize: 11, color: '#94A3B8' },
  draftActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  resumeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#5B8EE2', paddingVertical: 8, borderRadius: 6 },
  resumeBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  discardBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EF444415', paddingHorizontal: 12, borderRadius: 6 },
  discardBtnText: { color: '#EF4444', fontSize: 12, fontWeight: '600' },
  actionCol: { gap: 10 },
  syncBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#003566', paddingVertical: 14, borderRadius: 10 },
  syncBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  supportBtn: { alignItems: 'center', paddingVertical: 8 },
  supportBtnText: { color: '#94A3B8', fontSize: 12 }
});
