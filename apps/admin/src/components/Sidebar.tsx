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
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0 shadow-sm z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-wider text-slate-900">LUMORA</span>
            <span className="text-xs bg-[#4F75FF] text-white px-1.5 py-0.5 rounded font-bold">+</span>
            <span className="font-extrabold text-lg tracking-wider text-[#4F75FF]">CYPHER SWIFT</span>
          </div>
          <p className="text-[11px] text-slate-500 font-bold tracking-widest uppercase mt-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#4F75FF]" /> Admin Web Console
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 bg-white">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all ${
                isActive
                  ? 'bg-blue-50 text-[#4F75FF] font-bold border-l-4 border-[#4F75FF] pl-2.5 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4F75FF]' : 'text-slate-400'}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Status */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-600">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium">API Connection</span>
          <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> Port 4000
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">v2.0 — Enterprise Governance Console</p>
      </div>
    </aside>
  );
}
