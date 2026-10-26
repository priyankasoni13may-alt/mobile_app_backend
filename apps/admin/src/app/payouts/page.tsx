'use client';

import React, { useState } from 'react';
import {
  Banknote,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

export default function PayoutManagementPage() {
  const [batches, setBatches] = useState<any[]>([]);

  const [createBatchModal, setCreateBatchModal] = useState(false);

  const handleExportCsv = () => {
    alert('Generating financial payout CSV with audit log entry (actor: Finance, timestamp: ' + new Date().toISOString() + ')');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Banknote className="w-6 h-6 text-[#5B8EE2]" /> 9. Payout Management & Batches
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Batch approved incentives into disbursement cycles, record NEFT/RTGS transaction IDs, and export reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-lg bg-[#101735] border border-[#1E294B] hover:border-[#5B8EE2] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Payouts CSV
          </button>

          <button
            onClick={() => setCreateBatchModal(true)}
            className="px-3.5 py-2 rounded-lg bg-[#5B8EE2] hover:bg-[#5B8EE2]/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#5B8EE2]/20"
          >
            <Plus className="w-4 h-4" /> Create New Batch
          </button>
        </div>
      </div>

      {/* Batches Table */}
      <div className="rounded-xl bg-[#0B1026] border border-[#1E294B] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#101735] border-b border-[#1E294B] text-slate-400 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Batch Reference</th>
              <th className="py-3 px-4">Items Count</th>
              <th className="py-3 px-4">Total Disbursement</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Banking Reference</th>
              <th className="py-3 px-4">Processed Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E294B]">
            {batches.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <Banknote className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold text-slate-300">No payout batches created yet</p>
                  <p className="text-xs text-slate-500 mt-1">When finance bundles approved commission items for disbursement, batches will appear here.</p>
                </td>
              </tr>
            ) : (
              batches.map((b) => (
                <tr key={b.id} className="hover:bg-[#101735]/50">
                  <td className="py-3.5 px-4 font-bold text-white">{b.batchReference}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{b.itemCount} Commissions</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-400 text-sm">{b.totalAmountFormatted}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sky-400 font-mono text-[11px]">{b.paymentRef}</td>
                  <td className="py-3.5 px-4 text-slate-400">{b.processedDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {createBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1026] border border-[#1E294B] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Banknote className="w-5 h-5 text-[#5B8EE2]" /> Create Payout Batch
            </h3>
            <p className="text-xs text-slate-300">
              Gather all <strong>APPROVED</strong> commission ledger entries into a new batch for finance sign-off.
            </p>

            <div className="p-3 bg-[#101735] border border-[#1E294B] rounded-lg text-xs space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Eligible Approved Entries:</span>
                <span className="font-bold text-white">0</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Amount:</span>
                <span className="font-bold text-emerald-400">₹0</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCreateBatchModal(false)}
                className="px-4 py-1.5 rounded-lg border border-[#1E294B] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Payout batch generated with status DRAFT.');
                  setCreateBatchModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#5B8EE2] hover:bg-[#5B8EE2]/90 text-white text-xs font-bold"
              >
                Create Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
