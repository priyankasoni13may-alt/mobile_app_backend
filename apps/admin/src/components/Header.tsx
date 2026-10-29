'use client';

import React from 'react';
import { Bell, Search, Shield, User } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Bar */}
      <div className="relative w-96">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Global search: leads, partners, deals, audit events..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F75FF] focus:bg-white focus:ring-1 focus:ring-[#4F75FF] transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Role Switcher / Demo Role Indicator */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
          <Shield className="w-3.5 h-3.5 text-[#4F75FF]" />
          <span className="text-slate-600 font-medium">Role:</span>
          <span className="bg-blue-50 text-[#4F75FF] border border-blue-200 font-bold px-2 py-0.5 rounded text-[11px]">
            SUPER_ADMIN / FINANCE
          </span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4F75FF]"></span>
        </button>

        {/* User Avatar & Name */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#4F75FF] flex items-center justify-center font-extrabold text-xs text-white shadow-xs">
            AD
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900">Administrator</p>
            <p className="text-[10px] text-slate-500 font-medium">admin@cypherswift.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
