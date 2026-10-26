'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Edit3,
  History,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function ServicesCMSPage() {
  const [services, setServices] = useState([
    {
      id: 'svc-shared-diag',
      name: 'Shared Business Growth & Technology Diagnostic',
      businessUnit: 'Shared (Lumora + Cypher Swift)',
      priceFormatted: '₹37,000',
      pricePaise: '3700000',
      version: 1,
      isActive: true,
      icp: 'Mid-sized businesses ($1M - $25M revenue) seeking digital transformation.',
      commercialDisclaimer: 'Proposed commercial data awaiting formal contract execution.'
    },
    {
      id: 'svc-lumora-perf',
      name: 'Omnichannel Performance Marketing Retainer',
      businessUnit: 'Lumora Digital Growth',
      priceFormatted: '₹1,50,000 / mo',
      pricePaise: '15000000',
      version: 2,
      isActive: true,
      icp: 'D2C and B2B scale-ups seeking predictable CAC and pipeline.',
      commercialDisclaimer: null
    },
    {
      id: 'svc-cypher-custom-ai',
      name: 'Autonomous AI Agents & Live Consultant Implementation',
      businessUnit: 'Cypher Swift Technology',
      priceFormatted: '₹3,50,000',
      pricePaise: '35000000',
      version: 1,
      isActive: true,
      icp: 'Enterprises with 50+ inbound customer interactions daily.',
      commercialDisclaimer: null
    }
  ]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#5B8EE2]" /> 5. Service Catalogue CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage productized offerings, pitch guidelines, qualifying criteria, and snapshot versioning.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedService({ name: '', businessUnit: 'Lumora Growth', priceFormatted: '₹50,000', icp: '' });
            setEditModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-lg bg-[#5B8EE2] hover:bg-[#5B8EE2]/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#5B8EE2]/20"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <div key={svc.id} className="p-5 rounded-xl bg-[#0B1026] border border-[#1E294B] flex flex-col justify-between space-y-4 hover:border-[#5B8EE2]/50 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#5B8EE2] uppercase tracking-wider">
                  {svc.businessUnit}
                </span>
                <span className="text-[10px] font-semibold bg-[#101735] text-sky-400 px-2 py-0.5 rounded border border-[#1E294B]">
                  v{svc.version}.0
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{svc.name}</h3>
              <p className="text-xs text-slate-300 line-clamp-2">{svc.icp}</p>

              {svc.commercialDisclaimer && (
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{svc.commercialDisclaimer}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#1E294B] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Package Price</span>
                <span className="text-sm font-extrabold text-white">{svc.priceFormatted}</span>
              </div>

              <button
                onClick={() => {
                  setSelectedService(svc);
                  setEditModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#101735] hover:bg-[#1E294B] text-slate-200 text-xs font-semibold border border-[#1E294B] flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit CMS
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit CMS Modal */}
      {editModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1026] border border-[#1E294B] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#5B8EE2]" /> Service Content & Pitch CMS
            </h3>
            <p className="text-xs text-slate-400">
              Modifications will create an immutable historical version snapshot in <code>service_versions</code>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Service Title</label>
                <input
                  type="text"
                  defaultValue={selectedService.name}
                  className="w-full bg-[#101735] border border-[#1E294B] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#5B8EE2]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Package Price (Formatted)</label>
                <input
                  type="text"
                  defaultValue={selectedService.priceFormatted}
                  className="w-full bg-[#101735] border border-[#1E294B] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#5B8EE2]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Ideal Customer Profile (ICP)</label>
                <textarea
                  defaultValue={selectedService.icp}
                  className="w-full bg-[#101735] border border-[#1E294B] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#5B8EE2] h-16"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#1E294B]">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-[#1E294B] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Service CMS updated and snapshot version archived.');
                  setEditModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#5B8EE2] hover:bg-[#5B8EE2]/90 text-white text-xs font-bold"
              >
                Publish New Version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
