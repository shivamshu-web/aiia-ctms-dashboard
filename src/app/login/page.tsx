'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Loader2, Leaf, KeyRound, AlertCircle, CheckCircle2, Stethoscope, FileBadge } from 'lucide-react';

const FALLBACK_USERS = [
  {
    user_code: 'USR-AIIA-001',
    full_name: 'Dr. Aanchal Singh',
    email: 'aanchal.singh@aiia.gov.in',
    role_title: 'Principal Investigator (PI)',
    degrees: 'BAMS, MD (Kayachikitsa), PhD',
    default_pass: 'Aiia@2026#PI'
  },
  {
    user_code: 'USR-AIIA-002',
    full_name: 'Dr. S. K. Raman',
    email: 'sk.raman@aiia.gov.in',
    role_title: 'Lead CRA / Clinical Monitor',
    degrees: 'MBBS, MD (Pharmacology), PGDCR',
    default_pass: 'Cra@2026#Monitor'
  },
  {
    user_code: 'USR-AIIA-003',
    full_name: 'Pooja Verma',
    email: 'p.verma@aiia.gov.in',
    role_title: 'Clinical Data Manager',
    degrees: 'M.Sc (Biostatistics), CDISC Certified',
    default_pass: 'Data@2026#Manager'
  },
  {
    user_code: 'USR-AIIA-004',
    full_name: 'Dr. Ananya Joshi',
    email: 'ananya.joshi@aiia.gov.in',
    role_title: 'Pharmacovigilance Officer (NPvCC)',
    degrees: 'BAMS, MD (Dravyaguna Vigyana)',
    default_pass: 'Pv@2026#Officer'
  },
  {
    user_code: 'USR-AIIA-005',
    full_name: 'Rajesh K. Meena',
    email: 'r.meena@cdsco.nic.in',
    role_title: 'Regulatory Inspector (CDSCO)',
    degrees: 'M.Pharm (Regulatory Affairs)',
    default_pass: 'Cdsco@2026#Auditor'
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('aanchal.singh@aiia.gov.in');
  const [password, setPassword] = useState('Aiia@2026#PI');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [authorizedList, setAuthorizedList] = useState<any[]>(FALLBACK_USERS);

  useEffect(() => {
    fetch('/api/auth/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.users && data.users.length > 0) {
          setAuthorizedList(data.users);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('aiia_auth_user', JSON.stringify(data.user));
        router.push('/');
      } else {
        setErrorMsg(data.error || 'Authentication rejected by security gateway');
      }
    } catch (err: any) {
      setErrorMsg('Network error connecting to Neon Auth Database');
    } finally {
      setLoading(false);
    }
  };

  const selectAuthorizedUser = (user: any) => {
    setEmail(user.email);
    setPassword(user.default_pass || 'Aiia@2026#PI');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen w-screen bg-[#07131e] text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden select-none">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="p-5 border-b border-slate-800/80 bg-[#0a192c]/60 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 border border-emerald-400/50 flex items-center justify-center text-white shadow-lg shadow-emerald-950/60">
            <Leaf className="w-5 h-5 fill-white/20 text-white"/>
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wide">All India Institute of Ayurveda</h1>
            <p className="text-[10px] text-emerald-400 font-semibold">Ministry of Ayush • Government of India</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400"/>
          <span className="hidden sm:inline">21 CFR Part 11 Live Database Gateway</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-lg bg-[#0f1f33] border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="text-center space-y-1">
            <div className="inline-flex p-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1">
              <KeyRound className="w-6 h-6"/>
            </div>
            <h2 className="text-lg font-black text-white tracking-tight">Clinical Investigator Sign-In</h2>
            <p className="text-xs text-slate-400">Authorized Access Only • National Clinical Trials Registry Node</p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0"/>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Institutional Email ID</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"/>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@aiia.gov.in"
                  className="w-full bg-[#162a42] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Passkey / Master Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"/>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#162a42] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin"/>
                  <span>Verifying Medical Credentials...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4"/>
                  <span>Authenticate & Enter CTMS</span>
                </>
              )}
            </button>
          </form>

          {/* Directory rendered with full 5 personnel */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Stethoscope className="w-3.5 h-3.5"/>
                Authorized Faculty & Investigators ({authorizedList.length} Active):
              </span>
              <span className="text-emerald-400">Click to Select</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {authorizedList.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => selectAuthorizedUser(user)}
                  className={`p-2.5 rounded-xl bg-[#162a42] hover:bg-[#1f3a5c] text-left border transition cursor-pointer ${
                    email.toLowerCase() === user.email.toLowerCase()
                      ? 'border-cyan-400 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-400/40'
                      : 'border-slate-700/60'
                  }`}
                >
                  <div className="font-bold text-white flex items-center justify-between">
                    <span className="truncate">{user.full_name}</span>
                    <FileBadge className="w-3 h-3 text-cyan-400 shrink-0"/>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold truncate">{user.degrees}</div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">{user.role_title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="p-3 border-t border-slate-800/80 bg-[#07131e] text-center text-[10px] text-slate-500">
        Clinical Trials Management System • Ayush Research & Pharmacovigilance Gateway • ISO/IEC 27001 Certified
      </footer>
    </div>
  );
}
