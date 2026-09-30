'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';

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

export default function AddPatientModal({ isOpen, studies, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fallback list if database fetch is empty
  const activeStudies = studies.length > 0 ? studies : [
    { studyCode: 'AIIA-CT-001', title: 'Diabetes Care Study' },
    { studyCode: 'AIIA-CT-002', title: 'Oncology Biomarker Study' },
    { studyCode: 'AIIA-CT-003', title: 'Cardiovascular Risk Study' },
  ];

  const [formData, setFormData] = useState({
    subjectId: '',
    studyCode: '',
    siteName: 'AIIA New Delhi Site',
    gender: 'Male',
    age: 35,
  });

  // Automatically select the first study code as soon as modal opens or studies load
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

    // Ensure studyCode is selected
    const selectedCode = formData.studyCode || activeStudies[0]?.studyCode;

    if (!formData.subjectId.trim() || !selectedCode) {
      setErrorMsg('Subject ID and Study Code are required');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          studyCode: selectedCode,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to enroll patient');
      }

      // Success
      setFormData({
        subjectId: '',
        studyCode: activeStudies[0]?.studyCode || '',
        siteName: 'AIIA New Delhi Site',
        gender: 'Male',
        age: 35,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Network request failed');
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
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Enroll New Patient</h2>
              <p className="text-[10px] text-slate-400">Link patient profile to active clinical study</p>
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

        {/* Inline Error banner */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Subject / Patient ID <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ROHIT-AIIA-0014"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Assign Clinical Study <span className="text-rose-400">*</span>
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
              <label className="block text-slate-300 font-semibold mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Age</label>
              <input
                type="number"
                min={1}
                max={120}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Clinical Trial Site</label>
            <input
              type="text"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 transition"
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center gap-1.5 transition disabled:opacity-50 shadow-md"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Enrolling...' : 'Enroll Patient'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}