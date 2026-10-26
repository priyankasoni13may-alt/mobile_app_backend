'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Filter,
  PieChart,
  Users
} from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('LEADERBOARD');

  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const leadSources = [
    { source: 'Direct Outreach', count: 0, pct: '0%' },
    { source: 'Client Referrals', count: 0, pct: '0%' },
    { source: 'LinkedIn Networking', count: 0, pct: '0%' },
    { source: 'Industry Conferences & Summits', count: 0, pct: '0%' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#5B8EE2]" /> 11. Reports & Business Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Deep dive into partner leaderboards, acquisition channel distribution, and commercial ROI.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting full analytics workbook as CSV...')}
          className="px-3.5 py-2 rounded-lg bg-[#101735] border border-[#1E294B] hover:border-[#5B8EE2] text-slate-200 text-xs font-semibold flex items-center gap-1.5"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Full Report
        </button>
      </div>

      {/* Grid: Leaderboard & Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Partner Leaderboard */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0B1026] border border-[#1E294B] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Partner Performance Rankings
            </h2>
            <span className="text-xs text-slate-400">Top Performers Q1 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101735] border-b border-[#1E294B] text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Partner Name</th>
                  <th className="py-2.5 px-3">Leads</th>
                  <th className="py-2.5 px-3">Meetings</th>
                  <th className="py-2.5 px-3">Closed Won</th>
                  <th className="py-2.5 px-3 text-right">Incentive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E294B]">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <TrendingUp className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-40" />
                      <p className="text-sm font-semibold text-slate-300">No partner rankings yet</p>
                      <p className="text-xs text-slate-500 mt-1">Performance leaderboards will populate as partners register and close deals.</p>
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((row) => (
                    <tr key={row.rank} className="hover:bg-[#101735]/50">
                      <td className="py-3 px-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          row.rank === 1 ? 'bg-amber-400 text-slate-900' : 'bg-[#101735] text-slate-300'
                        }`}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white">{row.name}</td>
                      <td className="py-3 px-3 font-semibold text-slate-300">{row.leads}</td>
                      <td className="py-3 px-3 text-slate-300">{row.meetings}</td>
                      <td className="py-3 px-3 text-emerald-400 font-semibold">{row.dealsWon}</td>
                      <td className="py-3 px-3 text-right font-extrabold text-white">{row.commissionsEarned}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Channel Share */}
        <div className="p-5 rounded-xl bg-[#0B1026] border border-[#1E294B] space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#5B8EE2]" /> Lead Source Breakdown
          </h2>

          <div className="space-y-3 pt-2">
            {leadSources.map((ls, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">{ls.source}</span>
                  <span className="font-bold text-white">{ls.count} ({ls.pct})</span>
                </div>
                <div className="w-full h-2 bg-[#101735] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#5B8EE2] to-sky-400" style={{ width: ls.pct }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
