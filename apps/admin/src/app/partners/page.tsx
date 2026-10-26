'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  FileCheck,
  GraduationCap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface PartnerRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  title: string;
  industries: string[];
  verificationStatus: string;
  onboardingStatus: string;
  agreementsCount: number;
  completedModules: number;
  leadsCount: number;
  joinedDate: string;
}

export default function PartnerManagementPage() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<PartnerRow | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'APPROVE' | 'REJECT' | 'SUSPEND'>('APPROVE');

  const [partners, setPartners] = useState<PartnerRow[]>([]);

  const filteredPartners = partners.filter((p) => {
    if (filter === 'PENDING' && p.onboardingStatus === 'APPROVED') return false;
    if (filter === 'APPROVED' && p.onboardingStatus !== 'APPROVED') return false;
    if (search && !p.fullName.toLowerCase().includes(search.toLowerCase()) && !p.email.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleDecision = async () => {
    if (!selectedPartner) return;
    alert(`Partner ${selectedPartner.fullName} decision: ${decisionType} confirmed. Reason: ${actionReason || 'Standard review'}`);
    setIsDecisionModalOpen(false);
    setActionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#5B8EE2]" /> 2. Partner Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review applicant onboarding gates, identity verification, training completions, and active network status.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search partner name/email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#101735] border border-[#1E294B] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#5B8EE2]"
            />
          </div>

          <div className="flex rounded-lg bg-[#101735] border border-[#1E294B] p-1 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded ${filter === 'ALL' ? 'bg-[#5B8EE2] text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1 rounded ${filter === 'PENDING' ? 'bg-[#5B8EE2] text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => setFilter('APPROVED')}
              className={`px-3 py-1 rounded ${filter === 'APPROVED' ? 'bg-[#5B8EE2] text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Approved
            </button>
          </div>
        </div>
      </div>

      {/* Partners Table */}
      <div className="rounded-xl bg-[#0B1026] border border-[#1E294B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101735] border-b border-[#1E294B] text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Partner Details</th>
                <th className="py-3 px-4">Title & Focus</th>
                <th className="py-3 px-4">Identity Status</th>
                <th className="py-3 px-4">Onboarding Status</th>
                <th className="py-3 px-4">Training</th>
                <th className="py-3 px-4">Leads</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E294B]">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Users className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-semibold text-slate-300">No partners registered yet</p>
                    <p className="text-xs text-slate-500 mt-1">When new partners sign up via the mobile app or self-onboard, they will appear here for review.</p>
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-[#101735]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{partner.fullName}</div>
                      <div className="text-[11px] text-slate-400">{partner.email}</div>
                      <div className="text-[10px] text-slate-500">{partner.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium line-clamp-1">{partner.title}</div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {partner.industries.slice(0, 2).map((ind, i) => (
                          <span key={i} className="text-[10px] bg-[#101735] text-sky-400 px-1.5 py-0.5 rounded border border-[#1E294B]">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {partner.verificationStatus === 'VERIFIED' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : partner.verificationStatus === 'NEEDS_REVIEW' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                          <AlertCircle className="w-3 h-3" /> Needs Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                          <Shield className="w-3 h-3" /> In Progress
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                        partner.onboardingStatus === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {partner.onboardingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-300">
                        <GraduationCap className="w-4 h-4 text-purple-400" />
                        {partner.completedModules} / 3 Modules
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white bg-[#101735] px-2.5 py-1 rounded border border-[#1E294B]">
                        {partner.leadsCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {partner.onboardingStatus !== 'APPROVED' ? (
                          <button
                            onClick={() => {
                              setSelectedPartner(partner);
                              setDecisionType('APPROVE');
                              setIsDecisionModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-[#5B8EE2] hover:bg-[#5B8EE2]/90 text-white font-bold text-xs"
                          >
                            Review & Decide
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedPartner(partner);
                              setDecisionType('SUSPEND');
                              setIsDecisionModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-[#101735] hover:bg-[#1E294B] text-slate-300 text-xs font-medium border border-[#1E294B]"
                          >
                            Manage
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Modal */}
      {isDecisionModalOpen && selectedPartner && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1026] border border-[#1E294B] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#5B8EE2]" /> Confirm Partner Decision
            </h3>
            <p className="text-xs text-slate-300">
              You are modifying status for <strong className="text-white">{selectedPartner.fullName}</strong> ({selectedPartner.email}) to{' '}
              <span className="font-bold text-[#5B8EE2]">{decisionType}</span>.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Audit Reason / Notes</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Specify regulatory or application review reason..."
                className="w-full bg-[#101735] border border-[#1E294B] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#5B8EE2] h-20"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDecisionModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-[#1E294B] text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDecision}
                className="px-4 py-1.5 rounded-lg bg-[#5B8EE2] hover:bg-[#5B8EE2]/90 text-white text-xs font-bold shadow-md shadow-[#5B8EE2]/20"
              >
                Confirm {decisionType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
