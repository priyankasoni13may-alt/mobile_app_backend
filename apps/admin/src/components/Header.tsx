'use client';

import React from 'react';
import { Bell, Search, Shield, User } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-[#1E294B] bg-[#0B1026]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <div className="relative w-96">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Global search: leads, partners, deals, audit events..."
          className="w-full bg-[#101735] border border-[#1E294B] rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#5B8EE2] transition-colors"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Role Switcher / Demo Role Indicator */}
        <div className="flex items-center gap-2 bg-[#101735] border border-[#1E294B] px-3 py-1.5 rounded-lg text-xs">
          <Shield className="w-3.5 h-3.5 text-[#5B8EE2]" />
          <span className="text-slate-300 font-medium">Role:</span>
          <span className="text-white font-bold bg-[#5B8EE2]/20 text-[#5B8EE2] px-2 py-0.5 rounded text-[11px]">
            SUPER_ADMIN / FINANCE
          </span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg bg-[#101735] border border-[#1E294B] text-slate-300 hover:text-white hover:border-[#5B8EE2] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#5B8EE2]"></span>
        </button>

        {/* User Avatar & Name */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#1E294B]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5B8EE2] to-[#003566] flex items-center justify-center font-bold text-xs text-white shadow-md">
            AD
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-white">Administrator</p>
            <p className="text-[10px] text-slate-400">admin@cypherswift.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
