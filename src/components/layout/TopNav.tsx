'use client';

import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="h-14 bg-[#0a192c] border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-sm font-bold text-white tracking-wide">
          Clinical Trials Management System
        </h2>
        <p className="text-[10px] text-slate-400 font-medium">
          Evidence • Safety • Ayurveda • Global Impact
        </p>
      </div>

      <div className="flex items-center gap-5">
        {/* Global Search */}
        <div className="relative w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search studies, patients, sites, or report..."
            className="w-full bg-[#11243a] border border-slate-700/70 rounded-full pl-8 pr-14 py-1 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
          <kbd className="absolute right-3 top-1.5 text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            Ctrl + K
          </kbd>
        </div>

        {/* Notification Icon */}
        <button className="relative p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0a192c]"></span>
        </button>

        {/* Doctor Identity */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
          <div className="leading-tight text-left">
            <p className="text-xs font-semibold text-white">Dr. Aanchal Singh</p>
            <p className="text-[10px] text-slate-400">Principal Investigator</p>
          </div>
        </div>
      </div>
    </header>
  );
}