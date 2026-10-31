import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Building2,
  Calendar,
  Layers,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Phone,
  Mail,
  Trash2
} from 'lucide-react-native';
import { apiClient } from '../services/api';

function formatLeadDate(dateVal?: string | Date | null): string {
  if (!dateVal) return 'Recently';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'Recently';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  } catch {
    return 'Recently';
  }
}

export default function LeadDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const leadId = (params.id as string) || (params.leadId as string) || '';

  const [lead, setLead] = useState<any>({
    id: leadId,
    companyName: (params.companyName as string) || '',
    companyWebsite: (params.website as string) || (params.companyWebsite as string) || '',
    contactName: (params.contactName as string) || '',
    contactRole: (params.contactRole as string) || '',
    contactEmail: (params.contactEmail as string) || '',
    contactPhone: (params.contactPhone as string) || '',
    stage: (params.stage as string) || 'NEW',
    serviceInterest: (params.serviceInterest as string) || '',
    needSummary: (params.needSummary as string) || '',
    consentBasis: (params.consentBasis as string) || '',
    businessUnitName: 'Lumora Partner Network'
  });
  const [loading, setLoading] = useState(Boolean(leadId));
  const [deleting, setDeleting] = useState(false);

  const handleDeleteLead = () => {
    Alert.alert(
      'Withdraw Prospect Submission',
      `Are you sure you want to withdraw "${lead.companyName}"? This prospect will be permanently removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw & Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await apiClient.deleteLead(lead.id);
              Alert.alert('Prospect Withdrawn', 'The prospect submission has been removed from the pipeline.', [
                {
                  text: 'OK',
                  onPress: () => router.replace('/(tabs)/leads')
                }
              ]);
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Failed to withdraw prospect.');
            } finally {
              setDeleting(false);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (leadId) {
      setLoading(true);
      apiClient
        .getLead(leadId)
        .then((res) => {
          if (res.data) {
            setLead(res.data);
          }
        })
        .catch((err) => {
          console.log('Error loading lead detail:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [leadId]);

  const hasLead = Boolean(lead?.companyName || leadId);

  const getStageMeta = (stage: string) => {
    switch (stage) {
      case 'NEW':
        return {
          label: 'Pending Verification',
          sub: 'Awaiting Admin Approval',
          color: '#D97706',
          bg: '#FEF3C7',
          border: '#FDE68A',
          icon: Clock
        };
      case 'QUALIFIED':
        return {
          label: 'Approved & Qualified',
          sub: 'Verified by Operations',
          color: '#059669',
          bg: '#ECFDF5',
          border: '#A7F3D0',
          icon: CheckCircle2
        };
      case 'CONTACTED':
        return {
          label: 'Contacted',
          sub: 'In Discussion',
          color: '#2563EB',
          bg: '#EFF6FF',
          border: '#BFDBFE',
          icon: Building2
        };
      case 'MEETING_SCHEDULED':
      case 'MEETING_COMPLETED':
        return {
          label: 'Meeting Booked',
          sub: 'Discovery Scheduled',
          color: '#7C3AED',
          bg: '#FAF5FF',
          border: '#E9D5FF',
          icon: Calendar
        };
      case 'UNQUALIFIED':
        return {
          label: 'Not Qualified',
          sub: 'Declined by Admin',
          color: '#DC2626',
          bg: '#FEF2F2',
          border: '#FECACA',
          icon: AlertCircle
        };
      default:
        return {
          label: stage?.replace('_', ' ') || 'Registered',
          sub: '',
          color: '#475569',
          bg: '#F1F5F9',
          border: '#E2E8F0',
          icon: Building2
        };
    }
  };

  const stageMeta = getStageMeta(lead?.stage || 'NEW');
  const StageIcon = stageMeta.icon;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F75FF" />
          <Text style={styles.loadingText}>Fetching prospect details...</Text>
        </View>
      ) : !hasLead ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Building2 size={36} color="#64748B" />
          </View>
          <Text style={styles.emptyTitle}>No Prospect Selected</Text>
          <Text style={styles.emptySubtitle}>
            Please select a prospect from your Leads pipeline or register a new verified prospect.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/s14-add-lead')}
            style={styles.addLeadBtn}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addLeadBtnText}>Register New Prospect</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Company Header Card */}
          <View style={styles.headerCard}>
            <View style={styles.stageRow}>
              <Text style={styles.buText} numberOfLines={1} ellipsizeMode="tail">
                {lead.businessUnitName || 'Lumora Partner Network'}
              </Text>
              <View
                style={[
                  styles.stageBadge,
                  { backgroundColor: stageMeta.bg, borderColor: stageMeta.border }
                ]}
              >
                <StageIcon size={12} color={stageMeta.color} />
                <Text style={[styles.stageBadgeText, { color: stageMeta.color }]}>
                  {stageMeta.label}
                </Text>
              </View>
            </View>

            <Text style={styles.companyName}>{lead.companyName}</Text>
            {lead.companyWebsite ? <Text style={styles.websiteText}>{lead.companyWebsite}</Text> : null}
            {lead.createdAt ? (
              <View style={styles.submittedRow}>
                <Clock size={12} color="#64748B" />
                <Text style={styles.submittedText}>Submitted: {formatLeadDate(lead.createdAt)}</Text>
              </View>
            ) : null}

            {(lead.contactName || lead.contactPhone || lead.contactEmail) && (
              <View style={styles.contactBox}>
                <Text style={styles.contactName}>
                  {(() => {
                    const name = (lead.contactName || '').trim();
                    const role = (lead.contactRole || '').trim();
                    if (!role || name.toLowerCase().includes(role.toLowerCase())) {
                      return name;
                    }
                    return `${name} (${role})`;
                  })()}
                </Text>
                <View style={styles.contactDetailsRow}>
                  {lead.contactPhone ? (
                    <View style={styles.iconTextRow}>
                      <Phone size={12} color="#64748B" />
                      <Text style={styles.contactDetail}>{lead.contactPhone}</Text>
                    </View>
                  ) : null}
                  {lead.contactEmail ? (
                    <View style={styles.iconTextRow}>
                      <Mail size={12} color="#64748B" />
                      <Text style={styles.contactDetail}>{lead.contactEmail}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            )}
          </View>

          {/* Pending Approval Notice Banner */}
          {lead.stage === 'NEW' && (
            <View style={styles.pendingCard}>
              <Clock size={18} color="#D97706" />
              <View style={{ flex: 1 }}>
                <Text style={styles.pendingTitle}>Under Administrative Verification</Text>
                <Text style={styles.pendingSubtitle}>
                  This prospect has been submitted to Operations. Qualification & approval are strictly governed by Lumora Operations via the Admin Panel UI.
                </Text>
              </View>
            </View>
          )}

          {/* Approved Banner */}
          {lead.stage === 'QUALIFIED' && (
            <View style={styles.approvedCard}>
              <CheckCircle2 size={18} color="#059669" />
              <View style={{ flex: 1 }}>
                <Text style={styles.approvedTitle}>Verified & Approved Prospect</Text>
                <Text style={styles.approvedSubtitle}>
                  Operations has verified this prospect. You are cleared to book discovery meetings and initiate diagnostics.
                </Text>
              </View>
            </View>
          )}

          {/* Rejection / Unqualified Banner */}
          {lead.stage === 'UNQUALIFIED' && (
            <View style={styles.rejectedCard}>
              <AlertCircle size={18} color="#DC2626" />
              <View style={{ flex: 1 }}>
                <Text style={styles.rejectedTitle}>Prospect Marked Unqualified</Text>
                <Text style={styles.rejectedSubtitle}>
                  {lead.unqualifiedReason ? `Reason: ${lead.unqualifiedReason}` : 'This prospect does not match current ICP qualification criteria.'}
                </Text>
              </View>
            </View>
          )}

          {/* Need Summary */}
          {lead.needSummary ? (
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Client Need & Opportunity Scope</Text>
              <Text style={styles.infoBody}>{lead.needSummary}</Text>
              {lead.serviceInterest ? (
                <View style={styles.serviceInterestTag}>
                  <Text style={styles.serviceInterestText}>Target: {lead.serviceInterest}</Text>
                </View>
              ) : null}
              {lead.consentBasis ? (
                <Text style={styles.consentText}>Consent Basis: {lead.consentBasis}</Text>
              ) : null}
            </View>
          ) : null}

          {/* Action Shortcuts */}
          <View style={styles.actionGrid}>
            {lead.stage === 'QUALIFIED' ? (
              <>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/s18-book-meeting', params: { leadId: lead.id, companyName: lead.companyName } })}
                  style={styles.actionBtn}
                >
                  <Calendar size={18} color="#4F75FF" />
                  <Text style={styles.actionBtnText}>Book Meeting</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/s22-diagnostic', params: { leadId: lead.id } })}
                  style={styles.actionBtn}
                >
                  <Layers size={18} color="#10B981" />
                  <Text style={styles.actionBtnText}>Diagnostic Deal</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={handleDeleteLead}
                disabled={deleting}
                style={[styles.actionBtn, styles.deleteActionBtn]}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#DC2626" />
                ) : (
                  <>
                    <Trash2 size={18} color="#DC2626" />
                    <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>Withdraw / Delete Lead</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 60, gap: 14 },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 10 },
  loadingText: { fontSize: 13, color: '#64748B' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 20, gap: 12 },
  emptyIconBox: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EEF2F6' },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0B0F26' },
  emptySubtitle: { fontSize: 12, color: '#64748B', textAlign: 'center', lineHeight: 18, maxWidth: 300 },
  addLeadBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#4F75FF', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 25, marginTop: 8 },
  addLeadBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  stageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  buText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.3
  },
  stageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    flexShrink: 0
  },
  stageBadgeText: { fontSize: 11, fontWeight: '700' },
  companyName: { fontSize: 20, fontWeight: '800', color: '#0B0F26', marginTop: 2 },
  websiteText: { fontSize: 13, color: '#4F75FF', fontWeight: '600' },
  contactBox: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, marginTop: 6, gap: 4, borderWidth: 1, borderColor: '#EEF2F6' },
  contactName: { fontSize: 13, fontWeight: '700', color: '#0B0F26' },
  contactDetailsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 2 },
  iconTextRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  contactDetail: { fontSize: 11, color: '#64748B' },
  pendingCard: { flexDirection: 'row', gap: 10, backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#FDE68A', alignItems: 'center' },
  pendingTitle: { fontSize: 13, fontWeight: '700', color: '#B45309' },
  pendingSubtitle: { fontSize: 11, color: '#92400E', marginTop: 2, lineHeight: 16 },
  approvedCard: { flexDirection: 'row', gap: 10, backgroundColor: '#ECFDF5', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#A7F3D0', alignItems: 'center' },
  approvedTitle: { fontSize: 13, fontWeight: '700', color: '#047857' },
  approvedSubtitle: { fontSize: 11, color: '#065F46', marginTop: 2, lineHeight: 16 },
  rejectedCard: { flexDirection: 'row', gap: 10, backgroundColor: '#FEF2F2', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#FECACA', alignItems: 'center' },
  rejectedTitle: { fontSize: 13, fontWeight: '700', color: '#B91C1C' },
  rejectedSubtitle: { fontSize: 11, color: '#7F1D1D', marginTop: 2, lineHeight: 16 },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#EEF2F6', gap: 8 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#0B0F26' },
  infoBody: { fontSize: 13, color: '#334155', lineHeight: 19 },
  serviceInterestTag: { alignSelf: 'flex-start', backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginTop: 4 },
  serviceInterestText: { fontSize: 11, fontWeight: '700', color: '#4F75FF' },
  consentText: { fontSize: 11, color: '#94A3B8', marginTop: 4, fontStyle: 'italic' },
  actionGrid: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: '#EEF2F6', elevation: 1 },
  actionBtnText: { fontSize: 12, fontWeight: '700', color: '#0B0F26' },
  deleteActionBtn: { borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
  submittedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  submittedText: { fontSize: 11, color: '#64748B', fontWeight: '500' }
});
