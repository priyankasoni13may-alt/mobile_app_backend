'use client';

import React, { useState } from 'react';
import {
  Bell,
  Send,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Mail,
  Sliders
} from 'lucide-react';

export default function NotificationManagementPage() {
  const templates = [
    { type: 'APPLICATION_STATUS', title: 'Partner Application Approved', channel: 'In-App, Email, Push', triggers: 'Operations approval' },
    { type: 'MEETING_REMINDER', title: 'Client Meeting in 1 Hour', channel: 'In-App, Push', triggers: 'T-60m before meeting' },
    { type: 'COMMISSION_STATUS', title: 'New Incentive Generated', channel: 'In-App, Push', triggers: 'Diagnostic/Service Won' },
    { type: 'PAYOUT_STATUS', title: 'Commission Payout Disbursed', channel: 'In-App, Email, Push', triggers: 'Batch payment recorded' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#5B8EE2]" /> 13. Notification Management & Dispatch
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure automated dispatch triggers, template strings, and multi-channel delivery worker queues.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tpl, i) => (
          <div key={i} className="p-5 rounded-xl bg-[#0B1026] border border-[#1E294B] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-[#101735] text-[#5B8EE2] font-bold px-2 py-0.5 rounded border border-[#1E294B]">
                {tpl.type}
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Trigger
              </span>
            </div>

            <h3 className="text-sm font-bold text-white">{tpl.title}</h3>
            <p className="text-xs text-slate-400">Trigger Condition: <span className="text-slate-200">{tpl.triggers}</span></p>

            <div className="pt-2 border-t border-[#1E294B] flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                {tpl.channel}
              </span>

              <button className="text-xs text-sky-400 font-semibold hover:underline">
                Edit Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
