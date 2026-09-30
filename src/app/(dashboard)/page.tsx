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

// Modals for CRUD operations & analytics
import CreateStudyModal from '@/components/CreateStudyModal';
import AddPatientModal from '@/components/AddPatientModal';
import ReportSafetyModal from '@/components/ReportSafetyModal';
import UploadDataModal from '@/components/UploadDataModal';
import DataQualityModal from '@/components/DataQualityModal';
import PVDashboardModal from '@/components/PVDashboardModal';

export default function FullDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal open/close states
  const [isCreateStudyOpen, setIsCreateStudyOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isReportSafetyOpen, setIsReportSafetyOpen] = useState(false);
  const [isUploadDataOpen, setIsUploadDataOpen] = useState(false);
  const [isDataQualityOpen, setIsDataQualityOpen] = useState(false);
  const [isPVOpen, setIsPVOpen] = useState(false);

  // Fetch live dashboard data from Neon PostgreSQL
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

  // CSV Export action
  const handleGenerateReport = () => {
    window.open('/api/export-report', '_blank');
  };

  return (
    <div className="flex h-screen bg-[#071322] text-slate-100 overflow-hidden font-sans select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />

        <main className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 pointer-events-auto">
          {/* Welcome Banner */}
          <div className="rounded-xl bg-gradient-to-r from-[#0d2847] via-[#103258] to-[#0c1f36] border border-slate-800 p-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-emerald-700/30 border border-emerald-500/40 flex items-center justify-center font-bold text-white text-base shadow">
                AIIA
              </div>
              <div>
                <h1 className="text-base font-bold text-white">Welcome, Dr. Meera Sharma</h1>
                <p className="text-xs text-slate-300 font-medium">All India Institute of Ayurveda (AIIA)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Clinical Research | Pharmacovigilance | Better Health for All</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right border-r border-slate-700/60 pr-6">
                <div className="text-[11px] text-slate-300">Wed, 30 Sep 2026</div>
                <div className="text-sm font-semibold text-white">11:45</div>
              </div>
              <div className="text-right space-y-0.5">
                <div className="text-xs font-semibold text-emerald-400">Traditional Wisdom</div>
                <div className="text-xs font-semibold text-cyan-400">Scientific Validation</div>
                <div className="text-xs font-semibold text-white">Global Impact</div>
              </div>
            </div>
          </div>

          {/* 12-Col Grid */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-9 space-y-4">
              
              {/* 6 KPI Cards Connected to DB */}
              <div className="grid grid-cols-6 gap-2.5">
                <MetricCard title="Total Studies" value={data?.metrics?.totalStudies ?? '12'} sub="↑ 2 new this month" color="bg-blue-600" />
                <MetricCard title="Active Patients" value={data?.metrics?.activePatients ?? '1,248'} sub="↑ 12% this month" color="bg-emerald-600" />
                <MetricCard title="Safety Reports (ADR/SAE)" value={data?.metrics?.safetyReportsCount ?? '8'} sub="↑ 3 new this week" color="bg-purple-600" onClick={() => setIsPVOpen(true)} />
                <MetricCard title="Enrolment Progress" value={data?.metrics?.enrolmentProgress ?? '68%'} sub="View Details →" color="bg-amber-600" />
                <MetricCard title="Data Quality" value={data?.metrics?.dataQuality ?? '96%'} sub="↑ 2% this month" color="bg-teal-600" onClick={() => setIsDataQualityOpen(true)} />
                <MetricCard title="Upcoming Milestones" value={data?.metrics?.upcomingMilestones ?? '5'} sub="View All →" color="bg-rose-600" />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-7 bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-white">Study Enrolment Trend</span>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Enrolled</span>
                      <span className="flex items-center gap-1 text-purple-400"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Screened</span>
                      <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>Target</span>
                    </div>
                  </div>
                  <div className="h-44 flex items-end justify-between gap-3 px-2 pt-4 border-b border-slate-800 text-[10px] text-slate-400">
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
                          <div className="w-3.5 bg-blue-500 rounded-t shadow-sm" style={{ height: `${bar.e}%` }}></div>
                          <div className="w-3.5 bg-purple-500/80 rounded-t shadow-sm" style={{ height: `${bar.s}%` }}></div>
                        </div>
                        <span className="text-[9px]">{bar.m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-5 bg-[#0a192c] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-white">Study Status</span>
                    <button type="button" onClick={refreshData} title="Refresh Data" className="text-slate-400 hover:text-white transition">
                      <RotateCcw className="w-3 h-3 cursor-pointer" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full border-[12px] border-emerald-500 border-t-blue-500 border-r-amber-500 border-b-purple-500"></div>
                      <div className="absolute text-center">
                        <span className="text-lg font-bold text-white leading-none">{data?.metrics?.totalStudies ?? '12'}</span>
                        <p className="text-[9px] text-slate-400">Total Studies</p>
                      </div>
                    </div>
                    <div className="text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Planning</span>
                        <span className="text-slate-300">2 (16.7%)</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Ongoing</span>
                        <span className="text-slate-300">7 (58.3%)</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>On Hold</span>
                        <span className="text-slate-300">1 (8.3%)</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Completed</span>
                        <span className="text-slate-300">2 (16.7%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Row Connected to DB Studies */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8 bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs font-semibold text-white">Active Studies</span>
                    <button type="button" onClick={() => setIsCreateStudyOpen(true)} className="text-[10px] text-cyan-400 hover:underline cursor-pointer">
                      + Add Protocol
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] text-slate-300">
                      <thead className="bg-[#11243c] text-slate-400 uppercase text-[9px]">
                        <tr>
                          <th className="px-2.5 py-1.5">Study ID</th>
                          <th className="px-2.5 py-1.5">Title</th>
                          <th className="px-2.5 py-1.5">Phase</th>
                          <th className="px-2.5 py-1.5">Sites</th>
                          <th className="px-2.5 py-1.5">Enrolment</th>
                          <th className="px-2.5 py-1.5">Status</th>
                          <th className="px-2.5 py-1.5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {(data?.studies || []).map((row: any) => (
                          <tr key={row.studyId} className="hover:bg-slate-800/40">
                            <td className="px-2.5 py-2 font-medium text-cyan-400">{row.studyId}</td>
                            <td className="px-2.5 py-2 text-white">{row.title}</td>
                            <td className="px-2.5 py-2">{row.phase}</td>
                            <td className="px-2.5 py-2">{row.sitesCount}</td>
                            <td className="px-2.5 py-2">{`${row.enrolled} / ${row.target}`}</td>
                            <td className="px-2.5 py-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-emerald-400">
                                {row.status}
                              </span>
                            </td>
                            <td className="px-2.5 py-2 text-slate-400 space-x-1.5">
                              <button
                                type="button"
                                onClick={() => alert(`Study ID: ${row.studyId}\nTitle: ${row.title}\nPhase: ${row.phase}\nEnrolled: ${row.enrolled}/${row.target}`)}
                                className="hover:text-white cursor-pointer"
                              >
                                View
                              </button>
                              <span>|</span>
                              <button
                                type="button"
                                onClick={() => alert(`Edit Protocol settings for ${row.studyId}`)}
                                className="hover:text-white cursor-pointer"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Safety Overview */}
                <div className="col-span-4 bg-[#0a192c] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-white">Safety Overview</span>
                      <div className="flex gap-1 text-[10px]">
                        <span className="bg-[#18395c] text-white px-2 py-0.5 rounded">ADR</span>
                        <span className="text-slate-400 px-2 py-0.5">SAE</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="relative w-20 h-20 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full border-[8px] border-cyan-400 border-t-amber-400 border-r-rose-500"></div>
                        <div className="absolute text-center">
                          <span className="text-base font-bold text-white leading-none">{data?.metrics?.safetyReportsCount ?? '8'}</span>
                          <p className="text-[8px] text-slate-400">Reports</p>
                        </div>
                      </div>

                      <div className="text-[10px] space-y-1">
                        <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>Mild</span><span>{data?.safety?.mild ?? 4}</span></div>
                        <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Moderate</span><span>{data?.safety?.moderate ?? 2}</span></div>
                        <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Serious</span><span>{data?.safety?.serious ?? 1}</span></div>
                        <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Pending</span><span>{data?.safety?.pending ?? 1}</span></div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPVOpen(true)}
                    className="w-full bg-[#163a61] hover:bg-[#1f4e82] text-cyan-300 py-1.5 rounded-lg text-xs font-semibold mt-2 transition cursor-pointer"
                  >
                    View PV Dashboard →
                  </button>
                </div>
              </div>
            </div>

            {/* Right 3 Cols */}
            <div className="col-span-3 space-y-4">
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5 space-y-2">
                <span className="text-xs font-semibold text-white">Quick Actions</span>
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

              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-semibold text-white">Upcoming Deadlines</span>
                  <button type="button" onClick={() => alert('All upcoming regulatory milestones are monitored under CTRI protocol.')} className="text-[10px] text-cyan-400 cursor-pointer">
                    View All →
                  </button>
                </div>
                <div className="space-y-2 text-[11px]">
                  <DeadlineItem title="CTRI Update Due" study="Study AIIA-CT-001" date="25 Oct 2026" />
                  <DeadlineItem title="Ethics Approval Renewal" study="Study AIIA-CT-003" date="28 Oct 2026" />
                  <DeadlineItem title="Monitoring Visit" study="Site - Chennai" date="30 Oct 2026" />
                  <DeadlineItem title="SAE Reporting (7 days)" study="Study AIIA-CT-002" date="02 Nov 2026" alert />
                </div>
              </div>

              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-semibold text-white">Recent Activity</span>
                  <button type="button" onClick={() => alert('Showing last 25 system events logged in database.')} className="text-[10px] text-cyan-400 cursor-pointer">
                    View All →
                  </button>
                </div>
                <div className="space-y-2.5 text-[10px]">
                  <div>
                    <p className="text-white font-medium">New ADR reported</p>
                    <p className="text-slate-400">Study AIIA-CT-002 • 2h ago</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">Site activation completed</p>
                    <p className="text-slate-400">Site: Varanasi • 4h ago</p>
                  </div>
                  <div>
                    <p className="text-white font-medium">Data query resolved</p>
                    <p className="text-slate-400">Study AIIA-CT-001 • 6h ago</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-800/40 rounded-xl text-center">
                <p className="text-xs font-bold text-emerald-400">Safe Ayurveda</p>
                <p className="text-[10px] text-slate-300">Stronger Evidence • Better Tomorrow</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3 flex items-center justify-between text-[11px] text-slate-300">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">Regulatory & Compliance:</span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700">CTRI: <strong className="text-emerald-400">12/12 Compliant</strong></span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700">GCP-ASU: <strong className="text-emerald-400">Compliant</strong></span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700">NDCT Rules 2019: <strong className="text-emerald-400">Compliant</strong></span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">Data Standards & Security:</span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700">CDISC: <strong className="text-cyan-400">SDTM / ODM</strong></span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700">HL7 FHIR R4: <strong className="text-cyan-400">Interoperable</strong></span>
              <span className="px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700">ISO/IEC 27001: <strong className="text-emerald-400">Certified</strong></span>
            </div>
          </div>
        </main>
      </div>

      {/* All 6 Connected Modals */}
      <CreateStudyModal
        isOpen={isCreateStudyOpen}
        onClose={() => setIsCreateStudyOpen(false)}
        onSuccess={refreshData}
      />

      <AddPatientModal
        isOpen={isAddPatientOpen}
        studies={(data?.studies || []).map((s: any) => ({
          studyCode: s.studyId || s.studyCode,
          title: s.title,
        }))}
        onClose={() => setIsAddPatientOpen(false)}
        onSuccess={refreshData}
      />

      <ReportSafetyModal
        isOpen={isReportSafetyOpen}
        studies={(data?.studies || []).map((s: any) => ({
          studyCode: s.studyId || s.studyCode,
          title: s.title,
        }))}
        onClose={() => setIsReportSafetyOpen(false)}
        onSuccess={refreshData}
      />

      <UploadDataModal
        isOpen={isUploadDataOpen}
        onClose={() => setIsUploadDataOpen(false)}
        onSuccess={refreshData}
      />

      <DataQualityModal
        isOpen={isDataQualityOpen}
        onClose={() => setIsDataQualityOpen(false)}
      />

      <PVDashboardModal
        isOpen={isPVOpen}
        safety={data?.safety}
        onClose={() => setIsPVOpen(false)}
      />
    </div>
  );
}

function MetricCard({ title, value, sub, color, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#0a192c] border border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-sm transition ${
        onClick ? 'cursor-pointer hover:border-slate-600' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400 leading-tight">{title}</span>
        <span className={`w-2 h-2 rounded-full ${color}`}></span>
      </div>
      <div className="my-1">
        <span className="text-xl font-bold text-white tracking-tight">{value}</span>
      </div>
      <span className="text-[9px] text-slate-400 truncate">{sub}</span>
    </div>
  );
}

function ActionButton({ title, icon: Icon, primary, onClick }: any) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) onClick();
      }}
      className={`w-full relative z-20 pointer-events-auto flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer select-none ${
        primary
          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow'
          : 'bg-[#12263f] hover:bg-[#183457] text-slate-200'
      }`}
    >
      <div className="flex items-center gap-2 pointer-events-none">
        <Icon className="w-3.5 h-3.5" />
        <span>{title}</span>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    </button>
  );
}

function DeadlineItem({ title, study, date, alert }: any) {
  return (
    <div className="flex justify-between items-center border-b border-slate-800/60 pb-1.5">
      <div>
        <p className={`font-medium ${alert ? 'text-rose-400' : 'text-slate-200'}`}>{title}</p>
        <p className="text-[10px] text-slate-400">{study}</p>
      </div>
      <span className="text-[10px] text-slate-400">{date}</span>
    </div>
  );
}