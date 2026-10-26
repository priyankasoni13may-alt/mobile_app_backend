'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  Calendar,
  Layers,
  Banknote,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const [selectedBU, setSelectedBU] = useState('ALL');
  const [timeRange, setTimeRange] = useState('ALL_TIME');

  const kpis = [
    { label: 'Active Partners', value: '0', change: 'Awaiting partner signups', icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Total Leads Registered', value: '0', change: '0 new this week', icon: Building2, color: 'text-[#5B8EE2]', bg: 'bg-[#5B8EE2]/10' },
    { label: 'Client Meetings Held', value: '0', change: 'No meetings scheduled', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Diagnostics & Deals Won', value: '0', change: '₹0 Total Value', icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Pending Incentive Approval', value: '₹0', change: '0 commissions waiting', icon: Banknote, color: 'text-amber-400', bg: 'bg-amber-500/10', alert: false },
    { label: 'Partner Payouts Completed', value: '₹0', change: '0 disbursed batches', icon: TrendingUp, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  ];

  const funnelSteps = [
    { name: '1. New Inquiries', count: 0, pct: '0%', color: 'bg-blue-600' },
    { name: '2. Contacted', count: 0, pct: '0%', color: 'bg-sky-500' },
    { name: '3. Qualified Fit', count: 0, pct: '0%', color: 'bg-indigo-500' },
    { name: '4. Meeting Completed', count: 0, pct: '0%', color: 'bg-purple-500' },
    { name: '5. Diagnostic Proposed', count: 0, pct: '0%', color: 'bg-amber-500' },
    { name: '6. Diagnostic Won (₹37K)', count: 0, pct: '0%', color: 'bg-emerald-500' },
    { name: '7. Full Service Contract', count: 0, pct: '0%', color: 'bg-[#5B8EE2]' },
  ];

  const recentPendingActions: any[] = [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Overview Dashboard
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Production
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time performance and financial governance across Lumora Growth & Cypher Swift Tech.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedBU}
            onChange={(e) => setSelectedBU(e.target.value)}
            className="bg-[#101735] border border-[#1E294B] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#5B8EE2]"
          >
            <option value="ALL">All Business Units</option>
            <option value="LUMORA">Lumora Digital Growth</option>
            <option value="CYPHER">Cypher Swift Technology</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#101735] border border-[#1E294B] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#5B8EE2]"
          >
            <option value="ALL_TIME">All Time</option>
            <option value="THIS_QUARTER">This Quarter (Q1 2026)</option>
            <option value="THIS_MONTH">This Month</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-xl bg-[#0B1026] border transition-all hover:border-[#5B8EE2]/50 ${
                kpi.alert ? 'border-amber-500/50 shadow-lg shadow-amber-500/5' : 'border-[#1E294B]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{kpi.label}</span>
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white tracking-tight">{kpi.value}</span>
                <span className={`text-[11px] font-semibold ${kpi.alert ? 'text-amber-400' : 'text-slate-400'}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content: Conversion Funnel + Pending Actions Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conversion Funnel */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#0B1026] border border-[#1E294B]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Full Conversion Funnel</h2>
              <p className="text-xs text-slate-400">Prospect outreach to service revenue conversion rate</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#5B8EE2]/10 text-[#5B8EE2]">
              Overall Win Rate: 14%
            </span>
          </div>

          <div className="space-y-4">
            {funnelSteps.map((step, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{step.name}</span>
                  <span className="text-white font-bold">{step.count} leads ({step.pct})</span>
                </div>
                <div className="w-full h-2.5 bg-[#101735] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${step.color} transition-all duration-500`}
                    style={{ width: step.pct }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Review Queue */}
        <div className="p-6 rounded-xl bg-[#0B1026] border border-[#1E294B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Action Required
              </h2>
              <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                recentPendingActions.length > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {recentPendingActions.length} Pending
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Items requiring segregation-of-duties review or operational approval.
            </p>

            <div className="space-y-3">
              {recentPendingActions.length === 0 ? (
                <div className="p-6 rounded-lg bg-[#101735] border border-[#1E294B]/80 text-center space-y-2">
                  <Sparkles className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="text-xs font-semibold text-white">Review Queues Clear</p>
                  <p className="text-[11px] text-slate-400">
                    No pending approval items. When new partners onboard or register leads, they will appear here.
                  </p>
                </div>
              ) : (
                recentPendingActions.map((action, i) => (
                  <div key={i} className="p-3.5 rounded-lg bg-[#101735] border border-[#1E294B]/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#5B8EE2] uppercase tracking-wider">{action.type}</span>
                      <span className="text-amber-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {action.urgency}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-white line-clamp-1">{action.title}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">{action.partner}</span>
                      <Link
                        href={action.href}
                        className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-0.5"
                      >
                        Review <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E294B] mt-4">
            <Link
              href="/commissions"
              className="w-full block text-center py-2 px-4 rounded-lg bg-[#5B8EE2] text-white text-xs font-bold hover:bg-[#5B8EE2]/90 transition-colors shadow-lg shadow-[#5B8EE2]/20"
            >
              Open Commission Approval Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
