'use client';

import React, { useState } from 'react';
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
    { label: 'Active Partners', value: '1', change: '1 verified partner', icon: Users, color: 'text-[#4F75FF]', bg: 'bg-blue-50' },
    { label: 'Total Leads Registered', value: '1', change: '1 prospect in audit', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Client Meetings Held', value: '0', change: 'Discovery phase', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Diagnostics & Deals Won', value: '0', change: '₹0 Total Value', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Incentive Approval', value: '₹0', change: '0 commissions waiting', icon: Banknote, color: 'text-amber-600', bg: 'bg-amber-50', alert: false },
    { label: 'Partner Payouts Completed', value: '₹0', change: '0 disbursed batches', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  const funnelSteps = [
    { name: '1. New Inquiries', count: 1, pct: '100%', color: 'bg-blue-600' },
    { name: '2. Contacted', count: 0, pct: '0%', color: 'bg-sky-500' },
    { name: '3. Qualified Fit', count: 0, pct: '0%', color: 'bg-indigo-500' },
    { name: '4. Meeting Completed', count: 0, pct: '0%', color: 'bg-purple-500' },
    { name: '5. Diagnostic Proposed', count: 0, pct: '0%', color: 'bg-amber-500' },
    { name: '6. Diagnostic Won (₹37K)', count: 0, pct: '0%', color: 'bg-emerald-500' },
    { name: '7. Full Service Contract', count: 0, pct: '0%', color: 'bg-[#4F75FF]' },
  ];

  const recentPendingActions: any[] = [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            Overview Dashboard
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              Live Production
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time performance and financial governance across Lumora Growth & Cypher Swift Tech.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedBU}
            onChange={(e) => setSelectedBU(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#4F75FF] shadow-xs"
          >
            <option value="ALL">All Business Units</option>
            <option value="LUMORA">Lumora Digital Growth</option>
            <option value="CYPHER">Cypher Swift Technology</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#4F75FF] shadow-xs"
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
              className={`p-5 rounded-xl bg-white border border-slate-200 shadow-xs transition-all hover:border-[#4F75FF]/50 ${
                kpi.alert ? 'border-amber-300 shadow-sm' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">{kpi.label}</span>
                <div className={`p-2 rounded-xl ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</span>
                <span className={`text-[11px] font-bold ${kpi.alert ? 'text-amber-700' : 'text-slate-500'}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content: Conversion Funnel + Pending Actions Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Full Conversion Funnel</h2>
              <p className="text-xs text-slate-500 mt-0.5">Prospect outreach to service revenue conversion rate</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-[#4F75FF] border border-blue-200">
              Q1 Target: 30 Prospects
            </span>
          </div>

          <div className="space-y-4">
            {funnelSteps.map((step, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 font-semibold">{step.name}</span>
                  <span className="text-slate-900 font-bold">{step.count} leads ({step.pct})</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${step.color} transition-all duration-500 rounded-full`}
                    style={{ width: step.pct }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Review Queue */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Action Required
              </h2>
              <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                recentPendingActions.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {recentPendingActions.length} Pending
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Items requiring segregation-of-duties review or operational approval.
            </p>

            <div className="space-y-3">
              {recentPendingActions.length === 0 ? (
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <Sparkles className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">Review Queues Clear</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    No pending approval items. When new partners onboard or register leads, they will appear here.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-4">
            <Link
              href="/leads"
              className="w-full block text-center py-2 px-4 rounded-lg bg-[#4F75FF] text-white text-xs font-bold hover:bg-blue-600 transition-colors shadow-xs"
            >
              Open Lead Qualification Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
