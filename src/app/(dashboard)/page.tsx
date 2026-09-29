'use client';

import { useEffect, useState } from 'react';
import MetricCard from '@/components/dashboard/MetricCard';
import ActiveStudiesTable from '@/components/tables/ActiveStudiesTable';
import SafetyChart from '@/components/dashboard/SafetyChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Activity, AlertTriangle, CheckCircle2, Clock, PlusCircle, Sparkles, TrendingUp, UserCheck, Shield } from 'lucide-react';

export default function DashboardPage() {
  const [studies, setStudies] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/studies')
      .then((res) => res.json())
      .then((data) => setStudies(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/30 p-6 rounded-2xl flex items-center justify-between shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Evidence • Safety • Ayurveda • Global Impact</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome, Dr. Meera Sharma</h2>
          <p className="text-xs text-slate-400 mt-1">Clinical Research | Pharmacovigilance | Better Health for All</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/20 transition">
          <PlusCircle className="w-4 h-4" />
          Create New Study
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard title="Total Studies" value={12} tag="+2 this month" icon={Activity} />
        <MetricCard title="Active Patients" value="1,248" tag="↑ 12% growth" icon={UserCheck} />
        <MetricCard title="Safety Reports" value={8} tag="↑ 3 new" icon={AlertTriangle} danger />
        <MetricCard title="Enrolment Progress" value="68%" tag="Target 75%" icon={TrendingUp} />
        <MetricCard title="Data Quality" value="96%" tag="Verified" icon={CheckCircle2} />
        <MetricCard title="Upcoming Milestones" value={5} tag="Action needed" icon={Clock} />
      </div>

      {/* Tables and Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Active Clinical Studies</h3>
              <p className="text-[11px] text-slate-400">Ayush GCP & CDISC Real-time Monitoring</p>
            </div>
            <button className="text-xs text-emerald-400 hover:underline">View All</button>
          </div>
          <ActiveStudiesTable studies={studies.length ? studies : defaultStudies} />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-white">Pharmacovigilance (ADR / SAE)</h3>
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Severity breakdown reported across active trials</p>
            <SafetyChart />
          </div>

          <div className="mt-6 p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl text-[11px] text-rose-300">
            <p className="font-semibold">SAE Mandatory 7-Day Reporting</p>
            <p className="text-slate-400 mt-0.5">1 pending event flagged for Ethics Committee review.</p>
          </div>
        </div>
      </div>

      {/* Compliance Footer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <span className="text-slate-400 font-medium">Compliance Standards:</span>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-slate-800 rounded-lg border border-slate-700 text-emerald-400 font-semibold">CTRI Registered (12/12)</span>
          <span className="px-3 py-1 bg-slate-800 rounded-lg border border-slate-700 text-emerald-400 font-semibold">GCP-ASU Compliant</span>
          <span className="px-3 py-1 bg-slate-800 rounded-lg border border-slate-700 text-cyan-400 font-semibold">HL7 FHIR R4 Ready</span>
          <span className="px-3 py-1 bg-slate-800 rounded-lg border border-slate-700 text-purple-400 font-semibold">CDISC SDTM / ODM</span>
        </div>
      </div>
    </div>
  );
}

const defaultStudies = [
  { id: '1', studyCode: 'AIIA-CT-001', title: 'Diabetes Care Study', phase: 'PHASE_III', sitesCount: 5, enrolledCount: 312, targetPatients: 400, status: 'ONGOING' },
  { id: '2', studyCode: 'AIIA-CT-002', title: 'Oncology Biomarker Study', phase: 'PHASE_II', sitesCount: 4, enrolledCount: 248, targetPatients: 300, status: 'ONGOING' },
  { id: '3', studyCode: 'AIIA-CT-003', title: 'Cardiovascular Risk Study', phase: 'PHASE_II', sitesCount: 6, enrolledCount: 196, targetPatients: 250, status: 'ON_HOLD' },
];
