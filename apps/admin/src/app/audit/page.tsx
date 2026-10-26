'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Clock,
  Filter,
  Eye,
  Lock
} from 'lucide-react';

export default function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const [auditEvents, setAuditEvents] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#5B8EE2]" /> 12. Immutable System Audit Log
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Tamper-evident, append-only record of all financial approvals, role modifications, and system events.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg font-semibold">
          <Lock className="w-3.5 h-3.5" /> Append-Only Security Active
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-xl bg-[#0B1026] border border-[#1E294B] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#101735] border-b border-[#1E294B] text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Timestamp (UTC)</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Entity</th>
              <th className="py-3 px-4">Audit Reason</th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E294B]">
            {auditEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <ShieldCheck className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold text-slate-300">No system audit records logged yet</p>
                  <p className="text-xs text-slate-500 mt-1">All administrative decisions, status transitions, and financial approvals will be cryptographically logged here.</p>
                </td>
              </tr>
            ) : (
              auditEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#101735]/50">
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{evt.timestamp}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{evt.actorName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#101735] text-[#5B8EE2] border border-[#1E294B]">
                      {evt.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sky-400 font-mono text-[11px]">{evt.entityType}:{evt.entityId.slice(0, 10)}...</td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{evt.reason}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="px-2.5 py-1 rounded bg-[#101735] hover:bg-[#1E294B] text-slate-200 border border-[#1E294B] text-xs font-semibold"
                    >
                      View Diff
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Diff Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1026] border border-[#1E294B] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#5B8EE2]" /> Audit Event State Snapshot
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <p><strong>Actor:</strong> {selectedEvent.actorName} ({selectedEvent.ipAddress})</p>
              <p><strong>Action:</strong> <span className="text-[#5B8EE2] font-bold">{selectedEvent.action}</span></p>
              <p><strong>Reason:</strong> {selectedEvent.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
              <div className="p-3 rounded bg-[#101735] border border-[#1E294B]">
                <span className="text-slate-400 block mb-1">Before State:</span>
                <pre className="text-rose-400 overflow-x-auto">{JSON.stringify(selectedEvent.beforeState, null, 2)}</pre>
              </div>
              <div className="p-3 rounded bg-[#101735] border border-[#1E294B]">
                <span className="text-slate-400 block mb-1">After State:</span>
                <pre className="text-emerald-400 overflow-x-auto">{JSON.stringify(selectedEvent.afterState, null, 2)}</pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 rounded-lg bg-[#5B8EE2] text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
