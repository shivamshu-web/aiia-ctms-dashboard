'use client';

import React, { useState } from 'react';
import { X, PlusCircle, Loader2 } from 'lucide-react';

interface CreateStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateStudyModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateStudyModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    studyCode: '',
    title: '',
    phase: 'PHASE_III',
    sitesCount: 1,
    targetPatients: 100,
    status: 'PLANNING',
    ctriNumber: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create study protocol');
      }

      // Reset form and notify parent to refresh dashboard data
      setFormData({
        studyCode: '',
        title: '',
        phase: 'PHASE_III',
        sitesCount: 1,
        targetPatients: 100,
        status: 'PLANNING',
        ctriNumber: '',
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while connecting to the database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0a192c] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-[#0d213a]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Create New Clinical Study</h2>
              <p className="text-[10px] text-slate-400">Register new trial protocol in Neon PostgreSQL</p>
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

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Study Code / ID <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AIIA-CT-006"
              value={formData.studyCode}
              onChange={(e) => setFormData({ ...formData, studyCode: e.target.value })}
              className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Study Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Clinical Evaluation of Haridra in Metabolic Disorders"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Clinical Phase</label>
              <select
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
              >
                <option value="PHASE_I">Phase I</option>
                <option value="PHASE_II">Phase II</option>
                <option value="PHASE_III">Phase III</option>
                <option value="PHASE_IV">Phase IV</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Trial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
              >
                <option value="PLANNING">Planning</option>
                <option value="ONGOING">Ongoing</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Number of Sites</label>
              <input
                type="number"
                min={1}
                value={formData.sitesCount}
                onChange={(e) =>
                  setFormData({ ...formData, sitesCount: parseInt(e.target.value) || 1 })
                }
                className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Patients</label>
              <input
                type="number"
                min={1}
                value={formData.targetPatients}
                onChange={(e) =>
                  setFormData({ ...formData, targetPatients: parseInt(e.target.value) || 1 })
                }
                className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">CTRI Registration Number (Optional)</label>
            <input
              type="text"
              placeholder="e.g. CTRI/2026/09/045812"
              value={formData.ctriNumber}
              onChange={(e) => setFormData({ ...formData, ctriNumber: e.target.value })}
              className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Actions */}
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center gap-1.5 transition disabled:opacity-50 shadow-md"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Registering Study...' : 'Save Study'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}