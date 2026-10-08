'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import {
  Plus,
  UserPlus,
  AlertTriangle,
  FileSpreadsheet,
  Upload,
  CheckCircle,
  RotateCcw,
  GraduationCap,
  ChevronRight,
  Info,
  X,
  FileText
} from 'lucide-react';

import CreateStudyModal from '@/components/CreateStudyModal';
import AddPatientModal from '@/components/AddPatientModal';
import ReportSafetyModal from '@/components/ReportSafetyModal';
import ModuleViews from '@/components/ModuleViews';
import UploadDataModal from '@/components/UploadDataModal';
import DataQualityModal from '@/components/DataQualityModal';
import PVDashboardModal from '@/components/PVDashboardModal';

export default function FullDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

  // Active Doctor/User Profile State
  const [currentUser, setCurrentUser] = useState<any>({
    fullName: 'Rajesh K. Meena',
    roleTitle: 'Regulatory Inspector (CDSCO)',
    degrees: 'M.Pharm (Regulatory Affairs)',
    specialization: 'NDCT Rules 2019, GCP-ASU Inspections & 21 CFR Part 11',
    department: 'Central Drugs Standard Control Organisation (CDSCO), North Zone',
    councilRegNo: 'CDSCO/GOI/AUD-9022',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=250&auto=format&fit=crop&q=80'
  });

  // Chart Interactive States
  const [activeEnrolmentLegend, setActiveEnrolmentLegend] = useState<'all' | 'enrolled' | 'screened'>('all');
  const [hoveredBar, setHoveredBar] = useState<any | null>(null);
  const [selectedMonthModal, setSelectedMonthModal] = useState<any | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null);
  const [safetyTabMode, setSafetyTabMode] = useState<'ADR' | 'SAE'>('ADR');
  const [hoveredSafetyCategory, setHoveredSafetyCategory] = useState<string | null>(null);
  const [viewingProtocol, setViewingProtocol] = useState<any | null>(null);

  // Auth Guard
  useEffect(() => {
    const authUser = localStorage.getItem('aiia_auth_user');
    if (!authUser) {
      router.push('/login');
    } else {
      try {
        const parsed = JSON.parse(authUser);
        if (parsed.fullName) setCurrentUser(parsed);
      } catch (err) {
        console.error(err);
      }
    }
  }, [router]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('aiia-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setCurrentDateTime(new Date());
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleToggleDarkMode = (val: boolean | ((prev: boolean) => boolean)) => {
    setDarkMode((prev) => {
      const nextVal = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('aiia-theme', nextVal ? 'dark' : 'light');
      if (nextVal) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return nextVal;
    });
  };

  const formattedDate = currentDateTime
    ? currentDateTime.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Wed, 7 Oct 2026';

  const formattedTime = currentDateTime
    ? currentDateTime.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }) + ' IST'
    : '20:14:06 IST';

  // Modals
  const [isCreateStudyOpen, setIsCreateStudyOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isReportSafetyOpen, setIsReportSafetyOpen] = useState(false);
  const [isUploadDataOpen, setIsUploadDataOpen] = useState(false);
  const [isDataQualityOpen, setIsDataQualityOpen] = useState(false);
  const [isPVOpen, setIsPVOpen] = useState(false);

  const refreshData = () => {
    setLoading(true);
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleGenerateReport = () => {
    window.open('/api/export-report', '_blank');
  };

  const getProfileAvatarSrc = () => {
    if (currentUser?.avatarUrl) return currentUser.avatarUrl;
    if (currentUser?.fullName?.includes('Ananya')) {
      return 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=250&auto=format&fit=crop&q=80';
    }
    if (currentUser?.fullName?.includes('Pooja')) {
      return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80';
    }
    if (currentUser?.fullName?.includes('Raman')) {
      return 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=250&auto=format&fit=crop&q=80';
    }
    if (currentUser?.fullName?.includes('Meena')) {
      return 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=250&auto=format&fit=crop&q=80';
    }
    return '/doctor.jpg';
  };

  // Trend Chart Data (Interactive & Dynamic)
  const enrolmentTrendData = [
    { m: 'Apr 2026', e: 35, s: 48, target: 50, enrolledCount: 142, screenedCount: 195 },
    { m: 'May 2026', e: 55, s: 68, target: 70, enrolledCount: 228, screenedCount: 310 },
    { m: 'Jun 2026', e: 70, s: 80, target: 85, enrolledCount: 485, screenedCount: 560 },
    { m: 'Jul 2026', e: 85, s: 92, target: 95, enrolledCount: 690, screenedCount: 780 },
    { m: 'Aug 2026', e: 94, s: 100, target: 100, enrolledCount: 840, screenedCount: 920 },
    { m: 'Sep 2026', e: 105, s: 112, target: 110, enrolledCount: 985, screenedCount: 1085 },
  ];

  // Safety breakdown depending on ADR / SAE selection
  const currentSafetyStats = safetyTabMode === 'ADR' 
    ? { mild: 4, moderate: 2, serious: 1, pending: 1, total: 8 }
    : { mild: 0, moderate: 1, serious: 2, pending: 0, total: 3 };

  // Filter clinical studies if a status donut wedge is clicked
  const activeStudiesList = (data?.studies || []).filter((s: any) => {
    if (!selectedStatusFilter) return true;
    return (s.status || '').toLowerCase() === selectedStatusFilter.toLowerCase();
  });

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-300 ${
      darkMode ? 'bg-[#0a0f18] text-slate-100' : 'bg-[#eef2f6] text-slate-800'
    }`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />

      <div className={`flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-colors duration-300 ${
        darkMode ? 'bg-[#0a0f18]' : 'bg-[#eef2f6]'
      }`}>
        <TopNav darkMode={darkMode} setDarkMode={handleToggleDarkMode} />

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab !== 'dashboard' ? (
            <ModuleViews
              tab={activeTab}
              onBack={() => setActiveTab('dashboard')}
              studies={data?.studies || []}
              onOpenCreateStudy={() => setIsCreateStudyOpen(true)}
              onOpenAddPatient={() => setIsAddPatientOpen(true)}
              onOpenReportSafety={() => setIsReportSafetyOpen(true)}
            />
          ) : (
            <>
              {/* Doctor Welcome Banner */}
              <div className={`rounded-xl p-4 flex justify-between items-center shadow-lg transition-all duration-300 border ${
                darkMode
                  ? 'bg-gradient-to-r from-[#111e33] via-[#132c45] to-[#0d1c2c] border-cyan-500/30 text-white shadow-cyan-950/40'
                  : 'bg-gradient-to-r from-[#044e39] via-[#056349] to-[#0f766e] border-emerald-600/30 text-white shadow-emerald-950/20'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-14 h-14 rounded-full overflow-hidden border-2 shadow-md flex-shrink-0 bg-slate-800 flex items-center justify-center ${
                    darkMode ? 'border-cyan-400 shadow-cyan-500/40' : 'border-emerald-300'
                  }`}>
                    <img
                      src={getProfileAvatarSrc()}
                      alt={currentUser?.fullName || 'Clinical Investigator'}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-base font-extrabold text-white tracking-tight">Welcome, {currentUser?.fullName}</h1>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        darkMode ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-emerald-400/20 text-emerald-200'
                      }`}>
                        {currentUser?.roleTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-xs font-semibold text-emerald-200">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-300 shrink-0"/>
                      <span>{currentUser?.degrees || 'BAMS, MD (Ayurveda)'}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-cyan-300 text-[11px] font-mono">Reg: {currentUser?.councilRegNo || 'AYUSH-COUNCIL-VERIFIED'}</span>
                    </div>

                    <p className={`text-[10px] mt-0.5 font-medium ${darkMode ? 'text-slate-300' : 'text-emerald-100'}`}>
                      {currentUser?.department || 'All India Institute of Ayurveda (AIIA)'}
                    </p>
                    <p className={`text-[10px] font-bold ${darkMode ? 'text-cyan-400' : 'text-emerald-200'}`}>
                      Specialization: {currentUser?.specialization || 'Clinical Research & Pharmacovigilance'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className={`text-right border-r pr-6 ${darkMode ? 'border-slate-700/80 text-slate-300' : 'border-emerald-500/50 text-emerald-100'}`}>
                    <div className="text-[11px] font-bold tracking-wide">
                      {formattedDate}
                    </div>
                    <div className={`text-sm font-black font-mono tracking-wider ${darkMode ? 'text-cyan-300' : 'text-white'}`}>
                      {formattedTime}
                    </div>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="text-xs font-bold text-amber-300 drop-shadow-sm">Traditional Wisdom</div>
                    <div className={`text-xs font-bold drop-shadow-sm ${darkMode ? 'text-cyan-300' : 'text-emerald-200'}`}>Scientific Validation</div>
                    <div className="text-xs font-bold text-white drop-shadow-sm">Global Impact</div>
                  </div>
                </div>
              </div>

              {/* 12-Col Dashboard Grid */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-9 space-y-4">
                  {/* KPI Metrics */}
                  <div className="grid grid-cols-6 gap-2.5">
                    <MetricCard title="Total Studies" value={data?.metrics?.totalStudies ?? '5'} sub="↑ 2 new this month" dotColor="bg-blue-400" valueColor={darkMode ? "text-blue-400" : "text-slate-900"} accent="border-t-blue-500" darkMode={darkMode} />
                    <MetricCard title="Active Patients" value={data?.metrics?.activePatients ?? '985'} sub="↑ 12% this month" dotColor="bg-emerald-400" valueColor={darkMode ? "text-emerald-400" : "text-slate-900"} accent="border-t-emerald-500" darkMode={darkMode} />
                    <MetricCard title="Safety Reports" value={data?.metrics?.safetyReportsCount ?? '8'} sub="↑ 3 new this week" dotColor="bg-purple-400" valueColor={darkMode ? "text-purple-400" : "text-slate-900"} accent="border-t-purple-500" darkMode={darkMode} onClick={() => setIsPVOpen(true)} />
                    <MetricCard title="Enrolment Rate" value={data?.metrics?.enrolmentProgress ?? '68%'} sub="View Details →" dotColor="bg-amber-400" valueColor={darkMode ? "text-amber-400" : "text-slate-900"} accent="border-t-amber-500" darkMode={darkMode} />
                    <MetricCard title="Data Quality" value={data?.metrics?.dataQuality ?? '96%'} sub="↑ 2% this month" dotColor="bg-teal-400" valueColor={darkMode ? "text-teal-400" : "text-slate-900"} accent="border-t-teal-500" darkMode={darkMode} onClick={() => setIsDataQualityOpen(true)} />
                    <MetricCard title="Milestones" value={data?.metrics?.upcomingMilestones ?? '5'} sub="View All →" dotColor="bg-rose-400" valueColor={darkMode ? "text-rose-400" : "text-slate-900"} accent="border-t-rose-500" darkMode={darkMode} />
                  </div>

                  {/* CHARTS ROW (Interactive & Working) */}
                  <div className="grid grid-cols-12 gap-4">
                    {/* CHART 1: Study Enrolment Trend (Advanced with Flat Aligned Labels) */}
                    <div className={`col-span-7 border rounded-xl p-3.5 shadow-md transition-colors duration-300 flex flex-col justify-between ${
                      darkMode ? 'bg-[#111c2e] border-slate-800' : 'bg-white border-slate-200/90'
                    }`}>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className={`text-xs font-bold tracking-wide ${darkMode ? 'text-slate-100 font-extrabold' : 'text-slate-900 font-extrabold'}`}>
                              Study Enrolment Trend
                            </span>
                            <span className="text-[10px] text-slate-400 block">Click any month to inspect cohort details</span>
                          </div>

                          {/* Interactive Filter Toggles */}
                          <div className="flex items-center gap-2 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setActiveEnrolmentLegend(activeEnrolmentLegend === 'enrolled' ? 'all' : 'enrolled')}
                              className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded cursor-pointer transition ${
                                activeEnrolmentLegend === 'enrolled'
                                  ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                                  : darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>Enrolled
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveEnrolmentLegend(activeEnrolmentLegend === 'screened' ? 'all' : 'screened')}
                              className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded cursor-pointer transition ${
                                activeEnrolmentLegend === 'screened'
                                  ? 'bg-purple-500/20 border border-purple-500 text-purple-400'
                                  : darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <span className="w-2 h-2 rounded-full bg-purple-500"></span>Screened
                            </button>
                            <span className={`flex items-center gap-1 font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>Target (100%)
                            </span>
                          </div>
                        </div>

                        {/* Interactive Tooltip Area */}
                        {hoveredBar && (
                          <div className="bg-[#18273d] p-1.5 px-3 rounded-lg border border-slate-700 text-[10px] flex items-center justify-between text-slate-200 animate-fadeIn mb-1">
                            <span className="font-bold text-cyan-300">{hoveredBar.m}:</span>
                            <span>Enrolled: <strong className="text-blue-400">{hoveredBar.enrolledCount}</strong> ({hoveredBar.e}%)</span>
                            <span>Screened: <strong className="text-purple-400">{hoveredBar.screenedCount}</strong> ({hoveredBar.s}%)</span>
                            <span className="text-emerald-400 font-semibold">Target: {hoveredBar.target}%</span>
                          </div>
                        )}
                      </div>

                      {/* Perfectly Flat Aligned Baseline Bars */}
                      <div className={`h-44 flex items-end justify-between gap-2.5 px-3 pt-4 border-b relative select-none ${
                        darkMode ? 'border-slate-800' : 'border-slate-200'
                      }`}>
                        {enrolmentTrendData.map((bar, i) => (
                          <div
                            key={i}
                            onClick={() => setSelectedMonthModal(bar)}
                            onMouseEnter={() => setHoveredBar(bar)}
                            onMouseLeave={() => setHoveredBar(null)}
                            className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer group"
                            title={`Click for ${bar.m} breakdown`}
                          >
                            <div className="w-full flex items-end justify-center gap-1.5 h-32 group-hover:scale-105 transition-transform duration-200">
                              {(activeEnrolmentLegend === 'all' || activeEnrolmentLegend === 'enrolled') && (
                                <div
                                  className="w-3.5 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t shadow-sm group-hover:brightness-125 transition-all"
                                  style={{ height: `${Math.min(bar.e, 100)}%` }}
                                ></div>
                              )}
                              {(activeEnrolmentLegend === 'all' || activeEnrolmentLegend === 'screened') && (
                                <div
                                  className="w-3.5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t shadow-sm group-hover:brightness-125 transition-all"
                                  style={{ height: `${Math.min(bar.s, 100)}%` }}
                                ></div>
                              )}
                            </div>
                            <div className="h-6 flex items-center justify-center mt-1">
                              <span className={`text-[9px] whitespace-nowrap font-bold transition-colors ${
                                hoveredBar?.m === bar.m 
                                  ? 'text-cyan-400' 
                                  : darkMode ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600 group-hover:text-slate-900'
                              }`}>
                                {bar.m}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CHART 2: Study Status Breakdown (Interactive Donut & Filter Engine) */}
                    <div className={`col-span-5 border rounded-xl p-3.5 flex flex-col justify-between shadow-md transition-colors duration-300 ${
                      darkMode ? 'bg-[#111c2e] border-slate-800' : 'bg-white border-slate-200/90'
                    }`}>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-xs font-bold tracking-wide ${darkMode ? 'text-slate-100 font-extrabold' : 'text-slate-900 font-extrabold'}`}>
                            Study Status Breakdown
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStatusFilter(null);
                              refreshData();
                            }}
                            title="Reset Filter & Refresh"
                            className="text-slate-400 hover:text-cyan-400 transition"
                          >
                            <RotateCcw className={`w-3.5 h-3.5 cursor-pointer ${loading ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 block mb-2">Click status to filter protocols table</span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        {/* Dynamic Donut Graphic */}
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <div className="w-28 h-28 rounded-full border-[12px] border-emerald-500 border-t-blue-500 border-r-amber-500 border-b-purple-500 shadow-md hover:scale-105 transition-transform duration-300"></div>
                          <div className="absolute text-center select-none">
                            <span className={`text-xl font-black leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              {selectedStatusFilter ? activeStudiesList.length : (data?.metrics?.totalStudies ?? '5')}
                            </span>
                            <p className={`text-[9px] font-bold ${selectedStatusFilter ? 'text-cyan-400' : darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              {selectedStatusFilter ? selectedStatusFilter : 'Total Studies'}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Status Selectors */}
                        <div className="text-[11px] space-y-1.5 font-semibold">
                          {[
                            { name: 'Planning', count: 1, color: 'text-blue-400', dot: 'bg-blue-500' },
                            { name: 'Ongoing', count: 3, color: 'text-emerald-400', dot: 'bg-emerald-500' },
                            { name: 'On Hold', count: 1, color: 'text-amber-400', dot: 'bg-amber-500' },
                            { name: 'Completed', count: 0, color: 'text-purple-400', dot: 'bg-purple-500' }
                          ].map((item) => (
                            <div
                              key={item.name}
                              onClick={() => setSelectedStatusFilter(selectedStatusFilter === item.name ? null : item.name)}
                              className={`flex items-center justify-between gap-4 px-2 py-0.5 rounded cursor-pointer transition select-none ${
                                selectedStatusFilter === item.name
                                  ? 'bg-[#18273d] ring-1 ring-cyan-400 text-white font-bold'
                                  : 'hover:bg-slate-800/40'
                              }`}
                            >
                              <span className={`flex items-center gap-1.5 ${item.color}`}>
                                <span className={`w-2 h-2 rounded-full ${item.dot}`}></span>
                                {item.name}
                              </span>
                              <span>{item.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedStatusFilter && (
                        <div className="flex justify-between items-center text-[10px] bg-cyan-950/40 border border-cyan-800/50 p-1.5 rounded mt-2">
                          <span className="text-cyan-300">Showing only <strong>{selectedStatusFilter}</strong></span>
                          <button onClick={() => setSelectedStatusFilter(null)} className="text-slate-400 hover:text-white font-bold">Clear</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTIVE STUDIES TABLE (Filtered Automatically by Status Donut) */}
                  <div className="grid grid-cols-12 gap-4">
                    <div className={`col-span-8 border rounded-xl p-3.5 shadow-md transition-colors duration-300 ${
                      darkMode ? 'bg-[#111c2e] border-slate-800' : 'bg-white border-slate-200/90'
                    }`}>
                      <div className="flex justify-between items-center mb-2.5">
                        <span className={`text-xs font-bold tracking-wide ${darkMode ? 'text-slate-100 font-extrabold' : 'text-slate-900 font-extrabold'}`}>
                          Active Clinical Studies (Neon DB Synced)
                        </span>
                        <button type="button" onClick={() => setIsCreateStudyOpen(true)} className="text-[10px] text-cyan-400 hover:text-cyan-300 font-extrabold cursor-pointer">
                          + Add Protocol
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px]">
                          <thead className={`uppercase text-[9px] border-b ${
                            darkMode ? 'bg-[#18273d] text-slate-300 font-bold border-slate-700/80' : 'bg-slate-100/80 text-slate-600 font-bold border-slate-200'
                          }`}>
                            <tr>
                              <th className="px-2.5 py-2">Study ID</th>
                              <th className="px-2.5 py-2">Title</th>
                              <th className="px-2.5 py-2">Phase</th>
                              <th className="px-2.5 py-2">Sites</th>
                              <th className="px-2.5 py-2">Enrolment</th>
                              <th className="px-2.5 py-2">Status</th>
                              <th className="px-2.5 py-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${darkMode ? 'divide-slate-800 text-slate-200' : 'divide-slate-200/70 text-slate-800'}`}>
                            {activeStudiesList.map((row: any) => (
                              <tr key={row.studyId} className={darkMode ? 'hover:bg-slate-800/60 transition' : 'hover:bg-slate-50 transition'}>
                                <td className="px-2.5 py-2 font-bold text-cyan-400">{row.studyId}</td>
                                <td className={`px-2.5 py-2 font-semibold max-w-[200px] truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{row.title}</td>
                                <td className="px-2.5 py-2 font-medium">{row.phase}</td>
                                <td className="px-2.5 py-2 text-slate-400 font-medium">{row.sitesCount}</td>
                                <td className="px-2.5 py-2 font-bold text-emerald-400">{`${row.enrolled} / ${row.target}`}</td>
                                <td className="px-2.5 py-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                    row.status === 'Ongoing'
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                      : row.status === 'On Hold'
                                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                      : 'bg-blue-500/10 border-blue-500/30 text-cyan-300'
                                  }`}>
                                    {row.status}
                                  </span>
                                </td>
                                <td className="px-2.5 py-2">
                                  <button
                                    type="button"
                                    onClick={() => setViewingProtocol(row)}
                                    className="px-2.5 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 text-[10px] font-bold transition cursor-pointer"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* CHART 3: Safety Overview (Interactive Toggle & Live ADR/SAE Connection) */}
                    <div className={`col-span-4 border rounded-xl p-3.5 flex flex-col justify-between shadow-md transition-colors duration-300 ${
                      darkMode ? 'bg-[#111c2e] border-slate-800' : 'bg-white border-slate-200/90'
                    }`}>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-xs font-bold tracking-wide ${darkMode ? 'text-slate-100 font-extrabold' : 'text-slate-900 font-extrabold'}`}>
                            Safety Overview
                          </span>
                          {/* Interactive ADR / SAE Tab Switcher */}
                          <div className="flex gap-1 text-[10px] bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                            <button
                              type="button"
                              onClick={() => setSafetyTabMode('ADR')}
                              className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                                safetyTabMode === 'ADR'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              ADR
                            </button>
                            <button
                              type="button"
                              onClick={() => setSafetyTabMode('SAE')}
                              className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                                safetyTabMode === 'SAE'
                                  ? 'bg-rose-600 text-white shadow-sm'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              SAE
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                          <div className="relative w-20 h-20 flex items-center justify-center hover:scale-105 transition-transform duration-200">
                            <div className="w-20 h-20 rounded-full border-[8px] border-emerald-500 border-t-amber-400 border-r-rose-500 shadow-sm"></div>
                            <div className="absolute text-center select-none">
                              <span className={`text-lg font-black leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {currentSafetyStats.total}
                              </span>
                              <p className={`text-[8px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {safetyTabMode}s
                              </p>
                            </div>
                          </div>

                          <div className="text-[10px] space-y-1 font-semibold">
                            {[
                              { label: 'Mild', val: currentSafetyStats.mild, color: 'text-emerald-400', dot: 'bg-emerald-500' },
                              { label: 'Moderate', val: currentSafetyStats.moderate, color: 'text-blue-400', dot: 'bg-blue-500' },
                              { label: 'Serious', val: currentSafetyStats.serious, color: 'text-rose-400', dot: 'bg-rose-500' },
                              { label: 'Pending', val: currentSafetyStats.pending, color: 'text-amber-400', dot: 'bg-amber-500' }
                            ].map((item) => (
                              <div
                                key={item.label}
                                onMouseEnter={() => setHoveredSafetyCategory(item.label)}
                                onMouseLeave={() => setHoveredSafetyCategory(null)}
                                className={`flex items-center justify-between gap-3 px-1.5 py-0.5 rounded cursor-pointer transition ${
                                  hoveredSafetyCategory === item.label ? 'bg-slate-800 text-white' : ''
                                }`}
                              >
                                <span className={`flex items-center gap-1 ${item.color}`}>
                                  <span className={`w-2 h-2 rounded-full ${item.dot}`}></span>
                                  {item.label}
                                </span>
                                <span>{item.val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Direct Connection to ADR / SAE Reporting module */}
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('safety-reporting')}
                          className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer border text-center ${
                            darkMode ? 'bg-[#18273d] hover:bg-[#223652] text-cyan-300 border-slate-700' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs'
                          }`}
                        >
                          Open ADR / SAE Logs →
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsPVOpen(true)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer border text-center ${
                            darkMode ? 'bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-200 border-cyan-800/60' : 'bg-teal-600 hover:bg-teal-500 text-white border-teal-700'
                          }`}
                        >
                          PV Suite
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 3 Cols: Quick Actions & Deadlines */}
                <div className="col-span-3 space-y-4">
                  <div className={`border rounded-xl p-3.5 space-y-2 shadow-md transition-colors duration-300 ${
                    darkMode ? 'bg-[#111c2e] border-slate-800' : 'bg-white border-slate-200/90'
                  }`}>
                    <span className={`text-xs font-bold tracking-wide ${darkMode ? 'text-slate-100 font-extrabold' : 'text-slate-900 font-extrabold'}`}>
                      Quick Actions
                    </span>
                    <div className="space-y-1.5 pt-1">
                      <ActionButton title="Create New Study" icon={Plus} primary onClick={() => setIsCreateStudyOpen(true)} />
                      <ActionButton title="Add Patient" icon={UserPlus} darkMode={darkMode} onClick={() => setIsAddPatientOpen(true)} />
                      <ActionButton title="Report ADR/SAE" icon={AlertTriangle} darkMode={darkMode} onClick={() => setIsReportSafetyOpen(true)} />
                      <ActionButton title="Generate Report" icon={FileSpreadsheet} darkMode={darkMode} onClick={handleGenerateReport} />
                      <ActionButton title="Upload Data" icon={Upload} darkMode={darkMode} onClick={() => setIsUploadDataOpen(true)} />
                      <ActionButton title="Check Data Quality" icon={CheckCircle} darkMode={darkMode} onClick={() => setIsDataQualityOpen(true)} />
                    </div>
                  </div>

                  <div className={`border rounded-xl p-3.5 shadow-md transition-colors duration-300 ${
                    darkMode ? 'bg-[#111c2e] border-slate-800' : 'bg-white border-slate-200/90'
                  }`}>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className={`text-xs font-bold tracking-wide ${darkMode ? 'text-slate-100 font-extrabold' : 'text-slate-900 font-extrabold'}`}>
                        Upcoming Deadlines
                      </span>
                      <span onClick={() => alert('Regulatory deadlines monitored.')} className="text-[10px] text-cyan-400 font-extrabold cursor-pointer">View All →</span>
                    </div>
                    <div className="space-y-2 text-[11px]">
                      <DeadlineItem title="CTRI Update Due" study="Study AIIA-CT-001" date="25 Oct 2026" darkMode={darkMode} />
                      <DeadlineItem title="Ethics Approval Renewal" study="Study AIIA-CT-003" date="28 Oct 2026" darkMode={darkMode} />
                      <DeadlineItem title="Monitoring Visit" study="Site - Chennai" date="30 Oct 2026" darkMode={darkMode} />
                      <DeadlineItem title="SAE Reporting (7 days)" study="Study AIIA-CT-002" date="02 Nov 2026" alert darkMode={darkMode} />
                    </div>
                  </div>

                  <div className={`border rounded-xl p-3.5 shadow-md transition-colors duration-300 ${
                    darkMode ? 'bg-[#111c2e] border-slate-800' : 'bg-white border-slate-200/90'
                  }`}>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className={`text-xs font-bold tracking-wide ${darkMode ? 'text-slate-100 font-extrabold' : 'text-slate-900 font-extrabold'}`}>
                        Recent Activity
                      </span>
                      <span onClick={() => alert('Recent activities.')} className="text-[10px] text-cyan-400 font-extrabold cursor-pointer">View All →</span>
                    </div>
                    <div className="space-y-2.5 text-[10px]">
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>New ADR reported</p>
                        <p className="text-slate-400 font-medium">Study AIIA-CT-002 • 2h ago</p>
                      </div>
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>Site activation completed</p>
                        <p className="text-slate-400 font-medium">Site: Varanasi • 4h ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Monthly Cohort Inspection Popup Modal (Chart Bar Click) */}
      {selectedMonthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#111c2e] border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl text-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">{selectedMonthModal.m} — Cohort Inspection</h3>
              </div>
              <button onClick={() => setSelectedMonthModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2 rounded bg-[#18273d]">
                <span className="text-slate-400">Total Enrolled Subjects:</span>
                <span className="font-bold text-blue-400">{selectedMonthModal.enrolledCount} Patients ({selectedMonthModal.e}%)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#18273d]">
                <span className="text-slate-400">Total Screened Candidates:</span>
                <span className="font-bold text-purple-400">{selectedMonthModal.screenedCount} Candidates ({selectedMonthModal.s}%)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#18273d]">
                <span className="text-slate-400">Target Achievement:</span>
                <span className="font-bold text-emerald-400">{selectedMonthModal.target}% on Schedule</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedMonthModal(null)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Clinical Protocol Inspection Modal (Working View Action) */}
      {viewingProtocol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className={`w-full max-w-xl rounded-2xl border p-5 shadow-2xl space-y-4 ${
            darkMode ? 'bg-[#111c2e] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-800'
          }`}>
            <div className="flex justify-between items-start border-b pb-3 border-slate-700/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                    {viewingProtocol.studyId}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    viewingProtocol.status === 'Ongoing'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : viewingProtocol.status === 'On Hold'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-blue-500/10 border-blue-500/30 text-cyan-300'
                  }`}>
                    {viewingProtocol.status}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold mt-1.5 leading-snug">{viewingProtocol.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingProtocol(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${darkMode ? 'bg-[#18273d] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Clinical Trial Phase</span>
                <span className="font-bold text-cyan-300 text-sm">{viewingProtocol.phase}</span>
              </div>
              <div className={`p-3 rounded-xl border ${darkMode ? 'bg-[#18273d] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Sites Participating</span>
                <span className="font-bold text-white text-sm">{viewingProtocol.sitesCount} Multi-Centric Sites</span>
              </div>
              <div className={`p-3 rounded-xl border ${darkMode ? 'bg-[#18273d] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Enrolled / Target</span>
                <span className="font-bold text-emerald-400 text-sm">{viewingProtocol.enrolled} / {viewingProtocol.target} Patients</span>
              </div>
              <div className={`p-3 rounded-xl border ${darkMode ? 'bg-[#18273d] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">CTRI Registration</span>
                <span className="font-mono font-bold text-amber-300 text-[11px]">{viewingProtocol.ctriNumber || 'CTRI/2025/03/048912'}</span>
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-xs space-y-1 ${darkMode ? 'bg-[#18273d] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Principal Investigator & Sponsor</span>
              <p className="font-bold text-white">Dr. Aanchal Singh (PI) • All India Institute of Ayurveda</p>
              <p className="text-[10px] text-slate-400">Regulatory Oversight: Ministry of Ayush & CDSCO Ethics Committee (21 CFR Part 11 Verified)</p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-700/60">
              <button
                type="button"
                onClick={() => {
                  setViewingProtocol(null);
                  setActiveTab('study-management');
                }}
                className="text-xs text-cyan-400 hover:underline font-bold cursor-pointer"
              >
                Go to Full Study Management Module →
              </button>
              <button
                type="button"
                onClick={() => setViewingProtocol(null)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateStudyModal isOpen={isCreateStudyOpen} onClose={() => setIsCreateStudyOpen(false)} onSuccess={refreshData} />
      <AddPatientModal isOpen={isAddPatientOpen} studies={(data?.studies || []).map((s: any) => ({ studyCode: s.studyId || s.studyCode, title: s.title }))} onClose={() => setIsAddPatientOpen(false)} onSuccess={refreshData} />
      <ReportSafetyModal isOpen={isReportSafetyOpen} studies={(data?.studies || []).map((s: any) => ({ studyCode: s.studyId || s.studyCode, title: s.title }))} onClose={() => setIsReportSafetyOpen(false)} onSuccess={refreshData} />
      <UploadDataModal isOpen={isUploadDataOpen} onClose={() => setIsUploadDataOpen(false)} onSuccess={refreshData} />
      <DataQualityModal isOpen={isDataQualityOpen} onClose={() => setIsDataQualityOpen(false)} />
      <PVDashboardModal isOpen={isPVOpen} safety={data?.safety} onClose={() => setIsPVOpen(false)} />
    </div>
  );
}

function MetricCard({ title, value, sub, dotColor, valueColor, accent, darkMode, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`border border-t-4 rounded-xl p-3 flex flex-col justify-between transition-all duration-200 shadow-md ${accent} ${
        darkMode ? 'bg-[#111c2e] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/90 hover:shadow-lg'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold leading-tight ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{title}</span>
        <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
      </div>
      <div className="my-1">
        <span className={`text-xl font-black tracking-tight ${valueColor}`}>{value}</span>
      </div>
      <span className={`text-[9px] font-bold truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{sub}</span>
    </div>
  );
}

function ActionButton({ title, icon: Icon, primary, darkMode, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer select-none shadow-sm ${
        primary
          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-950/40'
          : darkMode
          ? 'bg-[#18273d] hover:bg-[#223652] text-slate-200 border border-slate-700'
          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300'
      }`}
    >
      <div className="flex items-center gap-2 pointer-events-none">
        <Icon className={`w-3.5 h-3.5 ${primary ? 'text-white' : darkMode ? 'text-cyan-400' : 'text-emerald-700'}`} />
        <span>{title}</span>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    </button>
  );
}

function DeadlineItem({ title, study, date, alert, darkMode }: any) {
  return (
    <div className={`flex justify-between items-center border-b pb-1.5 ${
      darkMode ? 'border-slate-800' : 'border-slate-200'
    }`}>
      <div>
        <p className={`font-bold ${alert ? 'text-rose-400' : darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{title}</p>
        <p className={`text-[10px] font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{study}</p>
      </div>
      <span className={`text-[10px] font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{date}</span>
    </div>
  );
}
