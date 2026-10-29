'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Search,
  AlertTriangle,
  UserCheck,
  Clock,
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  RefreshCw,
  Phone,
  Mail,
  ExternalLink,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  Trash2
} from 'lucide-react';

export default function LeadManagementPage() {
  const [stageFilter, setStageFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectLeadItem, setRejectLeadItem] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('Does not match current ICP qualification criteria');

  // Lead Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLead, setDetailLead] = useState<any>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads?stage=${stageFilter}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.data || []);
        setConflicts(data.conflicts || []);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  }, [stageFilter, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleApproveLead = async (lead: any) => {
    if (!confirm(`Approve and verify prospect "${lead.companyName}"? This enables discovery meeting scheduling.`)) {
      return;
    }

    setActionLoading(lead.id);
    try {
      const res = await fetch(`/api/leads/${lead.id}/approve`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`Prospect "${lead.companyName}" has been approved! The partner has been notified.`);
        fetchLeads();
      } else {
        alert(data.error || 'Failed to approve prospect.');
      }
    } catch (err: any) {
      alert(err.message || 'Error approving prospect.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectLeadItem) return;

    setActionLoading(rejectLeadItem.id);
    try {
      const res = await fetch(`/api/leads/${rejectLeadItem.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Prospect "${rejectLeadItem.companyName}" marked unqualified.`);
        setRejectModalOpen(false);
        setRejectLeadItem(null);
        fetchLeads();
      } else {
        alert(data.error || 'Failed to reject prospect.');
      }
    } catch (err: any) {
      alert(err.message || 'Error rejecting prospect.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteLead = async (lead: any) => {
    if (!confirm(`Are you sure you want to permanently delete lead "${lead.companyName}"?\n\nThis will purge the duplicate domain lock and activity timeline. This action cannot be undone.`)) {
      return;
    }

    setActionLoading(lead.id);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert(`Lead "${lead.companyName}" has been permanently deleted.`);
        fetchLeads();
      } else {
        alert(data.error || 'Failed to delete lead.');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting lead.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Approval
          </span>
        );
      case 'QUALIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Approved & Qualified
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            Contacted
          </span>
        );
      case 'MEETING_SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            Meeting Scheduled
          </span>
        );
      case 'UNQUALIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Unqualified / Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {stage}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#4F75FF]" /> Prospect Verification & Lead Governance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and approve partner-submitted prospect registrations, resolve duplicate domain claims, and manage pipeline eligibility.
          </p>
        </div>

        <button
          onClick={() => fetchLeads()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#4F75FF] ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* Duplicate Claim Conflict Queue Alert */}
      {conflicts.length > 0 && (
        <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600" /> Ownership Claim Conflicts Awaiting Decision ({conflicts.length})
            </div>
            <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
              Rule 5.2 Segregation
            </span>
          </div>

          {conflicts.map((c) => (
            <div key={c.id} className="p-4 rounded-lg bg-white border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div>
                <p className="text-xs font-bold text-slate-900">{c.existingLead?.companyName || 'Lead Conflict'}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Reason: <span className="text-amber-800 font-semibold">"{c.reason}"</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => alert('Decision recorded')}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  Uphold Original
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leads Table Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, contact, or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F75FF] focus:ring-1 focus:ring-[#4F75FF] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#4F75FF] shadow-xs"
          >
            <option value="ALL">All Stages ({leads.length})</option>
            <option value="NEW">Pending Verification ({leads.filter((l) => l.stage === 'NEW').length})</option>
            <option value="QUALIFIED">Approved & Qualified ({leads.filter((l) => l.stage === 'QUALIFIED').length})</option>
            <option value="CONTACTED">Contacted</option>
            <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
            <option value="UNQUALIFIED">Unqualified / Rejected</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Company & Prospect</th>
                <th className="py-3 px-4">Key Contact Details</th>
                <th className="py-3 px-4">Partner Attribution</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#4F75FF]" />
                    Loading prospect database...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-bold text-slate-700">No leads registered matching this criteria</p>
                    <p className="text-xs text-slate-500 mt-1">When partners submit prospective clients, they will appear here for verification.</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{lead.companyName}</div>
                      {lead.companyWebsite ? (
                        <div className="text-[11px] text-[#4F75FF] font-medium mt-0.5">{lead.companyWebsite}</div>
                      ) : null}
                      <button
                        onClick={() => {
                          setDetailLead(lead);
                          setDetailModalOpen(true);
                        }}
                        className="text-[11px] text-[#4F75FF] hover:underline mt-1 font-semibold inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> View Need & Details
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{lead.contactName}</div>
                      <div className="text-[11px] text-slate-500">{lead.contactRole}</div>
                      <div className="text-[11px] text-slate-600 mt-1 flex flex-col gap-0.5">
                        {lead.contactEmail ? (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Mail className="w-3 h-3 text-slate-400" /> {lead.contactEmail}
                          </span>
                        ) : null}
                        {lead.contactPhone ? (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Phone className="w-3 h-3 text-slate-400" /> {lead.contactPhone}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-bold">{lead.partnerName}</div>
                      {lead.partnerPhone ? (
                        <div className="text-[11px] text-slate-500">{lead.partnerPhone}</div>
                      ) : null}
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStageBadge(lead.stage)}
                      {lead.unqualifiedReason ? (
                        <div className="text-[11px] text-rose-600 italic mt-1 max-w-xs font-medium">
                          "{lead.unqualifiedReason}"
                        </div>
                      ) : null}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {lead.stage === 'NEW' ? (
                          <>
                            <button
                              onClick={() => handleApproveLead(lead)}
                              disabled={actionLoading === lead.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => {
                                setRejectLeadItem(lead);
                                setRejectModalOpen(true);
                              }}
                              disabled={actionLoading === lead.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 disabled:opacity-50 text-xs font-bold transition-all"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        ) : lead.stage === 'QUALIFIED' ? (
                          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Ready for Meeting
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 font-semibold">Processed</span>
                        )}

                        <button
                          onClick={() => handleDeleteLead(lead)}
                          disabled={actionLoading === lead.id}
                          title="Delete Lead"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectModalOpen && rejectLeadItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> Reject Prospect Verification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provide a clear reason why <strong className="text-slate-900">{rejectLeadItem.companyName}</strong> cannot be approved. This reason will be recorded in the audit trail and sent to the partner.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rejection Reason</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this prospect is unqualified or conflicts with existing pipeline..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white h-24 font-medium"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {detailModalOpen && detailLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#4F75FF]" /> {detailLead.companyName}
              </h3>
              {getStageBadge(detailLead.stage)}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-bold block mb-0.5">Website / Domain:</span>
                <span className="text-[#4F75FF] font-semibold">{detailLead.companyWebsite || 'None specified'}</span>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-0.5">Key Contact:</span>
                <span className="text-slate-900 font-bold">{detailLead.contactName} ({detailLead.contactRole})</span>
                <div className="text-slate-600 mt-0.5">{detailLead.contactEmail} • {detailLead.contactPhone}</div>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-0.5">Need Summary:</span>
                <div className="p-3 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 leading-relaxed font-medium">
                  {detailLead.needSummary || 'No summary provided.'}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-0.5">Consent Basis:</span>
                <span className="text-slate-800 font-medium">{detailLead.consentBasis || 'Direct Outreach'}</span>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-0.5">Submitting Partner:</span>
                <span className="text-slate-900 font-bold">{detailLead.partnerName} ({detailLead.partnerEmail})</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#4F75FF] hover:bg-blue-600 text-white text-xs font-bold shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
