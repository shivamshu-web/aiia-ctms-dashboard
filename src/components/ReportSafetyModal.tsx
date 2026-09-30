'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface StudyItem {
  studyCode: string;
  title: string;
}

interface Props {
  isOpen: boolean;
  studies: StudyItem[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReportSafetyModal({ isOpen, studies, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const activeStudies = studies.length > 0 ? studies : [
    { studyCode: 'AIIA-CT-001', title: 'Diabetes Care Study' },
    { studyCode: 'AIIA-CT-002', title: 'Oncology Biomarker Study' },
    { studyCode: 'AIIA-CT-003', title: 'Cardiovascular Risk Study' },
  ];

  const [formData, setFormData] = useState({
    studyCode: '',
    type: 'ADR',
    severity: 'MILD',
    description: '',
    reportedBy: 'Dr. Meera Sharma',
  });

  // Automatically select the first available study code
  useEffect(() => {
    if (activeStudies.length > 0 && !formData.studyCode) {
      setFormData((prev) => ({
        ...prev,
        studyCode: activeStudies[0].studyCode,
      }));
    }
  }, [activeStudies, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const targetStudy = formData.studyCode || activeStudies[0]?.studyCode;

    if (!formData.description.trim()) {
      setErrorMsg('Please enter a clinical description of the event.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          studyCode: targetStudy,
        }),
      });

      const contentType = res.headers.get('content-type');
      let data: any = {};
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data.error || `Server returned error (${res.status})`);
      }

      // Success
      setFormData({
        studyCode: activeStudies[0]?.studyCode || '',
        type: 'ADR',
        severity: 'MILD',
        description: '',
        reportedBy: 'Dr. Meera Sharma',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Network error occurred. Please check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0a192c] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-[#0d213a]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Report ADR / SAE (Pharmacovigilance)</h2>
              <p className="text-[10px] text-slate-400">National Pharmacovigilance Centre for Ayurveda</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Related Study <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.studyCode || activeStudies[0]?.studyCode}
              onChange={(e) => setFormData({ ...formData, studyCode: e.target.value })}
              className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
            >
              {activeStudies.map((s) => (
                <option key={s.studyCode} value={s.studyCode}>
                  {s.studyCode} - {s.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Report Category</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
              >
                <option value="ADR">ADR (Adverse Reaction)</option>
                <option value="SAE">SAE (Serious Adverse Event)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Severity Rating</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
              >
                <option value="MILD">Mild</option>
                <option value="MODERATE">Moderate</option>
                <option value="SERIOUS">Serious</option>
                <option value="PENDING">Pending Assessment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Clinical Signs / Event Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe symptoms, batch number, onset timing..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium flex items-center gap-1.5 transition disabled:opacity-50 shadow-md"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Submitting...' : 'File Safety Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}