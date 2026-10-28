import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, Lock, ArrowLeft, Building2 } from 'lucide-react-native';
import { PoweredByFooter } from '../components/PoweredByFooter';

export default function QualificationFormScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Lock size={32} color="#4F75FF" />
        </View>

        <Text style={styles.title}>Admin-Only Governance</Text>
        <Text style={styles.badge}>Restricted Operational Workflow</Text>

        <Text style={styles.description}>
          Lead qualification, ICP validation, and stage progression are strictly governed by Lumora Operations via the Admin Panel UI.
        </Text>

        <View style={styles.infoBox}>
          <ShieldCheck size={20} color="#059669" />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoBoxTitle}>Verification in Progress</Text>
            <Text style={styles.infoBoxBody}>
              Once Lumora Operations verifies your prospect submission, the account will be approved and discovery meeting scheduling will unlock automatically in your pipeline.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/leads')}
          style={styles.returnBtn}
        >
          <ArrowLeft size={18} color="#FFFFFF" />
          <Text style={styles.returnBtnText}>Return to Leads Pipeline</Text>
        </TouchableOpacity>
      </View>

      <PoweredByFooter style={{ marginTop: 30, marginBottom: 10 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20, paddingTop: 40, alignItems: 'center' },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B0F26',
    textAlign: 'center'
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F75FF',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    marginBottom: 24
  },
  infoBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857'
  },
  infoBoxBody: {
    fontSize: 11,
    color: '#065F46',
    marginTop: 3,
    lineHeight: 16
  },
  returnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F75FF',
    height: 48,
    borderRadius: 24,
    width: '100%'
  },
  returnBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold'
  }
});
