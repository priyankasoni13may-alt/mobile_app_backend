'use client';

import React, { useState } from 'react';
import {
  Layers,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function DealPipelineReviewPage() {
  const [deals, setDeals] = useState<any[]>([]);

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);

  const handleVerify = (approved: boolean) => {
    alert(`Payment evidence ${approved ? 'APPROVED' : 'REJECTED'} for ${selectedDeal.companyName}`);
    setVerifyModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-[#5B8EE2]" /> 7. Deal & Pipeline Governance
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review commercial contracts, verify UTR banking receipts, and audit delivery handoffs.
        </p>
      </div>

      <div className="rounded-xl bg-[#0B1026] border border-[#1E294B] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#101735] border-b border-[#1E294B] text-slate-400 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Client Deal</th>
              <th className="py-3 px-4">Deal Type</th>
              <th className="py-3 px-4">Commercial Value</th>
              <th className="py-3 px-4">Contract</th>
              <th className="py-3 px-4">Payment Verification</th>
              <th className="py-3 px-4">Partner</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E294B]">
            {deals.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <Layers className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold text-slate-300">No deals or contracts registered yet</p>
                  <p className="text-xs text-slate-500 mt-1">Converted diagnostic engagements and service contracts will appear here for review.</p>
                </td>
              </tr>
            ) : (
              deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-[#101735]/50">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{deal.companyName}</div>
                    <div className="text-[11px] text-slate-400">{deal.serviceName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#101735] text-[#5B8EE2] border border-[#1E294B]">
                      {deal.dealType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-white">{deal.amountFormatted}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-400 font-semibold">{deal.contractStatus}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {deal.paymentStatus === 'VERIFIED' ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                        </span>
                        <div className="text-[10px] text-slate-500">Ref: {deal.paymentRef}</div>
                      </div>
                    ) : (
                      <span className="text-amber-400 font-semibold">PENDING EVIDENCE</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{deal.partnerName}</td>
                  <td className="py-3.5 px-4 text-right">
                    {deal.paymentStatus !== 'VERIFIED' && (
                      <button
                        onClick={() => {
                          setSelectedDeal(deal);
                          setVerifyModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded bg-[#5B8EE2] text-white font-bold text-xs hover:bg-[#5B8EE2]/90"
                      >
                        Verify Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {verifyModalOpen && selectedDeal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1026] border border-[#1E294B] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Verify Client Payment Receipt
            </h3>
            <p className="text-xs text-slate-300">
              Verify receipt of <strong>{selectedDeal.amountFormatted}</strong> for <strong>{selectedDeal.companyName}</strong>.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Bank UTR / Transaction Reference</label>
              <input
                type="text"
                placeholder="e.g. HDFC-IMPS-9021882..."
                className="w-full bg-[#101735] border border-[#1E294B] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#5B8EE2]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => handleVerify(false)}
                className="px-3 py-1.5 rounded-lg bg-rose-600/80 text-white text-xs font-semibold"
              >
                Reject Receipt
              </button>
              <button
                onClick={() => handleVerify(true)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                Approve & Mark Won
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
