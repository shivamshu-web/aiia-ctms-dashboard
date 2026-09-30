'use client';

import React, { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  studies: Array<{ studyCode: string; title: string }>;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPatientModal({ isOpen, studies, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: '',
    studyCode: studies[0]?.studyCode || '',
    siteName: 'AIIA New Delhi Site',
    gender: 'Male',
    age: 35,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setFormData({
          subjectId: '',
          studyCode: studies[0]?.studyCode || '',
          siteName: 'AIIA New Delhi Site',
          gender: 'Male',
          age: 35,
        });
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (err) {
      alert('Network request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0a192c] border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-[#0d213a]">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Enroll New Patient</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Subject / Patient ID *</label>
            <input
              type="text"
              required
              placeholder="e.g. SUB-AIIA-0104"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Assign Study *</label>
            <select
              value={formData.studyCode}
              onChange={(e) => setFormData({ ...formData, studyCode: e.target.value })}
              className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              {studies.map((s) => (
                <option key={s.studyCode} value={s.studyCode}>
                  {s.studyCode} - {s.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Age</label>
              <input
                type="number"
                min={1}
                max={120}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Trial Site</label>
            <input
              type="text"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center gap-1.5 transition disabled:opacity-50"
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