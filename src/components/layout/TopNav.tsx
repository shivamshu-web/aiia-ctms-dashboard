'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between select-none shadow-sm z-10">
      {/* Left: System Title & Sub-tagline */}
      <div className="flex flex-col">
        <h1 className="text-sm font-bold text-slate-800 tracking-tight leading-tight">
          Clinical Trials Management System
        </h1>
        <p className="text-[10px] text-slate-500 font-medium">
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
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-14 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-200/60 border border-slate-300 rounded">
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right: Notifications & Doctor Profile Info with Photo */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          aria-label="View notifications"
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Doctor Profile Info with Photo Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-500 shadow-sm flex-shrink-0 bg-slate-100">
            <img
              src="/doctor.jpg"
              alt="Dr. Aanchal Singh"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              Dr. Aanchal Singh
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold">
              Principal Investigator
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
