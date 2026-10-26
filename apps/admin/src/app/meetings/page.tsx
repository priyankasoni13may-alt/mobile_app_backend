'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  MapPin,
  FileCheck2
} from 'lucide-react';

export default function MeetingReviewPage() {
  const [filter, setFilter] = useState('ALL');
  const [meetings, setMeetings] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#5B8EE2]" /> 4. Meeting Review & Qualification
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Monitor sales meeting completion rates, client attendance, and qualification outcomes.
        </p>
      </div>

      {/* Meetings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meetings.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-xl bg-[#0B1026] border border-[#1E294B]">
            <Calendar className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold text-slate-300">No client discovery meetings scheduled</p>
            <p className="text-xs text-slate-500 mt-1">When partners or sales schedule discovery calls, they will appear here with qualification records.</p>
          </div>
        ) : (
          meetings.map((m) => (
          <div key={m.id} className="p-5 rounded-xl bg-[#0B1026] border border-[#1E294B] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#5B8EE2] uppercase tracking-wider">
                  {m.leadCompanyName}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{m.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {m.date} ({m.duration})
                </p>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                m.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'
              }`}>
                {m.status}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#101735] border border-[#1E294B] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Attendance:</span>
                <span className="font-semibold text-white">
                  {m.attendanceConfirmed ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                    </span>
                  ) : (
                    <span className="text-slate-400">Pending Call</span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Qualification Outcome:</span>
                <span className="font-semibold">
                  {m.isQualified === true ? (
                    <span className="text-emerald-400 font-bold">QUALIFIED FIT</span>
                  ) : m.isQualified === false ? (
                    <span className="text-rose-400 font-bold">UNQUALIFIED</span>
                  ) : (
                    <span className="text-slate-400">Awaiting Outcome</span>
                  )}
                </span>
              </div>

              {m.requirementSummary && (
                <div className="pt-2 border-t border-[#1E294B]">
                  <span className="text-slate-400 block text-[11px]">Requirement Summary:</span>
                  <p className="text-slate-200 mt-0.5 italic">"{m.requirementSummary}"</p>
                </div>
              )}

              {m.agreedNextAction && (
                <div className="pt-1">
                  <span className="text-slate-400 block text-[11px]">Agreed Next Action:</span>
                  <p className="text-white font-medium mt-0.5">{m.agreedNextAction}</p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
      </div>
    </div>
  );
}
