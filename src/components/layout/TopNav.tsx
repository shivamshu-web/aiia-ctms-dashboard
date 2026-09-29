'use client';

import { Search, Bell, User } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="h-14 bg-[#0a1829] border-b border-slate-800 px-6 flex items-center justify-between">
      <div>
        <div className="text-xs font-bold text-white tracking-wide">
          Clinical Trials Management System
        </div>
        <div className="text-[10px] text-slate-400">
          Evidence • Safety • Ayurveda • Global Impact
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search studies, patients, sites, or reports..."
            className="w-full bg-[#112338] border border-slate-700/80 rounded-full pl-8 pr-12 py-1 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
          <kbd className="absolute right-2.5 top-1.5 text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            Ctrl + K
          </kbd>
        </div>

        {/* Notification Bell */}
        <button className="relative p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* Doctor Info */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-700/80 flex items-center justify-center text-white border border-slate-600">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left leading-none">
            <div className="text-xs font-semibold text-white">Dr. Meera Sharma</div>
            <div className="text-[10px] text-slate-400 mt-1">Principal Investigator</div>
          </div>
        </div>
      </div>
    </header>
  );
}