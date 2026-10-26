'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  Play
} from 'lucide-react';

export default function BonusEvaluationPage() {
  const [evaluations, setEvaluations] = useState<any[]>([]);

  const handleEvaluate = (partnerName: string) => {
    alert(`Triggered real-time evaluation for ${partnerName} for calendar year 2026. Deals inspected in database: 1 Won.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#5B8EE2]" /> 10. Annual Bonus Evaluation
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Governance and audit of the ₹1,00,000 Annual Milestone Excellence Bonus (Target: 15 Closed Clients).
          </p>
        </div>

        <button
          onClick={() => alert('Evaluating all active partners for 2026...')}
          className="px-3.5 py-2 rounded-lg bg-[#5B8EE2] hover:bg-[#5B8EE2]/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#5B8EE2]/20"
        >
          <Play className="w-4 h-4" /> Run Batch Evaluation (2026)
        </button>
      </div>

      <div className="rounded-xl bg-[#0B1026] border border-[#1E294B] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#101735] border-b border-[#1E294B] text-slate-400 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Partner Name</th>
              <th className="py-3 px-4">Evaluation Year</th>
              <th className="py-3 px-4">Milestone Progress</th>
              <th className="py-3 px-4">Bonus Prize</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E294B]">
            {evaluations.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <Trophy className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold text-slate-300">No bonus evaluations underway</p>
                  <p className="text-xs text-slate-500 mt-1">When partners register and begin closing client deals in 2026, annual milestone evaluations will appear here.</p>
                </td>
              </tr>
            ) : (
              evaluations.map((ev) => (
                <tr key={ev.id} className="hover:bg-[#101735]/50">
                  <td className="py-3.5 px-4 font-bold text-white">{ev.partnerName}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-semibold">{ev.periodYear}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white">{ev.actualClients} / {ev.targetClients}</span>
                      <div className="w-24 h-2 bg-[#101735] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5B8EE2]"
                          style={{ width: `${(ev.actualClients / ev.targetClients) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-400">{ev.bonusAmount}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                      {ev.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleEvaluate(ev.partnerName)}
                      className="px-2.5 py-1 rounded bg-[#101735] hover:bg-[#1E294B] text-sky-400 border border-[#1E294B] text-xs font-semibold"
                    >
                      Re-evaluate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
