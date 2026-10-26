'use client';

import React, { useState } from 'react';
import {
  Building2,
  Search,
  AlertTriangle,
  UserCheck,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';

export default function LeadManagementPage() {
  const [stageFilter, setStageFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [newOwner, setNewOwner] = useState('user-sales-04');
  const [reassignReason, setReassignReason] = useState('');

  const [leads, setLeads] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);

  const handleReassign = () => {
    alert(`Lead ${selectedLead.companyName} reassigned to ${newOwner}. Reason: ${reassignReason}`);
    setReassignModalOpen(false);
    setReassignReason('');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-[#5B8EE2]" /> 3. Lead Management & Ownership
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Master registry of all enterprise leads, duplicate conflict arbitration, and ownership governance.
        </p>
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
                <p className="text-xs font-bold text-white">{c.companyName} ({c.domain})</p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Registered Owner: <span className="text-sky-400 font-semibold">{c.originalPartner}</span> | Claimant:{' '}
                  <span className="text-amber-400 font-semibold">{c.claimantPartner}</span>
                </p>
                <p className="text-[11px] text-slate-400 italic mt-1">"{c.reason}"</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => alert(`Upheld Original Owner (${c.originalPartner}) for ${c.companyName}`)}
                  className="px-3 py-1.5 rounded bg-[#101735] hover:bg-[#1E294B] text-white text-xs font-semibold border border-[#1E294B]"
                >
                  Uphold Original
                </button>
                <button
                  onClick={() => alert(`Approved 50-50 Split Commission for ${c.companyName}`)}
                  className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
                >
                  Approve Split (50%)
                </button>
                <button
                  onClick={() => alert(`Transferred Ownership to ${c.claimantPartner}`)}
                  className="px-3 py-1.5 rounded bg-[#5B8EE2] hover:bg-[#5B8EE2]/90 text-white text-xs font-bold"
                >
                  Transfer Claim
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
            className="w-full bg-[#101735] border border-[#1E294B] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#5B8EE2]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-[#101735] border border-[#1E294B] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#5B8EE2]"
          >
            <option value="ALL">All Stages</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
            <option value="DIAGNOSTIC_WON">Diagnostic Won</option>
            <option value="SERVICE_WON">Service Won</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-xl bg-[#0B1026] border border-[#1E294B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101735] border-b border-[#1E294B] text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Company & Domain</th>
                <th className="py-3 px-4">Key Contact</th>
                <th className="py-3 px-4">Partner Attribution</th>
                <th className="py-3 px-4">Sales Owner</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E294B]">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Building2 className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-semibold text-slate-300">No leads registered yet</p>
                    <p className="text-xs text-slate-500 mt-1">When partners or staff register prospective clients, they will appear here.</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#101735]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{lead.companyName}</div>
                      <div className="text-[11px] text-sky-400">{lead.companyWebsite}</div>
                      <div className="text-[10px] text-slate-400">{lead.businessUnit}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{lead.contactName}</div>
                      <div className="text-[11px] text-slate-400">{lead.contactRole}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{lead.partnerName}</div>
                      <div className="text-[10px] text-slate-500">Registered {lead.createdAt}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-medium">{lead.ownerName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {lead.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setReassignModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded bg-[#101735] hover:bg-[#1E294B] text-slate-300 hover:text-white border border-[#1E294B] text-xs font-medium"
                      >
                        Reassign Owner
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reassign Modal */}
      {reassignModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1026] border border-[#1E294B] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#5B8EE2]" /> Reassign Lead Ownership
            </h3>
            <p className="text-xs text-slate-300">
              Transfer internal sales ownership for <strong className="text-white">{selectedLead.companyName}</strong>.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Select New Owner</label>
              <select
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                className="w-full bg-[#101735] border border-[#1E294B] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#5B8EE2]"
              >
                <option value="user-sales-04">Rohan Verma (Sales Manager)</option>
                <option value="user-ops-02">Aarav Patel (Operations)</option>
                <option value="user-admin-01">Super Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Mandatory Audit Reason</label>
              <textarea
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                placeholder="Reason for reassignment (logged to append-only audit trail)..."
                className="w-full bg-[#101735] border border-[#1E294B] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#5B8EE2] h-20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setReassignModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-[#1E294B] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReassign}
                disabled={!reassignReason.trim()}
                className="px-4 py-1.5 rounded-lg bg-[#5B8EE2] hover:bg-[#5B8EE2]/90 disabled:opacity-50 text-white text-xs font-bold"
              >
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
