'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Briefcase,
  GraduationCap,
  Layers,
  CheckSquare,
  Banknote,
  Trophy,
  BarChart3,
  ShieldCheck,
  Bell,
  Settings,
  Sparkles
} from 'lucide-react';

const navItems = [
  { name: '1. Overview Dashboard', href: '/', icon: LayoutDashboard },
  { name: '2. Partner Management', href: '/partners', icon: Users },
  { name: '3. Lead Management', href: '/leads', icon: Building2 },
  { name: '4. Meeting Review', href: '/meetings', icon: Calendar },
  { name: '5. Service Catalogue CMS', href: '/services', icon: Briefcase },
  { name: '6. Training & Agreements', href: '/training', icon: GraduationCap },
  { name: '7. Deal & Pipeline Review', href: '/deals', icon: Layers },
  { name: '8. Commission Approval', href: '/commissions', icon: CheckSquare },
  { name: '9. Payout Management', href: '/payouts', icon: Banknote },
  { name: '10. Bonus Evaluation', href: '/bonus', icon: Trophy },
  { name: '11. Reports & Analytics', href: '/reports', icon: BarChart3 },
  { name: '12. Audit Log', href: '/audit', icon: ShieldCheck },
  { name: '13. Notifications', href: '/notifications', icon: Bell },
  { name: '14. System Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-[#0B1026] border-r border-[#1E294B] flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1E294B] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-wider text-white">LUMORA</span>
            <span className="text-xs bg-[#5B8EE2] text-white px-1.5 py-0.5 rounded font-bold">+</span>
            <span className="font-extrabold text-lg tracking-wider text-[#38BDF8]">CYPHER SWIFT</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] tracking-widest uppercase mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#5B8EE2]" /> Admin Web Console
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#5B8EE2]/20 to-transparent text-[#5B8EE2] border-l-4 border-[#5B8EE2] font-semibold pl-2.5'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#101735]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#5B8EE2]' : 'text-[#64748B]'}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Status */}
      <div className="p-4 border-t border-[#1E294B] bg-[#070B19]/50 text-[11px] text-[#94A3B8]">
        <div className="flex items-center justify-between mb-1">
          <span>API Connection</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Port 4000
          </span>
        </div>
        <p className="text-[10px] text-slate-500">v2.0 — Gap-Free Master Build</p>
      </div>
    </aside>
  );
}
