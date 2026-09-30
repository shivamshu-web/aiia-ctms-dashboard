'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  FileCheck,
  Building2,
  UserPlus,
  CalendarCheck,
  Database,
  Flag,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileCode,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Scale,
  SearchCheck,
  Cpu,
  Share2,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Download,
  ExternalLink,
  Clock,
  ShieldAlert,
  Users
} from 'lucide-react';

interface Props {
  tab: string;
  onBack: () => void;
  studies: any[];
  onOpenCreateStudy: () => void;
  onOpenAddPatient: () => void;
  onOpenReportSafety: () => void;
}

export default function ModuleViews({
  tab,
  onBack,
  studies,
  onOpenCreateStudy,
  onOpenAddPatient,
  onOpenReportSafety,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPhase, setFilterPhase] = useState('ALL');

  // Realistic fallback/augmented clinical trial data aligned with AIIA research protocols
  const clinicalStudies = studies && studies.length > 0 ? studies : [
    {
      studyId: 'AIIA-CT-001',
      title: 'Clinical Evaluation of Nishamalaki in Type 2 Diabetes Mellitus',
      phase: 'PHASE_III',
      sitesCount: 4,
      enrolled: 1300,
      target: 1500,
      status: 'ONGOING',
      ctriNumber: 'CTRI/2025/03/048912',
      pi: 'Dr. Aanchal Singh',
      ethicsStatus: 'APPROVED',
      iecDate: '15 Jan 2025',
      sponsor: 'Ministry of Ayush',
      dataCompleteness: '98.4%'
    },
    {
      studyId: 'AIIA-CT-006',
      title: 'Clinical Evaluation of Haridra & Guggulu in Rheumatic Conditions',
      phase: 'PHASE_II',
      sitesCount: 2,
      enrolled: 84,
      target: 100,
      status: 'ONGOING',
      ctriNumber: 'CTRI/2025/08/059124',
      pi: 'Dr. Aanchal Singh',
      ethicsStatus: 'APPROVED',
      iecDate: '28 Jul 2025',
      sponsor: 'AIIA New Delhi',
      dataCompleteness: '96.1%'
    },
    {
      studyId: 'AIIA-CT-003',
      title: 'Standardized Ashwagandha in Chronic Fatigue Syndrome Assessment',
      phase: 'PHASE_II',
      sitesCount: 3,
      enrolled: 196,
      target: 250,
      status: 'ONGOING',
      ctriNumber: 'CTRI/2025/05/051280',
      pi: 'Dr. Aanchal Singh',
      ethicsStatus: 'RENEWAL_DUE',
      iecDate: '12 Feb 2025',
      sponsor: 'Central Council for Research in Ayurvedic Sciences',
      dataCompleteness: '94.8%'
    }
  ];

  // Filtered studies
  const filteredStudies = clinicalStudies.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.studyId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = filterPhase === 'ALL' || s.phase === filterPhase;
    return matchesSearch && matchesPhase;
  });

  // Render module based on tab
  const renderModuleContent = () => {
    switch (tab) {
      // 1. Study Management
      case 'study-management':
        return (
          <div className="space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">Total Active Protocols</span>
                <p className="text-xl font-bold text-white mt-1">{clinicalStudies.length}</p>
                <span className="text-[10px] text-emerald-400 font-medium">100% IEC Approved</span>
              </div>
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">Total Enrolled Patients</span>
                <p className="text-xl font-bold text-cyan-400 mt-1">
                  {clinicalStudies.reduce((acc, s) => acc + (s.enrolled || 0), 0)}
                </p>
                <span className="text-[10px] text-slate-400">Across 9 Multi-Centric Sites</span>
              </div>
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">Average Enrolment Rate</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">84.2%</p>
                <span className="text-[10px] text-emerald-400">↑ 6% higher than target</span>
              </div>
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">CTRI Registry Status</span>
                <p className="text-xl font-bold text-purple-400 mt-1">Verified</p>
                <span className="text-[10px] text-slate-400">All trials registered on CTRI</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1 max-w-md bg-[#11243a] px-3 py-1.5 rounded-lg border border-slate-700">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search protocol title or study code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-slate-100 placeholder-slate-500 w-full"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phase:</span>
                  <select
                    value={filterPhase}
                    onChange={(e) => setFilterPhase(e.target.value)}
                    className="bg-[#11243a] border border-slate-700 rounded-md px-2 py-1 text-xs text-white"
                  >
                    <option value="ALL">All Phases</option>
                    <option value="PHASE_II">Phase II</option>
                    <option value="PHASE_III">Phase III</option>
                  </select>
                </div>

                <button
                  onClick={onOpenCreateStudy}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Study Protocol</span>
                </button>
              </div>
            </div>

            {/* Comprehensive Studies Table */}
            <div className="bg-[#0a192c] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead className="bg-[#102540] text-slate-400 uppercase text-[9px] border-b border-slate-800">
                  <tr>
                    <th className="px-3.5 py-3">Study ID</th>
                    <th className="px-3.5 py-3">Clinical Protocol Title</th>
                    <th className="px-3.5 py-3">Principal Investigator</th>
                    <th className="px-3.5 py-3">Phase</th>
                    <th className="px-3.5 py-3">Sites</th>
                    <th className="px-3.5 py-3">Enrolled / Target</th>
                    <th className="px-3.5 py-3">CTRI Number</th>
                    <th className="px-3.5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredStudies.map((s: any) => (
                    <tr key={s.studyId} className="hover:bg-slate-800/40 transition">
                      <td className="px-3.5 py-3 font-semibold text-cyan-400">{s.studyId}</td>
                      <td className="px-3.5 py-3 text-white font-medium max-w-sm">{s.title}</td>
                      <td className="px-3.5 py-3 text-slate-300">Dr. Aanchal Singh</td>
                      <td className="px-3.5 py-3">
                        <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800 text-blue-300 font-medium text-[10px]">
                          {s.phase}
                        </span>
                      </td>
                      <td className="px-3.5 py-3">{s.sitesCount || 2} Sites</td>
                      <td className="px-3.5 py-3 font-semibold text-emerald-400">
                        {s.enrolled} / {s.target}
                      </td>
                      <td className="px-3.5 py-3 text-slate-400 font-mono text-[10px]">{s.ctriNumber || 'CTRI/2025/VERIFIED'}</td>
                      <td className="px-3.5 py-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // 2. Protocol & Approvals
      case 'protocols':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">IEC Approvals Active</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">3 Protocols</p>
                <span className="text-[10px] text-slate-400">Institutional Ethics Committee (AIIA)</span>
              </div>
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">Pending Protocol Amendments</span>
                <p className="text-xl font-bold text-amber-400 mt-1">1 Amendment</p>
                <span className="text-[10px] text-slate-400">Minor sample size adjustment</span>
              </div>
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">Regulatory Dossier Status</span>
                <p className="text-xl font-bold text-cyan-400 mt-1">Compliant</p>
                <span className="text-[10px] text-emerald-400">ICMR & CDSCO guidelines adhered</span>
              </div>
            </div>

            <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-white">Institutional Ethics Committee (IEC) Approvals & Protocol Dossiers</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] text-slate-300">
                  <thead className="bg-[#102540] text-slate-400 uppercase text-[9px]">
                    <tr>
                      <th className="px-3 py-2.5">Protocol Code</th>
                      <th className="px-3 py-2.5">Study Title</th>
                      <th className="px-3 py-2.5">Version</th>
                      <th className="px-3 py-2.5">IEC Decision Date</th>
                      <th className="px-3 py-2.5">Ethics Review Board</th>
                      <th className="px-3 py-2.5">Approval Status</th>
                      <th className="px-3 py-2.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {clinicalStudies.map((s: any, idx: number) => (
                      <tr key={s.studyId} className="hover:bg-slate-800/40">
                        <td className="px-3 py-2.5 font-semibold text-cyan-400">{s.studyId}</td>
                        <td className="px-3 py-2.5 text-white max-w-sm">{s.title}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-300">v{idx + 1}.2</td>
                        <td className="px-3 py-2.5 text-slate-400">{s.iecDate || '15 Jan 2025'}</td>
                        <td className="px-3 py-2.5 text-slate-300">AIIA Institutional Ethics Committee</td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            s.ethicsStatus === 'RENEWAL_DUE'
                              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                          }`}>
                            {s.ethicsStatus === 'RENEWAL_DUE' ? 'Renewal Due' : 'Approved (Valid)'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer">
                          View Dossier →
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // 3. Site Management
      case 'sites':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">Total Activated Sites</span>
                <p className="text-xl font-bold text-white mt-1">6 Sites</p>
                <span className="text-[10px] text-emerald-400">Multi-centric clinical network</span>
              </div>
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">Lead Coordinating Centre</span>
                <p className="text-base font-bold text-cyan-400 mt-1 truncate">AIIA Hospital, New Delhi</p>
                <span className="text-[10px] text-slate-400">PI: Dr. Aanchal Singh</span>
              </div>
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">Monitoring Compliance</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">98.5%</p>
                <span className="text-[10px] text-slate-400">GCP Site inspection cleared</span>
              </div>
            </div>

            <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-bold text-white mb-3 block">Participating AYUSH Clinical Sites</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] text-slate-300">
                  <thead className="bg-[#102540] text-slate-400 uppercase text-[9px]">
                    <tr>
                      <th className="px-3 py-2.5">Site Code</th>
                      <th className="px-3 py-2.5">Institution Name</th>
                      <th className="px-3 py-2.5">City / State</th>
                      <th className="px-3 py-2.5">Principal Site Investigator</th>
                      <th className="px-3 py-2.5">Enrolled Subjects</th>
                      <th className="px-3 py-2.5">Site Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    <tr className="hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-semibold text-cyan-400">SITE-01</td>
                      <td className="px-3 py-2.5 text-white">All India Institute of Ayurveda (Apex Centre)</td>
                      <td className="px-3 py-2.5">New Delhi</td>
                      <td className="px-3 py-2.5 text-slate-200">Dr. Aanchal Singh</td>
                      <td className="px-3 py-2.5 font-semibold text-emerald-400">750 Patients</td>
                      <td className="px-3 py-2.5"><span className="text-emerald-400 font-medium">GCP Cleared</span></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-semibold text-cyan-400">SITE-02</td>
                      <td className="px-3 py-2.5 text-white">National Institute of Ayurveda (NIA)</td>
                      <td className="px-3 py-2.5">Jaipur, Rajasthan</td>
                      <td className="px-3 py-2.5 text-slate-200">Dr. Rajesh Varma</td>
                      <td className="px-3 py-2.5 font-semibold text-emerald-400">420 Patients</td>
                      <td className="px-3 py-2.5"><span className="text-emerald-400 font-medium">GCP Cleared</span></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-semibold text-cyan-400">SITE-03</td>
                      <td className="px-3 py-2.5 text-white">Faculty of Ayurveda, IMS BHU</td>
                      <td className="px-3 py-2.5">Varanasi, UP</td>
                      <td className="px-3 py-2.5 text-slate-200">Dr. S. K. Dwivedi</td>
                      <td className="px-3 py-2.5 font-semibold text-emerald-400">280 Patients</td>
                      <td className="px-3 py-2.5"><span className="text-emerald-400 font-medium">GCP Cleared</span></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-semibold text-cyan-400">SITE-04</td>
                      <td className="px-3 py-2.5 text-white">IPGT&RA, Gujarat Ayurved University</td>
                      <td className="px-3 py-2.5">Jamnagar, Gujarat</td>
                      <td className="px-3 py-2.5 text-slate-200">Dr. M. Patel</td>
                      <td className="px-3 py-2.5 font-semibold text-emerald-400">130 Patients</td>
                      <td className="px-3 py-2.5"><span className="text-emerald-400 font-medium">GCP Cleared</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // 4. Patient Recruitment
      case 'patients':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">Total Screened</span>
                <p className="text-xl font-bold text-white mt-1">1,842</p>
                <span className="text-[10px] text-slate-400">Informed Consent verified</span>
              </div>
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">Enrolled & Active</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">1,580</p>
                <span className="text-[10px] text-emerald-400">Active on protocol arm</span>
              </div>
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">Screen Failures</span>
                <p className="text-xl font-bold text-slate-400 mt-1">262</p>
                <span className="text-[10px] text-slate-500">Inclusion criteria exclusion</span>
              </div>
              <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
                <span className="text-[10px] text-slate-400">Retention Rate</span>
                <p className="text-xl font-bold text-cyan-400 mt-1">96.8%</p>
                <span className="text-[10px] text-emerald-400">Very low dropout index</span>
              </div>
            </div>

            <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-4 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-white">Subject Enrollment Register</h3>
                <p className="text-[10px] text-slate-400">De-identified patient demographic and dosing tracking</p>
              </div>
              <button
                onClick={onOpenAddPatient}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Enroll New Subject</span>
              </button>
            </div>
          </div>
        );

      // Default fallback for any other sidebar click (Pharmacovigilance, CTRI, CDISC, etc.)
      default:
        return (
          <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-white">Clinical Trial Data & Regulatory Registry</h3>
                <p className="text-[10px] text-slate-400">Neon PostgreSQL Connected • Real-time clinical records</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-[10px] font-semibold">
                Sync Status: Live
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead className="bg-[#102540] text-slate-400 uppercase text-[9px]">
                  <tr>
                    <th className="px-3 py-2.5">Study ID</th>
                    <th className="px-3 py-2.5">Protocol Title</th>
                    <th className="px-3 py-2.5">Phase</th>
                    <th className="px-3 py-2.5">Lead Site</th>
                    <th className="px-3 py-2.5">Subjects Enrolled</th>
                    <th className="px-3 py-2.5">CTRI ID</th>
                    <th className="px-3 py-2.5">Trial Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {clinicalStudies.map((s: any) => (
                    <tr key={s.studyId} className="hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-semibold text-cyan-400">{s.studyId}</td>
                      <td className="px-3 py-2.5 text-white font-medium max-w-sm">{s.title}</td>
                      <td className="px-3 py-2.5 text-slate-300">{s.phase}</td>
                      <td className="px-3 py-2.5 text-slate-300">AIIA Hospital, New Delhi</td>
                      <td className="px-3 py-2.5 font-semibold text-emerald-400">{s.enrolled} / {s.target}</td>
                      <td className="px-3 py-2.5 font-mono text-[10px] text-slate-400">{s.ctriNumber || 'CTRI/2025/VERIFIED'}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-emerald-400">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  const getHeaderInfo = () => {
    switch (tab) {
      case 'study-management':
        return { title: 'Study Management', icon: FolderKanban, desc: 'Central protocol tracking & multi-centric trial oversight' };
      case 'protocols':
        return { title: 'Protocol & Approvals', icon: FileCheck, desc: 'Institutional Ethics Committee (IEC) dossiers and amendments' };
      case 'sites':
        return { title: 'Site Management', icon: Building2, desc: 'Multi-centric AYUSH clinical trial site coordination' };
      case 'patients':
        return { title: 'Patient Recruitment & Enrollment', icon: UserPlus, desc: 'Subject screening, informed consent and retention' };
      case 'visits':
        return { title: 'Visits & Monitoring', icon: CalendarCheck, desc: 'Clinical monitoring schedules and interim assessments' };
      case 'data-mgmt':
        return { title: 'Electronic Data Management', icon: Database, desc: 'eCRF data entry, verification & audit trails' };
      case 'milestones':
        return { title: 'Study Milestones', icon: Flag, desc: 'Phase progression, timelines & target achievements' };
      case 'closeout':
        return { title: 'Trial Close-Out', icon: CheckCircle2, desc: 'Archiving, clinical study reports & regulatory submissions' };
      case 'safety-reporting':
        return { title: 'ADR / SAE Reporting (NPvCC)', icon: AlertTriangle, desc: 'Adverse drug reaction triage & 7-day expedited reports' };
      case 'signal-detection':
        return { title: 'Safety Signal Detection', icon: Radio, desc: 'Statistical disproportionality & pharmacovigilance signals' };
      case 'meddra':
        return { title: 'MedDRA / WHODrug Coding', icon: FileCode, desc: 'Standardized medical dictionary & herbal synonym mapping' };
      case 'pv-reports':
        return { title: 'Pharmacovigilance Aggregate Reports', icon: FileSpreadsheet, desc: 'PSUR, PBRER, and regulatory periodic safety filings' };
      case 'ctri':
        return { title: 'CTRI Registration & Compliance', icon: FileText, desc: 'Clinical Trials Registry - India submission tracking' };
      case 'gcp':
        return { title: 'GCP-ASU & ICMR Guidelines', icon: ShieldCheck, desc: 'Good Clinical Practice for Ayurveda, Siddha & Unani' };
      case 'ndct':
        return { title: 'New Drugs and Clinical Trials Rules 2019', icon: Scale, desc: 'Regulatory compliance matrix under CDSCO / Ministry of Ayush' };
      case 'audit':
        return { title: 'Audit & Inspection Readiness', icon: SearchCheck, desc: 'Trial Master File (TMF) and site audit trails' };
      case 'cdisc':
        return { title: 'CDISC Standards (SDTM / ODM)', icon: Cpu, desc: 'Interoperable clinical data standardization datasets' };
      case 'fhir':
        return { title: 'HL7 FHIR R4 Interoperability', icon: Share2, desc: 'Electronic Health Record (EHR) and ABHA digital connectivity' };
      default:
        return { title: 'Module Details', icon: FolderKanban, desc: 'AIIA Clinical Trials Management System' };
    }
  };

  const header = getHeaderInfo();
  const Icon = header.icon;

  return (
    <div className="space-y-4">
      {/* Top Banner with Back to Dashboard Button */}
      <div className="flex items-center justify-between bg-[#0a192c] border border-slate-800 rounded-xl p-4 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Dashboard</span>
          </button>
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">{header.title}</h1>
            <p className="text-[10px] text-slate-400">{header.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {tab === 'study-management' && (
            <button
              onClick={onOpenCreateStudy}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Study</span>
            </button>
          )}
          {tab === 'patients' && (
            <button
              onClick={onOpenAddPatient}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll Patient</span>
            </button>
          )}
          {tab === 'safety-reporting' && (
            <button
              onClick={onOpenReportSafety}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report ADR/SAE</span>
            </button>
          )}
        </div>
      </div>

      {/* Render Selected Module Content */}
      {renderModuleContent()}
    </div>
  );
}
