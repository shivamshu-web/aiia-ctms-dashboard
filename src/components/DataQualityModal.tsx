'use client';

import React from 'react';
import { X, CheckCircle, ShieldCheck, Database, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataQualityModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0a192c] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-[#0d213a]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Data Quality & Validation Audit</h2>
              <p className="text-[10px] text-slate-400">GCP-ASU & 21 CFR Part 11 Rule Engine Verification</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="bg-[#102947] border border-cyan-500/30 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Overall Quality Score</span>
              <p className="text-2xl font-bold text-emerald-400">96.4%</p>
            </div>
            <div className="text-right text-[11px] text-slate-300">
              <p className="text-emerald-400 font-semibold">GCP Audit Ready</p>
              <p className="text-slate-400 text-[10px]">Zero Critical Protocol Deviations</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 bg-[#11243a] border border-slate-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <Database className="w-4 h-4 text-blue-400" />
                <span>eCRF Form Completeness</span>
              </div>
              <span className="text-emerald-400 font-semibold">98.2%</span>
            </div>

            <div className="p-2.5 bg-[#11243a] border border-slate-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Investigator Signature Compliance</span>
              </div>
              <span className="text-emerald-400 font-semibold">100%</span>
            </div>

            <div className="p-2.5 bg-[#11243a] border border-slate-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Open Data Queries (Pending PI review)</span>
              </div>
              <span className="text-amber-400 font-semibold">2 Queries</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium">
              Close Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}