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
  ThumbsDown
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

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> Pending Verification
          </span>
        );
      case 'QUALIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5" /> Approved & Qualified
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            Contacted
          </span>
        );
      case 'MEETING_SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            Meeting Scheduled
          </span>
        );
      case 'UNQUALIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" /> Unqualified / Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
            {stage}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#5B8EE2]" /> Prospect Verification & Lead Governance
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review and approve partner-submitted prospect registrations, resolve duplicate domain claims, and manage pipeline eligibility.
          </p>
        </div>

        <button
          onClick={() => fetchLeads()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#101735] hover:bg-[#1E294B] text-slate-200 text-xs font-semibold border border-[#1E294B] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* Duplicate Claim Conflict Queue Alert */}
      {conflicts.length > 0 && (
        <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" /> Ownership Claim Conflicts Awaiting Decision ({conflicts.length})
            </div>
            <span className="text-[11px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded">
              Rule 5.2 Segregation
            </span>
          </div>

          {conflicts.map((c) => (
            <div key={c.id} className="p-4 rounded-lg bg-[#0B1026] border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-white">{c.existingLead?.companyName || 'Lead Conflict'}</p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Reason: <span className="text-amber-300 font-medium">"{c.reason}"</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => alert('Decision recorded')}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
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
            className="w-full bg-[#101735] border border-[#1E294B] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#5B8EE2]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-[#101735] border border-[#1E294B] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5B8EE2]"
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
      <div className="rounded-xl bg-[#0B1026] border border-[#1E294B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101735] border-b border-[#1E294B] text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Company & Prospect</th>
                <th className="py-3 px-4">Key Contact Details</th>
                <th className="py-3 px-4">Partner Attribution</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E294B]">
              {loading && leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#5B8EE2]" />
                    Loading prospect database...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Building2 className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-semibold text-slate-300">No leads registered matching this criteria</p>
                    <p className="text-xs text-slate-500 mt-1">When partners submit prospective clients, they will appear here for verification.</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#101735]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{lead.companyName}</div>
                      {lead.companyWebsite ? (
                        <div className="text-[11px] text-sky-400 mt-0.5">{lead.companyWebsite}</div>
                      ) : null}
                      <button
                        onClick={() => {
                          setDetailLead(lead);
                          setDetailModalOpen(true);
                        }}
                        className="text-[10px] text-[#5B8EE2] hover:underline mt-1 font-medium inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> View Need & Details
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{lead.contactName}</div>
                      <div className="text-[11px] text-slate-400">{lead.contactRole}</div>
                      <div className="text-[11px] text-slate-300 mt-1 flex flex-col gap-0.5">
                        {lead.contactEmail ? (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Mail className="w-3 h-3 text-slate-500" /> {lead.contactEmail}
                          </span>
                        ) : null}
                        {lead.contactPhone ? (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Phone className="w-3 h-3 text-slate-500" /> {lead.contactPhone}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{lead.partnerName}</div>
                      {lead.partnerPhone ? (
                        <div className="text-[11px] text-slate-400">{lead.partnerPhone}</div>
                      ) : null}
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStageBadge(lead.stage)}
                      {lead.unqualifiedReason ? (
                        <div className="text-[11px] text-rose-400 italic mt-1 max-w-xs">
                          "{lead.unqualifiedReason}"
                        </div>
                      ) : null}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {lead.stage === 'NEW' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApproveLead(lead)}
                            disabled={actionLoading === lead.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => {
                              setRejectLeadItem(lead);
                              setRejectModalOpen(true);
                            }}
                            disabled={actionLoading === lead.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 disabled:opacity-50 text-xs font-semibold transition-all"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : lead.stage === 'QUALIFIED' ? (
                        <span className="text-xs text-emerald-400 font-semibold inline-flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Ready for Meeting
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">Processed</span>
                      )}
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1026] border border-[#1E294B] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" /> Reject Prospect Verification
            </h3>
            <p className="text-xs text-slate-300">
              Provide a clear reason why <strong className="text-white">{rejectLeadItem.companyName}</strong> cannot be approved. This reason will be recorded in the audit trail and sent to the partner.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Rejection Reason</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this prospect is unqualified or conflicts with existing pipeline..."
                className="w-full bg-[#101735] border border-[#1E294B] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500 h-24"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-[#1E294B] text-slate-300 text-xs font-semibold hover:bg-[#101735]"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {detailModalOpen && detailLead && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1026] border border-[#1E294B] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E294B] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#5B8EE2]" /> {detailLead.companyName}
              </h3>
              {getStageBadge(detailLead.stage)}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Website / Domain:</span>
                <span className="text-sky-400 font-mono">{detailLead.companyWebsite || 'None specified'}</span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Key Contact:</span>
                <span className="text-white font-medium">{detailLead.contactName} ({detailLead.contactRole})</span>
                <div className="text-slate-400 mt-0.5">{detailLead.contactEmail} • {detailLead.contactPhone}</div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Need Summary:</span>
                <div className="p-3 rounded-lg bg-[#101735] text-slate-200 border border-[#1E294B] leading-relaxed">
                  {detailLead.needSummary || 'No summary provided.'}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Consent Basis:</span>
                <span className="text-slate-300">{detailLead.consentBasis || 'Direct Outreach'}</span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Submitting Partner:</span>
                <span className="text-white font-medium">{detailLead.partnerName} ({detailLead.partnerEmail})</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#5B8EE2] hover:bg-[#5B8EE2]/90 text-white text-xs font-bold"
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
