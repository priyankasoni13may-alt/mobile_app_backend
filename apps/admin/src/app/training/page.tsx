'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  FileCheck,
  Plus,
  Video,
  FileText,
  HelpCircle,
  CheckCircle,
  Eye
} from 'lucide-react';

export default function TrainingAgreementsPage() {
  const [activeTab, setActiveTab] = useState<'TRAINING' | 'AGREEMENTS'>('TRAINING');

  const modules = [
    {
      id: 'mod-01-compliance',
      title: 'Partner Ethics, Compliance & Anti-Spam Guidelines',
      type: 'ARTICLE',
      isMandatory: true,
      completions: 48,
      status: 'PUBLISHED'
    },
    {
      id: 'mod-02-lumora-pitch',
      title: 'Pitching Lumora Digital Growth & Branding',
      type: 'VIDEO',
      isMandatory: true,
      completions: 45,
      status: 'PUBLISHED'
    },
    {
      id: 'mod-03-cypher-ai',
      title: 'Pitching Cypher Swift Custom AI & SaaS Automation',
      type: 'QUIZ',
      isMandatory: true,
      completions: 42,
      status: 'PUBLISHED'
    }
  ];

  const agreements = [
    {
      id: 'agr-2026-v1',
      title: 'Partner Code of Conduct & Commercial Incentive Agreement',
      version: '2026.1',
      effectiveDate: '2026-01-01',
      acceptancesCount: 48,
      isActive: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#5B8EE2]" /> 6. Training Modules & Agreements
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure partner onboarding curriculum, compliance quizzes, and binding legal agreements.
          </p>
        </div>

        <div className="flex rounded-lg bg-[#101735] border border-[#1E294B] p-1 text-xs">
          <button
            onClick={() => setActiveTab('TRAINING')}
            className={`px-4 py-1.5 rounded font-semibold transition-colors ${
              activeTab === 'TRAINING' ? 'bg-[#5B8EE2] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Training Modules ({modules.length})
          </button>
          <button
            onClick={() => setActiveTab('AGREEMENTS')}
            className={`px-4 py-1.5 rounded font-semibold transition-colors ${
              activeTab === 'AGREEMENTS' ? 'bg-[#5B8EE2] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Legal Agreements ({agreements.length})
          </button>
        </div>
      </div>

      {activeTab === 'TRAINING' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">All mandatory modules must be completed before partner dashboard unlock.</span>
            <button
              onClick={() => alert('New training module editor')}
              className="px-3 py-1.5 rounded-lg bg-[#5B8EE2] text-white text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Module
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {modules.map((m) => (
              <div key={m.id} className="p-5 rounded-xl bg-[#0B1026] border border-[#1E294B] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-[#101735] text-[#5B8EE2] font-bold px-2 py-0.5 rounded border border-[#1E294B]">
                    {m.type}
                  </span>
                  {m.isMandatory && (
                    <span className="text-[10px] bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded">
                      MANDATORY
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white">{m.title}</h3>
                <p className="text-xs text-slate-400">Completions: <strong className="text-white">{m.completions} Partners</strong></p>

                <div className="pt-2 border-t border-[#1E294B] flex justify-end">
                  <button className="text-xs text-sky-400 font-semibold hover:underline">Edit Curriculum</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-[#0B1026] border border-[#1E294B] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101735] border-b border-[#1E294B] text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Agreement Document</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Effective Date</th>
                  <th className="py-3 px-4">Acceptances</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E294B]">
                {agreements.map((agr) => (
                  <tr key={agr.id} className="hover:bg-[#101735]/50">
                    <td className="py-3.5 px-4 font-bold text-white">{agr.title}</td>
                    <td className="py-3.5 px-4 font-semibold text-sky-400">{agr.version}</td>
                    <td className="py-3.5 px-4 text-slate-300">{agr.effectiveDate}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">{agr.acceptancesCount} Accepted</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-2.5 py-1 rounded bg-[#101735] border border-[#1E294B] text-slate-300 hover:text-white text-xs">
                        View Text
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
