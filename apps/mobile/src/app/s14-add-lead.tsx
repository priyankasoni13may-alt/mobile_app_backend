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
import { LumoraButton } from '../components/LumoraButton';
import { PoweredByFooter } from '../components/PoweredByFooter';

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

      Alert.alert(
        'Prospect Submitted!',
        'Your prospect has been submitted and is currently pending verification & approval by Operations.',
        [
          {
            text: 'View Prospects',
            onPress: () => {
              if (andBookMeeting && res.data?.id) {
                router.replace({
                  pathname: '/s18-book-meeting',
                  params: { leadId: res.data.id, companyName }
                });
              } else {
                router.replace('/(tabs)/leads');
              }
            }
          }
        ]
      );
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
        <CheckCircle2 size={13} color="#10B981" />
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
            <Building2 size={16} color="#64748B" />
            <TextInput
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Enter company or prospect name"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              cursorColor="#4F75FF"
              selectionColor="#4F75FF"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company Website / Domain</Text>
          <View style={styles.inputBox}>
            <Globe size={16} color="#64748B" />
            <TextInput
              value={companyWebsite}
              onChangeText={setCompanyWebsite}
              placeholder="Enter company website or domain"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              style={styles.input}
              cursorColor="#4F75FF"
              selectionColor="#4F75FF"
            />
          </View>
        </View>

        {/* Duplicate Check Trigger */}
        <TouchableOpacity
          onPress={handleDuplicateCheck}
          style={styles.dupCheckBtn}
        >
          <ShieldCheck size={16} color="#4F75FF" />
          <Text style={styles.dupCheckText}>Run Duplicate & Conflict Check</Text>
        </TouchableOpacity>

        {/* Contact Info */}
        <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Decision Maker / Key Contact</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Full Name *</Text>
          <View style={styles.inputBox}>
            <User size={16} color="#64748B" />
            <TextInput
              value={contactName}
              onChangeText={setContactName}
              placeholder="Enter contact full name"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              cursorColor="#4F75FF"
              selectionColor="#4F75FF"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Designation / Role</Text>
          <View style={styles.inputBox}>
            <Building2 size={16} color="#64748B" />
            <TextInput
              value={contactRole}
              onChangeText={setContactRole}
              placeholder="Enter job role or designation"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              cursorColor="#4F75FF"
              selectionColor="#4F75FF"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Email Address</Text>
          <View style={styles.inputBox}>
            <Mail size={16} color="#64748B" />
            <TextInput
              value={contactEmail}
              onChangeText={setContactEmail}
              placeholder="Enter official email address"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              cursorColor="#4F75FF"
              selectionColor="#4F75FF"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Mobile / Phone</Text>
          <View style={styles.inputBox}>
            <Phone size={16} color="#64748B" />
            <TextInput
              value={contactPhone}
              onChangeText={setContactPhone}
              placeholder="Enter phone number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              style={styles.input}
              cursorColor="#4F75FF"
              selectionColor="#4F75FF"
            />
          </View>
        </View>

        {/* Need Summary & Service */}
        <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Opportunity Scope & Consent</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client Need Summary *</Text>
          <TextInput
            value={needSummary}
            onChangeText={setNeedSummary}
            multiline
            numberOfLines={3}
            placeholder="Describe customer pain point and desired business outcome..."
            placeholderTextColor="#94A3B8"
            style={styles.textArea}
            cursorColor="#4F75FF"
            selectionColor="#4F75FF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Legal Consent Basis *</Text>
          <View style={styles.inputBox}>
            <ShieldCheck size={16} color="#64748B" />
            <TextInput
              value={consentBasis}
              onChangeText={setConsentBasis}
              placeholder="Enter legal consent basis details"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              cursorColor="#4F75FF"
              selectionColor="#4F75FF"
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
              <ActivityIndicator size="small" color="#0B0F26" />
            ) : (
              <Text style={styles.saveBtnText}>Save Lead</Text>
            )}
          </TouchableOpacity>

          <View style={{ flex: 1.3 }}>
            <LumoraButton
              title="Save & Book"
              onPress={() => handleCreateLead(true)}
              loading={loading}
              icon={<Calendar size={16} color="#FFFFFF" />}
              size="md"
            />
          </View>
        </View>
      </View>

      <PoweredByFooter style={{ marginTop: 24, marginBottom: 10 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 60 },
  draftIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0FDF4', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#BBF7D0', marginBottom: 16 },
  draftText: { fontSize: 11, color: '#166534', fontWeight: 'bold' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#4F75FF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  form: { gap: 14 },
  inputGroup: { gap: 4 },
  label: { fontSize: 11, fontWeight: '600', color: '#334155' },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 48 },
  input: { flex: 1, color: '#0B0F26', fontSize: 13, marginLeft: 8, height: 48, paddingVertical: 8 },
  textArea: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, color: '#0B0F26', fontSize: 13, minHeight: 74, textAlignVertical: 'top' },
  dupCheckBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#EFF6FF', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#DBEAFE', marginVertical: 4 },
  dupCheckText: { fontSize: 12, fontWeight: 'bold', color: '#4F75FF' },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  saveBtn: { flex: 1, backgroundColor: '#F1F5F9', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  saveBtnText: { fontSize: 13, fontWeight: 'bold', color: '#0B0F26' }
});
