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
    <div className="flex h-screen w-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-sans">
      {/* 1. Deep Forest Green Ayurvedic Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Clean Modern Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#f8fafc]">
        {/* White TopNav */}
        <TopNav />

        {/* Dashboard / Dynamic Module Content */}
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
              {/* Vibrant Emerald & Teal Banner */}
              <div className="rounded-xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#0f766e] text-white p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-emerald-950">
                    <img
                      src="/doctor.jpg"
                      alt="Dr. Aanchal Singh"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h1 className="text-base font-bold text-white tracking-tight">Welcome, Dr. Aanchal Singh</h1>
                    <p className="text-xs text-emerald-100 font-medium">All India Institute of Ayurveda (AIIA)</p>
                    <p className="text-[10px] text-emerald-200 mt-0.5">Clinical Research • Pharmacovigilance • Global Impact</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right border-r border-emerald-500/50 pr-6">
                    <div className="text-[11px] text-emerald-100 font-medium">Wed, 30 Sep 2026</div>
                    <div className="text-sm font-bold text-white">12:30 IST</div>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="text-xs font-bold text-amber-300">Traditional Wisdom</div>
                    <div className="text-xs font-bold text-emerald-200">Scientific Validation</div>
                    <div className="text-xs font-bold text-teal-200">Global Impact</div>
                  </div>
                </div>
              </div>

              {/* 12-Col Grid */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-9 space-y-4">
                  {/* Colorful 6 KPI Cards on White Background */}
                  <div className="grid grid-cols-6 gap-2.5">
                    <MetricCard title="Total Studies" value={data?.metrics?.totalStudies ?? '2'} sub="↑ 2 new this month" dotColor="bg-blue-500" valueColor="text-blue-600" />
                    <MetricCard title="Active Patients" value={data?.metrics?.activePatients ?? '1'} sub="↑ 12% this month" dotColor="bg-emerald-500" valueColor="text-emerald-600" />
                    <MetricCard title="Safety Reports" value={data?.metrics?.safetyReportsCount ?? '8'} sub="↑ 3 new this week" dotColor="bg-purple-500" valueColor="text-purple-600" onClick={() => setIsPVOpen(true)} />
                    <MetricCard title="Enrolment Rate" value={data?.metrics?.enrolmentProgress ?? '68%'} sub="View Details →" dotColor="bg-amber-500" valueColor="text-amber-600" />
                    <MetricCard title="Data Quality" value={data?.metrics?.dataQuality ?? '96%'} sub="↑ 2% this month" dotColor="bg-teal-500" valueColor="text-teal-600" onClick={() => setIsDataQualityOpen(true)} />
                    <MetricCard title="Milestones" value={data?.metrics?.upcomingMilestones ?? '5'} sub="View All →" dotColor="bg-rose-500" valueColor="text-rose-600" />
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-12 gap-4">
                    {/* Trend Chart Card */}
                    <div className="col-span-7 bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-800">Study Enrolment Trend</span>
                        <div className="flex items-center gap-3 text-[10px]">
                          <span className="flex items-center gap-1 text-slate-600 font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Enrolled</span>
                          <span className="flex items-center gap-1 text-slate-600 font-medium"><span className="w-2 h-2 rounded-full bg-teal-500"></span>Screened</span>
                          <span className="flex items-center gap-1 text-slate-600 font-medium"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Target</span>
                        </div>
                      </div>
                      <div className="h-44 flex items-end justify-between gap-3 px-2 pt-4 border-b border-slate-100 text-[10px] text-slate-400 font-medium">
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
                              <div className="w-3.5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t shadow-sm" style={{ height: `${bar.e}%` }}></div>
                              <div className="w-3.5 bg-gradient-to-t from-teal-500 to-teal-300 rounded-t shadow-sm" style={{ height: `${bar.s}%` }}></div>
                            </div>
                            <span className="text-[9px] text-slate-500">{bar.m}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Donut Status Card */}
                    <div className="col-span-5 bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800">Study Status</span>
                        <button type="button" onClick={refreshData} title="Refresh Data" className="text-slate-400 hover:text-slate-700 transition">
                          <RotateCcw className="w-3.5 h-3.5 cursor-pointer" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <div className="w-28 h-28 rounded-full border-[12px] border-emerald-500 border-t-blue-500 border-r-amber-500 border-b-purple-500"></div>
                          <div className="absolute text-center">
                            <span className="text-lg font-bold text-slate-800 leading-none">{data?.metrics?.totalStudies ?? '2'}</span>
                            <p className="text-[9px] text-slate-400 font-medium">Total Studies</p>
                          </div>
                        </div>
                        <div className="text-[11px] space-y-1.5 font-medium">
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Planning</span>
                            <span className="text-slate-800 font-bold">0</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Ongoing</span>
                            <span className="text-slate-800 font-bold">2</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-amber-500"></span>On Hold</span>
                            <span className="text-slate-800 font-bold">0</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Completed</span>
                            <span className="text-slate-800 font-bold">0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Studies Table */}
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-8 bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-xs font-bold text-slate-800">Active Clinical Studies</span>
                        <button type="button" onClick={() => setIsCreateStudyOpen(true)} className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer">
                          + Add Protocol
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] text-slate-700">
                          <thead className="bg-slate-50 text-slate-500 uppercase text-[9px] border-b border-slate-100">
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
                          <tbody className="divide-y divide-slate-100">
                            {(data?.studies || []).map((row: any) => (
                              <tr key={row.studyId} className="hover:bg-slate-50/80 transition">
                                <td className="px-2.5 py-2 font-bold text-emerald-700">{row.studyId}</td>
                                <td className="px-2.5 py-2 font-medium text-slate-900 max-w-[200px] truncate">{row.title}</td>
                                <td className="px-2.5 py-2">{row.phase}</td>
                                <td className="px-2.5 py-2 text-slate-500">{row.sitesCount}</td>
                                <td className="px-2.5 py-2 font-semibold text-slate-800">{`${row.enrolled} / ${row.target}`}</td>
                                <td className="px-2.5 py-2">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
                                    {row.status}
                                  </span>
                                </td>
                                <td className="px-2.5 py-2 text-emerald-600 font-semibold cursor-pointer hover:underline">
                                  View
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Safety Overview */}
                    <div className="col-span-4 bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-slate-800">Safety Overview</span>
                          <div className="flex gap-1 text-[10px]">
                            <span className="bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded">ADR</span>
                            <span className="text-slate-400 px-2 py-0.5">SAE</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                          <div className="relative w-20 h-20 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full border-[8px] border-emerald-400 border-t-amber-400 border-r-rose-500"></div>
                            <div className="absolute text-center">
                              <span className="text-base font-bold text-slate-800 leading-none">{data?.metrics?.safetyReportsCount ?? '8'}</span>
                              <p className="text-[8px] text-slate-400 font-medium">Reports</p>
                            </div>
                          </div>

                          <div className="text-[10px] space-y-1 font-medium">
                            <div className="flex items-center justify-between gap-3 text-slate-600"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Mild</span><span className="text-slate-900 font-bold">4</span></div>
                            <div className="flex items-center justify-between gap-3 text-slate-600"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500"></span>Moderate</span><span className="text-slate-900 font-bold">2</span></div>
                            <div className="flex items-center justify-between gap-3 text-slate-600"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Serious</span><span className="text-slate-900 font-bold">1</span></div>
                            <div className="flex items-center justify-between gap-3 text-slate-600"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Pending</span><span className="text-slate-900 font-bold">1</span></div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsPVOpen(true)}
                        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-1.5 rounded-lg text-xs font-bold mt-2 transition cursor-pointer"
                      >
                        View PV Dashboard →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right 3 Cols: Quick Actions with Vivid Buttons */}
                <div className="col-span-3 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-sm">
                    <span className="text-xs font-bold text-slate-800">Quick Actions</span>
                    <div className="space-y-1.5 pt-1">
                      <ActionButton
                        title="Create New Study"
                        icon={Plus}
                        primary
                        onClick={() => setIsCreateStudyOpen(true)}
                      />
                      <ActionButton
                        title="Add Patient"
                        icon={UserPlus}
                        onClick={() => setIsAddPatientOpen(true)}
                      />
                      <ActionButton
                        title="Report ADR/SAE"
                        icon={AlertTriangle}
                        onClick={() => setIsReportSafetyOpen(true)}
                      />
                      <ActionButton
                        title="Generate Report"
                        icon={FileSpreadsheet}
                        onClick={handleGenerateReport}
                      />
                      <ActionButton
                        title="Upload Data"
                        icon={Upload}
                        onClick={() => setIsUploadDataOpen(true)}
                      />
                      <ActionButton
                        title="Check Data Quality"
                        icon={CheckCircle}
                        onClick={() => setIsDataQualityOpen(true)}
                      />
                    </div>
                  </div>

                  {/* Deadlines */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-xs font-bold text-slate-800">Upcoming Deadlines</span>
                      <span onClick={() => alert('Regulatory deadlines monitored.')} className="text-[10px] text-emerald-600 font-bold cursor-pointer">View All →</span>
                    </div>
                    <div className="space-y-2 text-[11px]">
                      <DeadlineItem title="CTRI Update Due" study="Study AIIA-CT-001" date="25 Oct 2026" />
                      <DeadlineItem title="Ethics Approval Renewal" study="Study AIIA-CT-003" date="28 Oct 2026" />
                      <DeadlineItem title="Monitoring Visit" study="Site - Chennai" date="30 Oct 2026" />
                      <DeadlineItem title="SAE Reporting (7 days)" study="Study AIIA-CT-002" date="02 Nov 2026" alert />
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-xs font-bold text-slate-800">Recent Activity</span>
                      <span onClick={() => alert('Recent activities.')} className="text-[10px] text-emerald-600 font-bold cursor-pointer">View All →</span>
                    </div>
                    <div className="space-y-2.5 text-[10px]">
                      <div>
                        <p className="text-slate-800 font-semibold">New ADR reported</p>
                        <p className="text-slate-400">Study AIIA-CT-002 • 2h ago</p>
                      </div>
                      <div>
                        <p className="text-slate-800 font-semibold">Site activation completed</p>
                        <p className="text-slate-400">Site: Varanasi • 4h ago</p>
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

function MetricCard({ title, value, sub, dotColor, valueColor, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between shadow-sm transition hover:shadow-md hover:border-slate-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-medium leading-tight">{title}</span>
        <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
      </div>
      <div className="my-1">
        <span className={`text-xl font-bold tracking-tight ${valueColor}`}>{value}</span>
      </div>
      <span className="text-[9px] text-slate-400 truncate">{sub}</span>
    </div>
  );
}

function ActionButton({ title, icon: Icon, primary, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer select-none shadow-sm ${
        primary
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/10'
          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
      }`}
    >
      <div className="flex items-center gap-2 pointer-events-none">
        <Icon className={`w-3.5 h-3.5 ${primary ? 'text-white' : 'text-slate-500'}`} />
        <span>{title}</span>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    </button>
  );
}

function DeadlineItem({ title, study, date, alert }: any) {
  return (
    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
      <div>
        <p className={`font-semibold ${alert ? 'text-rose-600' : 'text-slate-800'}`}>{title}</p>
        <p className="text-[10px] text-slate-400">{study}</p>
      </div>
      <span className="text-[10px] text-slate-500 font-medium">{date}</span>
    </div>
  );
}
