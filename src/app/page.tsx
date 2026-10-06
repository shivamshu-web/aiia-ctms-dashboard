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
  ChevronRight
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
    fullName: 'Dr. Aanchal Singh',
    roleTitle: 'Principal Investigator (PI)',
    degrees: 'BAMS, MD (Kayachikitsa), PhD',
    specialization: 'Endocrinology, Metabolic Disorders & Clinical Rasayana',
    department: 'Department of Clinical Research & Kayachikitsa, AIIA',
    councilRegNo: 'DBCP/2018/AY-48912',
    avatarUrl: '/doctor.jpg'
  });

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
    : 'Thu, 1 Oct 2026';

  const formattedTime = currentDateTime
    ? currentDateTime.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }) + ' IST'
    : '00:00:00 IST';

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
                  <div className={`w-14 h-14 rounded-full overflow-hidden border-2 shadow-md flex-shrink-0 ${
                    darkMode ? 'border-cyan-400 shadow-cyan-500/40 bg-slate-900' : 'border-emerald-300 bg-emerald-950'
                  }`}>
                    <img
                      src={currentUser.avatarUrl || '/doctor.jpg'}
                      alt={currentUser.fullName}
                      className="w-full h-full object-cover object-top"
                      onError={(e: any) => { e.target.src = '/doctor.jpg'; }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-base font-extrabold text-white tracking-tight">Welcome, {currentUser.fullName}</h1>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        darkMode ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-emerald-400/20 text-emerald-200'
                      }`}>
                        {currentUser.roleTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-xs font-semibold text-emerald-200">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-300 shrink-0"/>
                      <span>{currentUser.degrees || 'BAMS, MD (Ayurveda)'}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-cyan-300 text-[11px] font-mono">Reg: {currentUser.councilRegNo || 'AYUSH-COUNCIL-VERIFIED'}</span>
                    </div>

                    <p className={`text-[10px] mt-0.5 font-medium ${darkMode ? 'text-slate-300' : 'text-emerald-100'}`}>
                      {currentUser.department || 'All India Institute of Ayurveda (AIIA)'}
                    </p>
                    <p className={`text-[10px] font-bold ${darkMode ? 'text-cyan-400' : 'text-emerald-200'}`}>
                      Specialization: {currentUser.specialization || 'Clinical Research & Pharmacovigilance'}
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
                  <div className="grid grid-cols-6 gap-2.5">
                    <MetricCard title="Total Studies" value={data?.metrics?.totalStudies ?? '5'} sub="↑ 2 new this month" dotColor="bg-blue-400" valueColor={darkMode ? "text-blue-400" : "text-slate-900"} accent="border-t-blue-500" darkMode={darkMode} />
                    <MetricCard title="Active Patients" value={data?.metrics?.activePatients ?? '985'} sub="↑ 12% this month" dotColor="bg-emerald-400" valueColor={darkMode ? "text-emerald-400" : "text-slate-900"} accent="border-t-emerald-500" darkMode={darkMode} />
                    <MetricCard title="Safety Reports" value={data?.metrics?.safetyReportsCount ?? '8'} sub="↑ 3 new this week" dotColor="bg-purple-400" valueColor={darkMode ? "text-purple-400" : "text-slate-900"} accent="border-t-purple-500" darkMode={darkMode} onClick={() => setIsPVOpen(true)} />
                    <MetricCard title="Enrolment Rate" value={data?.metrics?.enrolmentProgress ?? '68%'} sub="View Details →" dotColor="bg-amber-400" valueColor={darkMode ? "text-amber-400" : "text-slate-900"} accent="border-t-amber-500" darkMode={darkMode} />
                    <MetricCard title="Data Quality" value={data?.metrics?.dataQuality ?? '96%'} sub="↑ 2% this month" dotColor="bg-teal-400" valueColor={darkMode ? "text-teal-400" : "text-slate-900"} accent="border-t-teal-500" darkMode={darkMode} onClick={() => setIsDataQualityOpen(true)} />
                    <MetricCard title="Milestones" value={data?.metrics?.upcomingMilestones ?? '5'} sub="View All →" dotColor="bg-rose-400" valueColor={darkMode ? "text-rose-400" : "text-slate-900"} accent="border-t-rose-500" darkMode={darkMode} />
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                    <div className={`col-span-7 border rounded-xl p-3.5 shadow-md transition-colors duration-300 ${
                      darkMode ? 'bg-[#111c2e] border-slate-800' : 'bg-white border-slate-200/90'
                    }`}>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-xs font-bold tracking-wide ${darkMode ? 'text-slate-100 font-extrabold' : 'text-slate-900 font-extrabold'}`}>
                          Study Enrolment Trend
                        </span>
                        <div className="flex items-center gap-3 text-[10px]">
                          <span className={`flex items-center gap-1 font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Enrolled</span>
                          <span className={`flex items-center gap-1 font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>Screened</span>
                          <span className={`flex items-center gap-1 font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Target</span>
                        </div>
                      </div>
                      <div className={`h-44 flex items-end justify-between gap-3 px-2 pt-4 border-b text-[10px] font-semibold ${
                        darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                      }`}>
                        {[
                          { m: 'Apr 2026', e: 35, s: 48 },
                          { m: 'May 2026', e: 55, s: 68 },
                          { m: 'Jun 2026', e: 70, s: 80 },
                          { m: 'Jul 2026', e: 85, s: 92 },
                          { m: 'Aug 2026', e: 94, s: 100 },
                          { m: 'Sep 2026', e: 105, s: 112 },
                        ].map((bar, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <div className="w-full flex items-end justify-center gap-1.5 h-36">
                              <div className="w-3.5 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t shadow-sm" style={{ height: `${bar.e}%` }}></div>
                              <div className="w-3.5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t shadow-sm" style={{ height: `${bar.s}%` }}></div>
                            </div>
                            <span className="text-[9px]">{bar.m}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`col-span-5 border rounded-xl p-3.5 flex flex-col justify-between shadow-md transition-colors duration-300 ${
                      darkMode ? 'bg-[#111c2e] border-slate-800' : 'bg-white border-slate-200/90'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold tracking-wide ${darkMode ? 'text-slate-100 font-extrabold' : 'text-slate-900 font-extrabold'}`}>
                          Study Status Breakdown
                        </span>
                        <button type="button" onClick={refreshData} title="Refresh Data" className="text-slate-400 hover:text-cyan-400 transition">
                          <RotateCcw className={`w-3.5 h-3.5 cursor-pointer ${loading ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <div className="w-28 h-28 rounded-full border-[12px] border-emerald-500 border-t-blue-500 border-r-amber-500 border-b-purple-500 shadow-md"></div>
                          <div className="absolute text-center">
                            <span className={`text-xl font-black leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>{data?.metrics?.totalStudies ?? '5'}</span>
                            <p className={`text-[9px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Studies</p>
                          </div>
                        </div>
                        <div className="text-[11px] space-y-1.5 font-semibold">
                          <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-1.5 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Planning</span><span>1</span></div>
                          <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Ongoing</span><span>3</span></div>
                          <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500"></span>On Hold</span><span>1</span></div>
                          <div className="flex items-center justify-between gap-4"><span className="flex items-center gap-1.5 text-purple-400"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Completed</span><span>0</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

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
                            {(data?.studies || []).map((row: any) => (
                              <tr key={row.studyId} className={darkMode ? 'hover:bg-slate-800/60 transition' : 'hover:bg-slate-50 transition'}>
                                <td className="px-2.5 py-2 font-bold text-cyan-400">{row.studyId}</td>
                                <td className={`px-2.5 py-2 font-semibold max-w-[200px] truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{row.title}</td>
                                <td className="px-2.5 py-2 font-medium">{row.phase}</td>
                                <td className="px-2.5 py-2 text-slate-400 font-medium">{row.sitesCount}</td>
                                <td className="px-2.5 py-2 font-bold text-emerald-400">{`${row.enrolled} / ${row.target}`}</td>
                                <td className="px-2.5 py-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                    darkMode ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-100/80 border-emerald-300 text-emerald-800'
                                  }`}>
                                    {row.status}
                                  </span>
                                </td>
                                <td className="px-2.5 py-2 text-cyan-400 font-bold cursor-pointer hover:underline">
                                  View
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className={`col-span-4 border rounded-xl p-3.5 flex flex-col justify-between shadow-md transition-colors duration-300 ${
                      darkMode ? 'bg-[#111c2e] border-slate-800' : 'bg-white border-slate-200/90'
                    }`}>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-xs font-bold tracking-wide ${darkMode ? 'text-slate-100 font-extrabold' : 'text-slate-900 font-extrabold'}`}>
                            Safety Overview
                          </span>
                          <div className="flex gap-1 text-[10px]">
                            <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded shadow-sm">ADR</span>
                            <span className="text-slate-400 font-semibold px-2 py-0.5">SAE</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                          <div className="relative w-20 h-20 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full border-[8px] border-emerald-500 border-t-amber-400 border-r-rose-500 shadow-sm"></div>
                            <div className="absolute text-center">
                              <span className={`text-lg font-black leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>{data?.metrics?.safetyReportsCount ?? '8'}</span>
                              <p className={`text-[8px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Reports</p>
                            </div>
                          </div>

                          <div className="text-[10px] space-y-1 font-semibold">
                            <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Mild</span><span>4</span></div>
                            <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Moderate</span><span>2</span></div>
                            <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Serious</span><span>1</span></div>
                            <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Pending</span><span>1</span></div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsPVOpen(true)}
                        className={`w-full py-1.5 rounded-lg text-xs font-bold mt-2 transition cursor-pointer border ${
                          darkMode ? 'bg-[#1b2b42] hover:bg-[#253d5e] text-cyan-300 border-slate-700' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs'
                        }`}
                      >
                        View PV Dashboard →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right 3 Cols */}
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
