'use client';

import React, { useState } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateStudyModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studyId: 'AIIA-CT-00' + Math.floor(Math.random() * 90 + 10),
    title: '',
    phase: 'Phase II',
    sitesCount: 4,
    target: 200,
    ctriNumber: 'CTRI/2026/09/' + Math.floor(Math.random() * 89999 + 10000),
    therapeuticArea: 'Metabolic & Lifestyle Disorders',
    herbalFormulation: 'Standardized Ayurvedic Formulation'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/clinical-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_study', payload: formData }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        alert(data.error || 'Failed to save to Neon DB');
      }
    } catch (err) {
      console.error(err);
      alert('Error inserting to Neon DB');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-[#111c2e] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-200">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white">Create New Clinical Protocol (Neon SQL Linked)</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mt-4 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">Protocol Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Clinical Trial of Guduchi in Rheumatoid Arthritis"
              className="w-full bg-[#18273d] border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Study ID</label>
              <input
                type="text"
                required
                value={formData.studyId}
                onChange={(e) => setFormData({ ...formData, studyId: e.target.value })}
                className="w-full bg-[#18273d] border border-slate-700 rounded-lg p-2 text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">Clinical Phase</label>
              <select
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                className="w-full bg-[#18273d] border border-slate-700 rounded-lg p-2 text-white outline-none"
              >
                <option value="Phase I">Phase I</option>
                <option value="Phase II">Phase II</option>
                <option value="Phase III">Phase III</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Target Subjects</label>
              <input
                type="number"
                required
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value, 10) })}
                className="w-full bg-[#18273d] border border-slate-700 rounded-lg p-2 text-white outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium block mb-1">CTRI Registry ID</label>
              <input
                type="text"
                required
                value={formData.ctriNumber}
                onChange={(e) => setFormData({ ...formData, ctriNumber: e.target.value })}
                className="w-full bg-[#18273d] border border-slate-700 rounded-lg p-2 text-white outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Ayurvedic Formulation</label>
            <input
              type="text"
              value={formData.herbalFormulation}
              onChange={(e) => setFormData({ ...formData, herbalFormulation: e.target.value })}
              className="w-full bg-[#18273d] border border-slate-700 rounded-lg p-2 text-white outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Save to Neon SQL</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
