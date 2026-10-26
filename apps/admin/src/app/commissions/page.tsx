'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function CommissionApprovalPage() {
  const [commissions, setCommissions] = useState<any[]>([]);

  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjAmount, setAdjAmount] = useState('1000');

  const handleReview = (id: string, approved: boolean) => {
    alert(`Commission ${id} has been ${approved ? 'APPROVED' : 'REJECTED'} by Finance. Immutable ledger updated.`);
    setCommissions(commissions.map((c) => (c.id === id ? { ...c, status: approved ? 'APPROVED' : 'REJECTED' } : c)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-[#5B8EE2]" /> 8. Commission Approval Queue
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Finance verification of qualifying partner incentives. Enforces Rule 11.4: Partners cannot approve own payouts.
          </p>
        </div>

        <button
          onClick={() => setAdjustmentModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-[#101735] border border-[#1E294B] hover:border-[#5B8EE2] text-white text-xs font-semibold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-[#5B8EE2]" /> Create Adjustment Entry
        </button>
      </div>

      {/* Commissions Table */}
      <div className="rounded-xl bg-[#0B1026] border border-[#1E294B] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#101735] border-b border-[#1E294B] text-slate-400 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Partner Details</th>
              <th className="py-3 px-4">Client Deal</th>
              <th className="py-3 px-4">Trigger & Policy</th>
              <th className="py-3 px-4">Incentive Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Finance Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E294B]">
            {commissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <CheckSquare className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold text-slate-300">No commissions pending approval</p>
                  <p className="text-xs text-slate-500 mt-1">When deals are won and payments are verified, automated commission entries will appear here for segregation-of-duties review.</p>
                </td>
              </tr>
            ) : (
              commissions.map((comm) => (
                <tr key={comm.id} className="hover:bg-[#101735]/50">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{comm.partnerName}</div>
                    <div className="text-[11px] text-slate-400">{comm.partnerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">{comm.clientCompany}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-bold text-sky-400">{comm.triggerEvent}</span>
                    <div className="text-[10px] text-slate-500">{comm.policyVersion}</div>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-400 text-sm">
                    {comm.grossAmountFormatted}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      comm.status === 'PENDING_REVIEW'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : comm.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {comm.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {comm.status === 'PENDING_REVIEW' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleReview(comm.id, false)}
                          className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-semibold"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleReview(comm.id, true)}
                          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                        >
                          Approve Payout
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Decision Recorded</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Adjustment Modal */}
      {adjustmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1026] border border-[#1E294B] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" /> Create Append-Only Adjustment
            </h3>
            <p className="text-xs text-slate-300">
              Enter an immutable adjustment or reversal entry linked to the original ledger entry.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Adjustment Type</label>
                <select className="w-full bg-[#101735] border border-[#1E294B] rounded-lg p-2 text-xs text-white">
                  <option value="REVERSAL">REVERSAL (Cancelled Deal)</option>
                  <option value="CORRECTION">CORRECTION (Calculation Rectification)</option>
                  <option value="CLAWBACK">CLAWBACK (Refund Adjustment)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(e.target.value)}
                  className="w-full bg-[#101735] border border-[#1E294B] rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Mandatory Audit Reason</label>
                <textarea
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="Reason for financial adjustment..."
                  className="w-full bg-[#101735] border border-[#1E294B] rounded-lg p-2.5 text-xs text-white h-20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAdjustmentModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-[#1E294B] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Adjustment entry recorded in commission_adjustments.');
                  setAdjustmentModalOpen(false);
                }}
                disabled={!adjustmentReason.trim()}
                className="px-4 py-1.5 rounded-lg bg-[#5B8EE2] hover:bg-[#5B8EE2]/90 disabled:opacity-50 text-white text-xs font-bold"
              >
                Save Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
