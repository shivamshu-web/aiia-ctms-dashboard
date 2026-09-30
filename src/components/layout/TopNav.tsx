'use client';

import React from 'react';
import { Search, Bell, Sun, Moon } from 'lucide-react';

interface TopNavProps {
  darkMode?: boolean;
  setDarkMode?: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export default function TopNav({ darkMode = false, setDarkMode }: TopNavProps) {
  return (
    <header className={`h-14 border-b px-5 flex items-center justify-between select-none shadow-sm transition-colors duration-200 z-10 ${
      darkMode ? 'bg-[#09090b] border-zinc-800 text-zinc-100' : 'bg-white border-slate-200/90 text-slate-800'
    }`}>
      {/* Left: System Title & Sub-tagline */}
      <div className="flex flex-col">
        <h1 className={`text-sm font-bold tracking-tight leading-tight ${
          darkMode ? 'text-white' : 'text-slate-900 font-extrabold'
        }`}>
          Clinical Trials Management System
        </h1>
        <p className={`text-[10px] font-medium ${
          darkMode ? 'text-zinc-400' : 'text-emerald-700 font-semibold'
        }`}>
          Evidence • Safety • Ayurveda • Global Impact
        </p>
      </div>

      {/* Center: Search Bar with visible contrast */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search studies, patients, sites, or reports (Ctrl + K)"
            className={`w-full border rounded-lg pl-8 pr-14 py-1.5 text-xs focus:outline-none transition shadow-inner ${
              darkMode
                ? 'bg-[#18181b] border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500'
                : 'bg-slate-100 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:bg-white'
            }`}
          />
          <kbd className={`absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono rounded shadow-xs ${
            darkMode ? 'text-zinc-400 bg-zinc-800 border border-zinc-700' : 'text-slate-600 bg-white border border-slate-300'
          }`}>
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right: Theme Toggle, Notifications & Doctor Profile Info */}
      <div className="flex items-center gap-3">
        {setDarkMode && (
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Toggle theme"
            className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs ${
              darkMode
                ? 'bg-zinc-800 text-amber-400 hover:bg-zinc-700 border border-zinc-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="text-[11px] hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        )}

        {/* Notifications */}
        <button
          type="button"
          aria-label="View notifications"
          className={`relative p-2 rounded-lg transition cursor-pointer border ${
            darkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800 border-zinc-700' : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-300'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Doctor Profile Info with Photo Avatar */}
        <div className={`flex items-center gap-2.5 pl-3 border-l ${
          darkMode ? 'border-zinc-800' : 'border-slate-300'
        }`}>
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-600 shadow-sm flex-shrink-0 bg-slate-200">
            <img
              src="/doctor.jpg"
              alt="Dr. Aanchal Singh"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="text-right">
            <div className={`text-xs font-bold leading-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Dr. Aanchal Singh
            </div>
            <div className={`text-[10px] font-bold ${
              darkMode ? 'text-emerald-400' : 'text-emerald-700'
            }`}>
              Principal Investigator
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
