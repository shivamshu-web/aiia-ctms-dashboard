'use client';

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, FileText, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadDataModal({ isOpen, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('CDISC_SDTM');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  if (!isOpen) return null;

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus('uploading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
        onClose();
        setStatus('idle');
        setFile(null);
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0a192c] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-[#0d213a]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Upload Clinical Trial Data</h2>
              <p className="text-[10px] text-slate-400">Supports CDISC SDTM, CSV, & HL7 FHIR formats</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Data Standard Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-[#11243a] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="CDISC_SDTM">CDISC SDTM (v3.4 - Tabular)</option>
              <option value="CDISC_ODM">CDISC ODM (v1.3 - XML/Metadata)</option>
              <option value="HL7_FHIR">HL7 FHIR R4 Bundle (JSON)</option>
              <option value="CSV">Custom Patient Electronic CRF (CSV)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Dataset File</label>
            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-4 text-center cursor-pointer transition bg-[#0d213a]/40">
              <input
                type="file"
                accept=".csv,.json,.xml"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer space-y-1 block">
                <FileText className="w-8 h-8 text-cyan-400 mx-auto" />
                <p className="text-slate-200 font-medium">{file ? file.name : 'Click to select CSV / JSON / XML'}</p>
                <p className="text-[10px] text-slate-500">{file ? `${(file.size / 1024).toFixed(1)} KB` : 'Maximum file size: 50MB'}</p>
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || status !== 'idle'}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium flex items-center gap-1.5 disabled:opacity-50"
            >
              {status === 'uploading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              <span>{status === 'uploading' ? 'Parsing & Ingesting...' : status === 'success' ? 'Uploaded!' : 'Upload to Database'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}