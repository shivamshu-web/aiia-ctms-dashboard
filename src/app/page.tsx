'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import {
  Plus,
  UserPlus,
  AlertTriangle,
  FileSpreadsheet,
  Upload,
  CheckCircle,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

// Modals & Modules
import CreateStudyModal from '@/components/CreateStudyModal';
import AddPatientModal from '@/components/AddPatientModal';
import ReportSafetyModal from '@/components/ReportSafetyModal';
import ModuleViews from '@/components/ModuleViews';
import UploadDataModal from '@/components/UploadDataModal';
import DataQualityModal from '@/components/DataQualityModal';
import PVDashboardModal from '@/components/PVDashboardModal';

export default function FullDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dark Mode State with localStorage memory
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('aiia-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  const handleToggleDarkMode = (val: boolean | ((prev: boolean) => boolean)) => {
    setDarkMode((prev) => {
      const nextVal = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('aiia-theme', nextVal ? 'dark' : 'light');
      return nextVal;
    });
  };

  // Modal open/close states
  const [isCreateStudyOpen, setIsCreateStudyOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isReportSafetyOpen, setIsReportSafetyOpen] = useState(false);
  const [isUploadDataOpen, setIsUploadDataOpen] = useState(false);
  const [isDataQualityOpen, setIsDataQualityOpen] = useState(false);
  const [isPVOpen, setIsPVOpen] = useState(false);

  const refreshData = () => {
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
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${
      darkMode ? 'bg-black text-zinc-100' : 'bg-[#f8fafc] text-slate-800'
    }`}>
      {/* 1. Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main Area */}
      <div className={`flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-colors duration-200 ${
        darkMode ? 'bg-[#09090b]' : 'bg-[#f8fafc]'
      }`}>
        {/* TopNav with Switcher */}
        <TopNav darkMode={darkMode} setDarkMode={handleToggleDarkMode} />

        {/* Dashboard Content */}
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
              {/* Sleek Banner */}
              <div className={`rounded-xl p-4 flex justify-between items-center shadow-lg transition-colors duration-200 ${
                darkMode
                  ? 'bg-gradient-to-r from-[#18181b] via-[#121215] to-[#09090b] border border-zinc-800 text-white'
                  : 'bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#0f766e] text-white shadow-md'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md flex-shrink-0 bg-zinc-900">
                    <img
                      src="/doctor.jpg"
                      alt="Dr. Aanchal Singh"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h1 className="text-base font-bold text-white tracking-tight">Welcome, Dr. Aanchal Singh</h1>
                    <p className={`text-xs font-medium ${darkMode ? 'text-zinc-300' : 'text-emerald-100'}`}>All India Institute of Ayurveda (AIIA)</p>
                    <p className={`text-[10px] mt-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-200'}`}>Clinical Research • Pharmacovigilance • Global Impact</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className={`text-right border-r pr-6 ${darkMode ? 'border-zinc-800 text-zinc-300' : 'border-emerald-500/50 text-emerald-100'}`}>
                    <div className="text-[11px] font-medium">Wed, 30 Sep 2026</div>
                    <div className="text-sm font-bold text-white">12:30 IST</div>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="text-xs font-bold text-amber-400">Traditional Wisdom</div>
                    <div className="text-xs font-bold text-emerald-400">Scientific Validation</div>
                    <div className="text-xs font-bold text-cyan-400">Global Impact</div>
                  </div>
                </div>
              </div>

              {/* 12-Col Grid */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-9 space-y-4">
                  {/* Colorful 6 KPI Cards */}
                  <div className="grid grid-cols-6 gap-2.5">
                    <MetricCard title="Total Studies" value={data?.metrics?.totalStudies ?? '2'} sub="↑ 2 new this month" dotColor="bg-blue-500" valueColor={darkMode ? "text-blue-400" : "text-blue-600"} darkMode={darkMode} />
                    <MetricCard title="Active Patients" value={data?.metrics?.activePatients ?? '1'} sub="↑ 12% this month" dotColor="bg-emerald-500" valueColor={darkMode ? "text-emerald-400" : "text-emerald-600"} darkMode={darkMode} />
                    <MetricCard title="Safety Reports" value={data?.metrics?.safetyReportsCount ?? '8'} sub="↑ 3 new this week" dotColor="bg-purple-500" valueColor={darkMode ? "text-purple-400" : "text-purple-600"} darkMode={darkMode} onClick={() => setIsPVOpen(true)} />
                    <MetricCard title="Enrolment Rate" value={data?.metrics?.enrolmentProgress ?? '68%'} sub="View Details →" dotColor="bg-amber-500" valueColor={darkMode ? "text-amber-400" : "text-amber-600"} darkMode={darkMode} />
                    <MetricCard title="Data Quality" value={data?.metrics?.dataQuality ?? '96%'} sub="↑ 2% this month" dotColor="bg-teal-500" valueColor={darkMode ? "text-teal-400" : "text-teal-600"} darkMode={darkMode} onClick={() => setIsDataQualityOpen(true)} />
                    <MetricCard title="Milestones" value={data?.metrics?.upcomingMilestones ?? '5'} sub="View All →" dotColor="bg-rose-500" valueColor={darkMode ? "text-rose-400" : "text-rose-600"} darkMode={darkMode} />
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-12 gap-4">
                    {/* Trend Chart Card */}
                    <div className={`col-span-7 border rounded-xl p-3.5 shadow-sm transition-colors duration-200 ${
                      darkMode ? 'bg-[#121215] border-zinc-800' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Study Enrolment Trend</span>
                        <div className="flex items-center gap-3 text-[10px]">
                          <span className="flex items-center gap-1 font-medium"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Enrolled</span>
                          <span className="flex items-center gap-1 font-medium"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Screened</span>
                          <span className="flex items-center gap-1 font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Target</span>
                        </div>
                      </div>
                      <div className={`h-44 flex items-end justify-between gap-3 px-2 pt-4 border-b text-[10px] font-medium ${
                        darkMode ? 'border-zinc-800 text-zinc-400' : 'border-slate-100 text-slate-400'
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
                              <div className="w-3.5 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t shadow-sm" style={{ height: `${bar.e}%` }}></div>
                              <div className="w-3.5 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t shadow-sm" style={{ height: `${bar.s}%` }}></div>
                            </div>
                            <span className="text-[9px]">{bar.m}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Donut Status Card */}
                    <div className={`col-span-5 border rounded-xl p-3.5 flex flex-col justify-between shadow-sm transition-colors duration-200 ${
                      darkMode ? 'bg-[#121215] border-zinc-800' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Study Status Breakdown</span>
                        <button type="button" onClick={refreshData} title="Refresh Data" className="text-zinc-400 hover:text-white transition">
                          <RotateCcw className="w-3.5 h-3.5 cursor-pointer" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <div className="w-28 h-28 rounded-full border-[12px] border-emerald-500 border-t-blue-500 border-r-amber-500 border-b-purple-500"></div>
                          <div className="absolute text-center">
                            <span className={`text-lg font-bold leading-none ${darkMode ? 'text-white' : 'text-slate-800'}`}>{data?.metrics?.totalStudies ?? '2'}</span>
                            <p className="text-[9px] text-zinc-400 font-medium">Total Studies</p>
                          </div>
                        </div>
                        <div className="text-[11px] space-y-1.5 font-medium">
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Planning</span>
                            <span className={`font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>0</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Ongoing</span>
                            <span className={`font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>2</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500"></span>On Hold</span>
                            <span className={`font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>0</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-purple-400"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Completed</span>
                            <span className={`font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Studies Table */}
                  <div className={`grid grid-cols-12 gap-4`}>
                    <div className={`col-span-8 border rounded-xl p-3.5 shadow-sm transition-colors duration-200 ${
                      darkMode ? 'bg-[#121215] border-zinc-800' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex justify-between items-center mb-2.5">
                        <span className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Active Clinical Studies</span>
                        <button type="button" onClick={() => setIsCreateStudyOpen(true)} className="text-[10px] text-cyan-400 hover:underline font-bold cursor-pointer">
                          + Add Protocol
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px]">
                          <thead className={`uppercase text-[9px] border-b ${
                            darkMode ? 'bg-[#18181b] text-zinc-400 border-zinc-800' : 'bg-slate-50 text-slate-500 border-slate-100'
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
                          <tbody className={`divide-y ${darkMode ? 'divide-zinc-800 text-zinc-200' : 'divide-slate-100 text-slate-700'}`}>
                            {(data?.studies || []).map((row: any) => (
                              <tr key={row.studyId} className={darkMode ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-50/80'}>
                                <td className="px-2.5 py-2 font-bold text-cyan-400">{row.studyId}</td>
                                <td className="px-2.5 py-2 font-medium max-w-[200px] truncate">{row.title}</td>
                                <td className="px-2.5 py-2">{row.phase}</td>
                                <td className="px-2.5 py-2 text-zinc-400">{row.sitesCount}</td>
                                <td className="px-2.5 py-2 font-semibold">{`${row.enrolled} / ${row.target}`}</td>
                                <td className="px-2.5 py-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                    darkMode ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                  }`}>
                                    {row.status}
                                  </span>
                                </td>
                                <td className="px-2.5 py-2 text-cyan-400 font-semibold cursor-pointer hover:underline">
                                  View
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Safety Overview */}
                    <div className={`col-span-4 border rounded-xl p-3.5 flex flex-col justify-between shadow-sm transition-colors duration-200 ${
                      darkMode ? 'bg-[#121215] border-zinc-800' : 'bg-white border-slate-200'
                    }`}>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Safety Overview</span>
                          <div className="flex gap-1 text-[10px]">
                            <span className="bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded">ADR</span>
                            <span className="text-zinc-400 px-2 py-0.5">SAE</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                          <div className="relative w-20 h-20 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full border-[8px] border-cyan-400 border-t-amber-400 border-r-rose-500"></div>
                            <div className="absolute text-center">
                              <span className={`text-base font-bold leading-none ${darkMode ? 'text-white' : 'text-slate-800'}`}>{data?.metrics?.safetyReportsCount ?? '8'}</span>
                              <p className="text-[8px] text-zinc-400 font-medium">Reports</p>
                            </div>
                          </div>

                          <div className="text-[10px] space-y-1 font-medium">
                            <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>Mild</span><span className="font-bold">4</span></div>
                            <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Moderate</span><span className="font-bold">2</span></div>
                            <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Serious</span><span className="font-bold">1</span></div>
                            <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Pending</span><span className="font-bold">1</span></div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsPVOpen(true)}
                        className={`w-full py-1.5 rounded-lg text-xs font-bold mt-2 transition cursor-pointer border ${
                          darkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border-zinc-700' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        View PV Dashboard →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right 3 Cols: Quick Actions */}
                <div className="col-span-3 space-y-4">
                  <div className={`border rounded-xl p-3.5 space-y-2 shadow-sm transition-colors duration-200 ${
                    darkMode ? 'bg-[#121215] border-zinc-800' : 'bg-white border-slate-200'
                  }`}>
                    <span className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Quick Actions</span>
                    <div className="space-y-1.5 pt-1">
                      <ActionButton title="Create New Study" icon={Plus} primary onClick={() => setIsCreateStudyOpen(true)} />
                      <ActionButton title="Add Patient" icon={UserPlus} darkMode={darkMode} onClick={() => setIsAddPatientOpen(true)} />
                      <ActionButton title="Report ADR/SAE" icon={AlertTriangle} darkMode={darkMode} onClick={() => setIsReportSafetyOpen(true)} />
                      <ActionButton title="Generate Report" icon={FileSpreadsheet} darkMode={darkMode} onClick={handleGenerateReport} />
                      <ActionButton title="Upload Data" icon={Upload} darkMode={darkMode} onClick={() => setIsUploadDataOpen(true)} />
                      <ActionButton title="Check Data Quality" icon={CheckCircle} darkMode={darkMode} onClick={() => setIsDataQualityOpen(true)} />
                    </div>
                  </div>

                  {/* Deadlines */}
                  <div className={`border rounded-xl p-3.5 shadow-sm transition-colors duration-200 ${
                    darkMode ? 'bg-[#121215] border-zinc-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Upcoming Deadlines</span>
                      <span onClick={() => alert('Regulatory deadlines monitored.')} className="text-[10px] text-cyan-400 font-bold cursor-pointer">View All →</span>
                    </div>
                    <div className="space-y-2 text-[11px]">
                      <DeadlineItem title="CTRI Update Due" study="Study AIIA-CT-001" date="25 Oct 2026" darkMode={darkMode} />
                      <DeadlineItem title="Ethics Approval Renewal" study="Study AIIA-CT-003" date="28 Oct 2026" darkMode={darkMode} />
                      <DeadlineItem title="Monitoring Visit" study="Site - Chennai" date="30 Oct 2026" darkMode={darkMode} />
                      <DeadlineItem title="SAE Reporting (7 days)" study="Study AIIA-CT-002" date="02 Nov 2026" alert darkMode={darkMode} />
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className={`border rounded-xl p-3.5 shadow-sm transition-colors duration-200 ${
                    darkMode ? 'bg-[#121215] border-zinc-800' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Recent Activity</span>
                      <span onClick={() => alert('Recent activities.')} className="text-[10px] text-cyan-400 font-bold cursor-pointer">View All →</span>
                    </div>
                    <div className="space-y-2.5 text-[10px]">
                      <div>
                        <p className={`font-semibold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>New ADR reported</p>
                        <p className="text-zinc-400">Study AIIA-CT-002 • 2h ago</p>
                      </div>
                      <div>
                        <p className={`font-semibold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>Site activation completed</p>
                        <p className="text-zinc-400">Site: Varanasi • 4h ago</p>
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

function MetricCard({ title, value, sub, dotColor, valueColor, darkMode, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`border rounded-xl p-3 flex flex-col justify-between shadow-sm transition hover:shadow-md ${
        darkMode ? 'bg-[#121215] border-zinc-800' : 'bg-white border-slate-200'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-medium leading-tight ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>{title}</span>
        <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
      </div>
      <div className="my-1">
        <span className={`text-xl font-bold tracking-tight ${valueColor}`}>{value}</span>
      </div>
      <span className={`text-[9px] truncate ${darkMode ? 'text-zinc-500' : 'text-slate-400'}`}>{sub}</span>
    </div>
  );
}

function ActionButton({ title, icon: Icon, primary, darkMode, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer select-none shadow-sm ${
        primary
          ? 'bg-blue-600 hover:bg-blue-500 text-white'
          : darkMode
          ? 'bg-[#18181b] hover:bg-zinc-800 text-zinc-200 border border-zinc-800'
          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
      }`}
    >
      <div className="flex items-center gap-2 pointer-events-none">
        <Icon className={`w-3.5 h-3.5 ${primary ? 'text-white' : darkMode ? 'text-zinc-400' : 'text-slate-500'}`} />
        <span>{title}</span>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
    </button>
  );
}

function DeadlineItem({ title, study, date, alert, darkMode }: any) {
  return (
    <div className={`flex justify-between items-center border-b pb-1.5 ${
      darkMode ? 'border-zinc-800' : 'border-slate-100'
    }`}>
      <div>
        <p className={`font-semibold ${alert ? 'text-rose-500' : darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>{title}</p>
        <p className="text-[10px] text-zinc-400">{study}</p>
      </div>
      <span className="text-[10px] text-zinc-400 font-medium">{date}</span>
    </div>
  );
}
