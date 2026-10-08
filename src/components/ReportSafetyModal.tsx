'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  studies: { studyCode: string; title: string }[];
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReportSafetyModal({ isOpen, studies, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    studyCode: studies[0]?.studyCode || 'AIIA-CT-001',
    patientId: '',
    suspectedHerb: '',
    adverseEvent: '',
    severity: 'Mild',
    causality: 'Probable (WHO-UMC)'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/safety-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to persist safety report to Neon DB');
      }
    } catch (err: any) {
      setErrorMsg('Network error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-[#111c2e] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Report Adverse Reaction (ADR / SAE)</h3>
              <p className="text-[10px] text-slate-400">PvPI & WHO-UMC Causality Direct Ingestion</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Clinical Protocol ID</label>
            <select
              value={formData.studyCode}
              onChange={(e) => setFormData({ ...formData, studyCode: e.target.value })}
              className="w-full bg-[#18273d] border border-slate-700 rounded-lg p-2 text-white outline-none cursor-pointer"
            >
              {(studies.length > 0 ? studies : [
                { studyCode: 'AIIA-CT-001', title: 'Nishamalaki Diabetes Trial' },
                { studyCode: 'AIIA-CT-002', title: 'Rasayana Oncology Adjuvant' },
                { studyCode: 'AIIA-CT-003', title: 'Ashwagandha Fatigue Trial' },
                { studyCode: 'AIIA-CT-004', title: 'Haridra & Guggulu Trial' },
                { studyCode: 'AIIA-CT-005', title: 'Guduchi Formulations Trial' }
              ]).map((s) => (
                <option key={s.studyCode} value={s.studyCode}>{s.studyCode} - {s.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Subject ID (eCRF)</label>
              <input
                type="text"
                required
                placeholder="e.g. SUBJ-AIIA-0105"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full bg-[#18273d] border border-slate-700 rounded-lg p-2 text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Suspected Herb / Formulation</label>
              <input
                type="text"
                required
                placeholder="e.g. Nishamalaki Vati"
                value={formData.suspectedHerb}
                onChange={(e) => setFormData({ ...formData, suspectedHerb: e.target.value })}
                className="w-full bg-[#18273d] border border-slate-700 rounded-lg p-2 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Adverse Reaction Term (Preferred Term)</label>
            <input
              type="text"
              required
              placeholder="e.g. Epigastric Burning Sensation / Urticaria"
              value={formData.adverseEvent}
              onChange={(e) => setFormData({ ...formData, adverseEvent: e.target.value })}
              className="w-full bg-[#18273d] border border-slate-700 rounded-lg p-2 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Event Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-[#18273d] border border-slate-700 rounded-lg p-2 text-white outline-none cursor-pointer"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Serious (SAE)">Serious (SAE)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">WHO-UMC Causality</label>
              <select
                value={formData.causality}
                onChange={(e) => setFormData({ ...formData, causality: e.target.value })}
                className="w-full bg-[#18273d] border border-slate-700 rounded-lg p-2 text-white outline-none cursor-pointer"
              >
                <option value="Certain (WHO-UMC)">Certain (WHO-UMC)</option>
                <option value="Probable (WHO-UMC)">Probable (WHO-UMC)</option>
                <option value="Possible (WHO-UMC)">Possible (WHO-UMC)</option>
                <option value="Unlikely / Unrelated">Unlikely / Unrelated</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 shadow"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>Submit & Persist to Neon DB</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
