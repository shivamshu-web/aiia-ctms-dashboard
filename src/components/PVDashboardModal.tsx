'use client';

import React from 'react';
import { X, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  safety: any;
}

export default function PVDashboardModal({ isOpen, onClose, safety }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0a192c] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-[#0d213a]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Pharmacovigilance (NPvCC) Full Analytics</h2>
              <p className="text-[10px] text-slate-400">National Pharmacovigilance Centre for Ayurveda Monitoring</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-[#11243a] border border-slate-800 rounded-lg text-center">
              <p className="text-slate-400 text-[10px]">Mild ADRs</p>
              <p className="text-lg font-bold text-cyan-400 mt-1">{safety?.mild ?? 4}</p>
            </div>
            <div className="p-3 bg-[#11243a] border border-slate-800 rounded-lg text-center">
              <p className="text-slate-400 text-[10px]">Moderate ADRs</p>
              <p className="text-lg font-bold text-blue-400 mt-1">{safety?.moderate ?? 2}</p>
            </div>
            <div className="p-3 bg-[#11243a] border border-slate-800 rounded-lg text-center">
              <p className="text-slate-400 text-[10px]">Serious Adverse (SAE)</p>
              <p className="text-lg font-bold text-rose-400 mt-1">{safety?.serious ?? 1}</p>
            </div>
            <div className="p-3 bg-[#11243a] border border-slate-800 rounded-lg text-center">
              <p className="text-slate-400 text-[10px]">Pending Evaluation</p>
              <p className="text-lg font-bold text-amber-400 mt-1">{safety?.pending ?? 1}</p>
            </div>
          </div>

          <div className="p-3.5 bg-[#11243a] border border-slate-800 rounded-lg space-y-2">
            <span className="font-semibold text-white">Ayurvedic Formulation Causality Matrix (WHO-UMC):</span>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span>Herbo-mineral Herb Interactions Flagged:</span>
                <span className="text-emerald-400 font-semibold">0 Critical Alerts</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span>MedDRA / WHODrug Auto-Coding Accuracy:</span>
                <span className="text-cyan-400 font-semibold">99.1% Synced</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Regulatory 7-Day Expedited SAE Filings:</span>
                <span className="text-emerald-400 font-semibold">All In Window</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium">
              Close Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}