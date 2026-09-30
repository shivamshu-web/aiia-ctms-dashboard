'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="h-14 bg-[#050f1a] border-b border-slate-800/80 px-4 flex items-center justify-between select-none">
      {/* Left: System Title & Sub-tagline */}
      <div className="flex flex-col">
        <h1 className="text-sm font-bold text-white tracking-wide leading-tight">
          Clinical Trials Management System
        </h1>
        <p className="text-[10px] text-slate-400">
          Evidence • Safety • Ayurveda • Global Impact
        </p>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search studies, patients, sites, or reports (Ctrl + K)"
            className="w-full bg-[#0a192c] border border-slate-800 rounded-lg pl-8 pr-14 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700 rounded">
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right: Notifications & Doctor Profile Info with Photo */}
      <div className="flex items-center gap-3.5">
        {/* Notification Bell */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#050f1a]"></span>
        </button>

        {/* Doctor Profile Info with Photo Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-400/60 shadow flex-shrink-0 bg-slate-800">
            <img
              src="/doctor.jpg"
              alt="Dr. Aanchal Singh"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-white leading-tight">
              Dr. Aanchal Singh
            </div>
            <div className="text-[10px] text-slate-400">
              Principal Investigator
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}