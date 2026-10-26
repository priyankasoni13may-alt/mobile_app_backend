'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Building,
  Database,
  Save,
  CheckCircle2
} from 'lucide-react';

export default function SystemSettingsPage() {
  const [diagnosticPrice, setDiagnosticPrice] = useState('37000');
  const [retentionDays, setRetentionDays] = useState('2555'); // 7 years

  const handleSave = () => {
    alert('System settings and commercial parameters updated successfully.');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#5B8EE2]" /> 14. System Configuration & Governance
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage RBAC permissions, commercial defaults, multi-tenant business units, and masked API credentials.
        </p>
      </div>

      {/* Business Units & Brand Tokens */}
      <div className="p-6 rounded-xl bg-[#0B1026] border border-[#1E294B] space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-[#5B8EE2]" /> Active Business Units & Brand Assets
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#101735] border border-[#1E294B] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Lumora Digital Growth & Branding</span>
              <span className="w-3 h-3 rounded-full bg-[#5B8EE2]"></span>
            </div>
            <p className="text-xs text-slate-400">Marketing, SEO, demand generation, and creative optimization.</p>
            <div className="text-[11px] text-slate-400 font-mono">Accent Token: #5B8EE2 | Base: #0B1026</div>
          </div>

          <div className="p-4 rounded-lg bg-[#101735] border border-[#1E294B] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Cypher Swift InfoTech</span>
              <span className="w-3 h-3 rounded-full bg-[#38BDF8]"></span>
            </div>
            <p className="text-xs text-slate-400">Web/mobile apps, AI agents, SaaS automation, and CRM consulting.</p>
            <div className="text-[11px] text-slate-400 font-mono">Accent Token: #003566 | Primary: #38BDF8</div>
          </div>
        </div>
      </div>

      {/* Commercial Defaults */}
      <div className="p-6 rounded-xl bg-[#0B1026] border border-[#1E294B] space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-[#5B8EE2]" /> Commercial & Retention Defaults
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Shared Business Diagnostic Default Price (₹)</label>
            <input
              type="number"
              value={diagnosticPrice}
              onChange={(e) => setDiagnosticPrice(e.target.value)}
              className="w-full bg-[#101735] border border-[#1E294B] rounded-lg p-2 text-white font-bold"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">Stored as integer paise (3,700,000 paise).</span>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Financial Audit Retention Period (Days)</label>
            <input
              type="number"
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              className="w-full bg-[#101735] border border-[#1E294B] rounded-lg p-2 text-white font-bold"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">7 Years statutory financial retention.</span>
          </div>
        </div>
      </div>

      {/* Integration Credentials (Masked) */}
      <div className="p-6 rounded-xl bg-[#0B1026] border border-[#1E294B] space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-[#5B8EE2]" /> Integration Status & Masked Credentials
        </h2>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#101735]">
            <span className="text-slate-300">PostgreSQL 16 Connection:</span>
            <span className="font-mono text-emerald-400 font-semibold">postgresql://postgres:••••••••@localhost:5432/lumora_cypher_db</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#101735]">
            <span className="text-slate-300">Redis 7 (BullMQ Cache):</span>
            <span className="font-mono text-emerald-400 font-semibold">redis://localhost:6379</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#101735]">
            <span className="text-slate-300">JWT Secret:</span>
            <span className="font-mono text-slate-400">lumora_••••••••••••••••••••••••</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-lg bg-[#5B8EE2] hover:bg-[#5B8EE2]/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#5B8EE2]/20"
        >
          <Save className="w-4 h-4" /> Save System Settings
        </button>
      </div>
    </div>
  );
}
