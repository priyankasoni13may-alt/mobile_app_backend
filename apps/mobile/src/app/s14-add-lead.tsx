import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Building2,
  Globe,
  User,
  Mail,
  Phone,
  FileText,
  ShieldCheck,
  Save,
  CheckCircle2,
  Calendar
} from 'lucide-react-native';
import { apiClient } from '../services/api';
import { useDraftStore } from '../store/draftStore';

export default function AddLeadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { currentDraft, setField, saveDraft, clearCurrentDraft } = useDraftStore();

  const [companyName, setCompanyName] = useState(currentDraft?.companyName || '');
  const [companyWebsite, setCompanyWebsite] = useState(currentDraft?.companyWebsite || '');
  const [contactName, setContactName] = useState(currentDraft?.contactName || '');
  const [contactRole, setContactRole] = useState(currentDraft?.contactRole || '');
  const [contactEmail, setContactEmail] = useState(currentDraft?.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(currentDraft?.contactPhone || '');
  const [businessUnitId, setBusinessUnitId] = useState(currentDraft?.businessUnitId || 'bu-lumora-growth');
  const [serviceInterest, setServiceInterest] = useState(
    (params.serviceInterest as string) || currentDraft?.serviceInterest || ''
  );
  const [needSummary, setNeedSummary] = useState(
    currentDraft?.needSummary || ''
  );
  const [consentBasis, setConsentBasis] = useState(
    currentDraft?.consentBasis || ''
  );

  const [loading, setLoading] = useState(false);
  const [autoSavedTime, setAutoSavedTime] = useState<string | null>(null);

  // Auto-save draft changes
  useEffect(() => {
    if (companyName) {
      setField('companyName', companyName);
      setField('companyWebsite', companyWebsite);
      setField('contactName', contactName);
      setField('contactRole', contactRole);
      setField('contactEmail', contactEmail);
      setField('contactPhone', contactPhone);
      setField('businessUnitId', businessUnitId);
      setField('serviceInterest', serviceInterest);
      setField('needSummary', needSummary);
      setField('consentBasis', consentBasis);
      saveDraft();
      setAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [companyName, companyWebsite, contactName, contactEmail, contactPhone, needSummary]);

  const handleDuplicateCheck = async () => {
    if (!companyName && !companyWebsite && !contactEmail) {
      Alert.alert('Duplicate Check', 'Please enter at least a company name or website domain to check.');
      return;
    }

    router.push({
      pathname: '/s15-duplicate-check',
      params: {
        companyName,
        companyWebsite,
        contactEmail,
        contactPhone
      }
    });
  };

  const handleCreateLead = async (andBookMeeting = false) => {
    if (!companyName || !contactName || !needSummary) {
      Alert.alert('Required Fields', 'Please complete Company Name, Contact Name, and Need Summary.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.createLead({
        companyName,
        companyWebsite,
        contactName,
        contactRole,
        contactEmail,
        contactPhone,
        geography: 'India',
        industry: 'General Enterprise',
        businessUnitId,
        serviceInterest,
        source: 'DIRECT_OUTREACH',
        needSummary,
        consentBasis
      });

      clearCurrentDraft();

      if (andBookMeeting && res.data?.id) {
        router.replace({
          pathname: '/s18-book-meeting',
          params: { leadId: res.data.id, companyName }
        });
      } else {
        router.replace('/(tabs)/leads');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create lead. Stored in local drafts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Draft Auto-save Indicator */}
      <View style={styles.draftIndicator}>
        <CheckCircle2 size={12} color="#10B981" />
        <Text style={styles.draftText}>
          {autoSavedTime ? `Draft auto-saved offline at ${autoSavedTime}` : 'Offline auto-save enabled'}
        </Text>
      </View>

      <View style={styles.form}>
        {/* Company Info */}
        <Text style={styles.sectionTitle}>Company Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company / Prospect Name *</Text>
          <View style={styles.inputBox}>
            <Building2 size={16} color="#94A3B8" />
            <TextInput
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Enter company or prospect name"
              placeholderTextColor="#64748B"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company Website / Domain</Text>
          <View style={styles.inputBox}>
            <Globe size={16} color="#94A3B8" />
            <TextInput
              value={companyWebsite}
              onChangeText={setCompanyWebsite}
              placeholder="e.g. company.com"
              placeholderTextColor="#64748B"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </View>

        {/* Duplicate Check Trigger */}
        <TouchableOpacity
          onPress={handleDuplicateCheck}
          style={styles.dupCheckBtn}
        >
          <ShieldCheck size={16} color="#38BDF8" />
          <Text style={styles.dupCheckText}>Run Duplicate & Conflict Check</Text>
        </TouchableOpacity>

        {/* Contact Info */}
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Decision Maker / Key Contact</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Full Name *</Text>
          <View style={styles.inputBox}>
            <User size={16} color="#94A3B8" />
            <TextInput
              value={contactName}
              onChangeText={setContactName}
              placeholder="Enter contact full name"
              placeholderTextColor="#64748B"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Designation / Role</Text>
          <View style={styles.inputBox}>
            <Building2 size={16} color="#94A3B8" />
            <TextInput
              value={contactRole}
              onChangeText={setContactRole}
              placeholder="e.g. Director, VP, Founder"
              placeholderTextColor="#64748B"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Email Address</Text>
          <View style={styles.inputBox}>
            <Mail size={16} color="#94A3B8" />
            <TextInput
              value={contactEmail}
              onChangeText={setContactEmail}
              placeholder="contact@company.com"
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Mobile / Phone</Text>
          <View style={styles.inputBox}>
            <Phone size={16} color="#94A3B8" />
            <TextInput
              value={contactPhone}
              onChangeText={setContactPhone}
              placeholder="+91 00000 00000"
              placeholderTextColor="#64748B"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>
        </View>

        {/* Need Summary & Service */}
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Opportunity Scope & Consent</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client Need Summary *</Text>
          <TextInput
            value={needSummary}
            onChangeText={setNeedSummary}
            multiline
            numberOfLines={3}
            placeholder="Describe customer pain point and desired outcome..."
            placeholderTextColor="#64748B"
            style={styles.textArea}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Legal Consent Basis *</Text>
          <View style={styles.inputBox}>
            <ShieldCheck size={16} color="#94A3B8" />
            <TextInput
              value={consentBasis}
              onChangeText={setConsentBasis}
              placeholder="e.g. Direct phone conversation with client"
              placeholderTextColor="#64748B"
              style={styles.input}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleCreateLead(false)}
            disabled={loading}
            style={styles.saveBtn}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveBtnText}>Save Lead</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleCreateLead(true)}
            disabled={loading}
            style={styles.saveAndBookBtn}
          >
            <Calendar size={16} color="#FFFFFF" />
            <Text style={styles.saveAndBookText}>Save & Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B19' },
  content: { padding: 16, paddingBottom: 60 },
  draftIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0B1026', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#1E294B', marginBottom: 16 },
  draftText: { fontSize: 10, color: '#10B981', fontWeight: 'bold' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#5B8EE2', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  form: { gap: 12 },
  inputGroup: { gap: 4 },
  label: { fontSize: 11, fontWeight: '600', color: '#CBD5E1' },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0B1026', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, paddingHorizontal: 12, height: 48 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 13, marginLeft: 8, height: 48, paddingVertical: 8 },
  textArea: { backgroundColor: '#0B1026', borderWidth: 1, borderColor: '#1E294B', borderRadius: 8, padding: 10, color: '#FFFFFF', fontSize: 13, height: 70, textAlignVertical: 'top' },
  dupCheckBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#101735', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#1E294B', marginVertical: 4 },
  dupCheckText: { fontSize: 12, fontWeight: 'bold', color: '#38BDF8' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  saveBtn: { flex: 1, backgroundColor: '#101735', height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E294B' },
  saveBtnText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
  saveAndBookBtn: { flex: 1.3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#5B8EE2', height: 48, borderRadius: 10 },
  saveAndBookText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }
});
