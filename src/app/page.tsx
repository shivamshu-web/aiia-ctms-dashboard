'use client';

import React from 'react';
import {
  Activity,
  Users,
  AlertTriangle,
  TrendingUp,
  FileCheck2,
  Calendar,
  ChevronRight,
  Plus,
  UserPlus,
  FileSpreadsheet,
  Upload,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Lock,
  RotateCcw
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0d2847] via-[#103258] to-[#0c1f36] border border-slate-800 p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center font-bold text-white text-sm">
            AIIA
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Welcome, Dr. Meera Sharma</h2>
            <p className="text-xs text-slate-300">All India Institute of Ayurveda (AIIA)</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Clinical Research | Pharmacovigilance | Better Health for All</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right border-r border-slate-700/60 pr-6">
            <div className="text-[11px] text-slate-300">Tue, 23 Sep 2025</div>
            <div className="text-sm font-semibold text-white">14:32</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-emerald-400">Traditional Wisdom</div>
            <div className="text-xs font-semibold text-cyan-400">Scientific Validation</div>
            <div className="text-xs font-semibold text-white">Global Impact</div>
          </div>
        </div>
      </div>

      {/* Main Grid: 9 Cols Left + 3 Cols Right */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left 9 Columns */}
        <div className="col-span-9 space-y-4">
          {/* 2. Six Metric KPI Cards */}
          <div className="grid grid-cols-6 gap-2.5">
            <MetricCard title="Total Studies" value="12" sub="↑ 2 new this month" color="bg-blue-600" />
            <MetricCard title="Active Patients" value="1,248" sub="↑ 12% this month" color="bg-emerald-600" />
            <MetricCard title="Safety Reports (ADR/SAE)" value="8" sub="↑ 3 new this week" color="bg-purple-600" />
            <MetricCard title="Enrolment Progress" value="68%" sub="View Details →" color="bg-amber-600" />
            <MetricCard title="Data Quality" value="96%" sub="↑ 2% this month" color="bg-teal-600" />
            <MetricCard title="Upcoming Milestones" value="5" sub="View All →" color="bg-rose-600" />
          </div>

          {/* 3. Middle Section: Enrolment Trend + Study Status Donut */}
          <div className="grid grid-cols-12 gap-4">
            {/* Trend Bar Chart */}
            <div className="col-span-7 bg-[#0b1c30] border border-slate-800 rounded-xl p-3.5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-white">Study Enrolment Trend</span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Enrolled</span>
                  <span className="flex items-center gap-1 text-purple-400"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Screened</span>
                  <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>Target</span>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="h-40 flex items-end justify-between gap-3 px-2 pt-4 border-b border-slate-800 text-[10px] text-slate-400">
                {[
                  { m: 'Apr 2025', h1: 30, h2: 45 },
                  { m: 'May 2025', h1: 45, h2: 60 },
                  { m: 'Jun 2025', h1: 65, h2: 75 },
                  { m: 'Jul 2025', h1: 80, h2: 85 },
                  { m: 'Aug 2025', h1: 90, h2: 95 },
                  { m: 'Sep 2025', h1: 100, h2: 110, active: true },
                ].map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1 h-32">
                      <div className="w-3 bg-blue-500 rounded-t" style={{ height: `${b.h1}%` }}></div>
                      <div className="w-3 bg-purple-500/70 rounded-t" style={{ height: `${b.h2}%` }}></div>
                    </div>
                    <span>{b.m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Status Donut */}
            <div className="col-span-5 bg-[#0b1c30] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-white">Study Status</span>
                <RotateCcw className="w-3 h-3 text-slate-400" />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border-[10px] border-emerald-500 border-t-blue-500 border-r-amber-500 border-b-purple-500"></div>
                  <div className="absolute text-center">
                    <span className="text-lg font-bold text-white leading-none">12</span>
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

          {/* 4. Active Studies Table + Safety Overview */}
          <div className="grid grid-cols-12 gap-4">
            {/* Table */}
            <div className="col-span-8 bg-[#0b1c30] border border-slate-800 rounded-xl p-3.5">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-semibold text-white">Active Studies</span>
                <span className="text-[10px] text-cyan-400 hover:underline cursor-pointer">View All →</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] text-slate-300">
                  <thead className="bg-[#11243c] text-slate-400 uppercase text-[9px]">
                    <tr>
                      <th className="px-2 py-1.5">Study ID</th>
                      <th className="px-2 py-1.5">Title</th>
                      <th className="px-2 py-1.5">Phase</th>
                      <th className="px-2 py-1.5">Sites</th>
                      <th className="px-2 py-1.5">Enrolment</th>
                      <th className="px-2 py-1.5">Status</th>
                      <th className="px-2 py-1.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {[
                      { id: 'AIIA-CT-001', title: 'Diabetes Care Study', phase: 'Phase III', sites: 5, enr: '312 / 400', status: 'Ongoing', color: 'text-emerald-400' },
                      { id: 'AIIA-CT-002', title: 'Oncology Biomarker Study', phase: 'Phase II', sites: 4, enr: '248 / 300', status: 'Ongoing', color: 'text-emerald-400' },
                      { id: 'AIIA-CT-003', title: 'Cardiovascular Risk Study', phase: 'Phase III', sites: 6, enr: '196 / 250', status: 'On Hold', color: 'text-amber-400' },
                      { id: 'AIIA-CT-004', title: 'Rare Disease Study', phase: 'Phase I', sites: 3, enr: '142 / 200', status: 'Ongoing', color: 'text-emerald-400' },
                      { id: 'AIIA-CT-005', title: 'Immunomodulatory Study', phase: 'Phase II', sites: 5, enr: '89 / 150', status: 'Planning', color: 'text-blue-400' },
                    ].map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/40">
                        <td className="px-2 py-2 font-medium text-cyan-400">{s.id}</td>
                        <td className="px-2 py-2 text-white">{s.title}</td>
                        <td className="px-2 py-2">{s.phase}</td>
                        <td className="px-2 py-2">{s.sites}</td>
                        <td className="px-2 py-2">{s.enr}</td>
                        <td className="px-2 py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 ${s.color}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-slate-400 space-x-1.5">
                          <span className="hover:text-white cursor-pointer">View</span>
                          <span>|</span>
                          <span className="hover:text-white cursor-pointer">Edit</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Safety Overview */}
            <div className="col-span-4 bg-[#0b1c30] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
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
                      <span className="text-base font-bold text-white leading-none">8</span>
                      <p className="text-[8px] text-slate-400">Reports</p>
                    </div>
                  </div>

                  <div className="text-[10px] space-y-1">
                    <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>Mild</span><span>4 (50%)</span></div>
                    <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Moderate</span><span>2 (25%)</span></div>
                    <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Serious</span><span>1 (12.5%)</span></div>
                    <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Pending</span><span>1 (12.5%)</span></div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#163a61] hover:bg-[#1f4e82] text-cyan-300 py-1.5 rounded-lg text-xs font-semibold mt-2 transition">
                View PV Dashboard →
              </button>
            </div>
          </div>
        </div>

        {/* Right 3 Columns */}
        <div className="col-span-3 space-y-4">
          {/* Quick Actions */}
          <div className="bg-[#0b1c30] border border-slate-800 rounded-xl p-3.5 space-y-2">
            <span className="text-xs font-semibold text-white">Quick Actions</span>
            <div className="space-y-1.5 pt-1">
              <ActionButton title="Create New Study" icon={Plus} primary />
              <ActionButton title="Add Patient" icon={UserPlus} />
              <ActionButton title="Report ADR/SAE" icon={AlertTriangle} />
              <ActionButton title="Generate Report" icon={FileSpreadsheet} />
              <ActionButton title="Upload Data" icon={Upload} />
              <ActionButton title="Check Data Quality" icon={CheckCircle} />
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-[#0b1c30] border border-slate-800 rounded-xl p-3.5">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-semibold text-white">Upcoming Deadlines</span>
              <span className="text-[10px] text-cyan-400">View All →</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <DeadlineItem title="CTRI Update Due" study="Study AIIA-CT-001" date="25 Sep 2025" />
              <DeadlineItem title="Ethics Approval Renewal" study="Study AIIA-CT-003" date="28 Sep 2025" />
              <DeadlineItem title="Monitoring Visit" study="Site - Chennai" date="30 Sep 2025" />
              <DeadlineItem title="SAE Reporting (7 days)" study="Study AIIA-CT-002" date="02 Oct 2025" alert />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#0b1c30] border border-slate-800 rounded-xl p-3.5">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-semibold text-white">Recent Activity</span>
              <span className="text-[10px] text-cyan-400">View All →</span>
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

          {/* Safe Ayurveda Card */}
          <div className="p-3 bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-800/40 rounded-xl text-center">
            <p className="text-xs font-bold text-emerald-400">Safe Ayurveda</p>
            <p className="text-[10px] text-slate-300">Stronger Evidence • Better Tomorrow</p>
          </div>
        </div>
      </div>

      {/* 5. Bottom Compliance Badges Footer */}
      <div className="bg-[#0b1c30] border border-slate-800 rounded-xl p-3 flex items-center justify-between text-[11px] text-slate-300">
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
    </div>
  );
}

function MetricCard({ title, value, sub, color }: any) {
  return (
    <div className="bg-[#0b1c30] border border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400 leading-tight">{title}</span>
        <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
      </div>
      <div className="my-1.5">
        <span className="text-xl font-bold text-white">{value}</span>
      </div>
      <span className="text-[9px] text-slate-400 truncate">{sub}</span>
    </div>
  );
}

function ActionButton({ title, icon: Icon, primary }: any) {
  return (
    <button
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
        primary
          ? 'bg-blue-600 hover:bg-blue-500 text-white'
          : 'bg-[#12263f] hover:bg-[#183457] text-slate-200'
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" />
        <span>{title}</span>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
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