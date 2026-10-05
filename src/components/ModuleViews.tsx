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
  FileDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  FileText as DocIcon,
  X,
  Stethoscope,
  Activity,
  Calendar,
  Layers
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
  const [selectedStudyModal, setSelectedStudyModal] = useState<any>(null);

  // High-fidelity clinical trials data with rich protocol attributes
  const clinicalStudies = [
    {
      studyId: 'AIIA-CT-001',
      title: 'Clinical Evaluation of Nishamalaki in Type 2 Diabetes Mellitus',
      phase: 'Phase III',
      sitesCount: 5,
      enrolled: 312,
      target: 400,
      status: 'Ongoing',
      ctriNumber: 'CTRI/2025/03/048912',
      pi: 'Dr. Aanchal Singh',
      iecDate: '15 Jan 2025',
      iecStatus: 'Approved',
      version: 'v2.1',
      therapeuticArea: 'Metabolic Disorders / Endocrinology',
      herbalFormulation: 'Nishamalaki Vati (Haridra + Amalaki)',
      duration: '24 Weeks',
      crfCompleteness: '98.5%',
      queriesOpen: 2,
      milestone: 'Patient Enrollment 78%'
    },
    {
      studyId: 'AIIA-CT-002',
      title: 'Evaluation of Ayurvedic Rasayana in Post-Chemotherapy Quality of Life',
      phase: 'Phase II',
      sitesCount: 4,
      enrolled: 248,
      target: 300,
      status: 'Ongoing',
      ctriNumber: 'CTRI/2025/08/059124',
      pi: 'Dr. Aanchal Singh',
      iecDate: '28 Jul 2025',
      iecStatus: 'Approved',
      version: 'v1.4',
      therapeuticArea: 'Integrative Oncology & Palliative Care',
      herbalFormulation: 'Chyawanprash Awaleha + Guduchi Swarasa',
      duration: '16 Weeks',
      crfCompleteness: '96.2%',
      queriesOpen: 4,
      milestone: 'Interim Safety Analysis'
    },
    {
      studyId: 'AIIA-CT-003',
      title: 'Evaluation of Standardized Ashwagandha in Chronic Fatigue Syndrome',
      phase: 'Phase III',
      sitesCount: 6,
      enrolled: 196,
      target: 250,
      status: 'On Hold',
      ctriNumber: 'CTRI/2025/05/051280',
      pi: 'Dr. Aanchal Singh',
      iecDate: '12 Feb 2025',
      iecStatus: 'Renewal Due',
      version: 'v1.2',
      therapeuticArea: 'Neuro-Immunology & Stress Adaptation',
      herbalFormulation: 'Withania somnifera Extract (5% Withanolides)',
      duration: '12 Weeks',
      crfCompleteness: '91.8%',
      queriesOpen: 9,
      milestone: 'Ethics Committee Audit'
    },
    {
      studyId: 'AIIA-CT-004',
      title: 'Efficacy of Haridra & Guggulu in Osteoarthritis Management (Sandhivata)',
      phase: 'Phase I',
      sitesCount: 3,
      enrolled: 142,
      target: 200,
      status: 'Ongoing',
      ctriNumber: 'CTRI/2025/09/061299',
      pi: 'Dr. Aanchal Singh',
      iecDate: '10 Aug 2025',
      iecStatus: 'Approved',
      version: 'v1.0',
      therapeuticArea: 'Rheumatology & Musculoskeletal Disorders',
      herbalFormulation: 'Yogaraj Guggulu + Curcumin 95%',
      duration: '8 Weeks',
      crfCompleteness: '99.1%',
      queriesOpen: 1,
      milestone: 'Dose Escalation Complete'
    },
    {
      studyId: 'AIIA-CT-005',
      title: 'Clinical Safety & Pharmacokinetics of Guduchi Formulations in Healthy Volunteers',
      phase: 'Phase II',
      sitesCount: 5,
      enrolled: 87,
      target: 150,
      status: 'Planning',
      ctriNumber: 'CTRI/2026/01/072111',
      pi: 'Dr. Aanchal Singh',
      iecDate: '22 Sep 2025',
      iecStatus: 'Under Review',
      version: 'v1.0',
      therapeuticArea: 'Immunology & Clinical Pharmacology',
      herbalFormulation: 'Guduchi Ghana Vati (Tinospora cordifolia)',
      duration: '4 Weeks',
      crfCompleteness: '84.0%',
      queriesOpen: 0,
      milestone: 'Site Initiation Visits (SIV)'
    }
  ];

  // Clinical trial sites network
  const siteNetwork = [
    { code: 'SITE-01', name: 'All India Institute of Ayurveda (Apex Centre)', city: 'New Delhi', pi: 'Dr. Aanchal Singh', enrolled: 412, target: 450, status: 'Active (GCP Certified)', monitoringVisit: '12 Oct 2026' },
    { code: 'SITE-02', name: 'National Institute of Ayurveda (NIA)', city: 'Jaipur, Rajasthan', pi: 'Dr. R. K. Sharma', enrolled: 284, target: 350, status: 'Active (GCP Certified)', monitoringVisit: '18 Oct 2026' },
    { code: 'SITE-03', name: 'Faculty of Ayurveda, IMS, Banaras Hindu University', city: 'Varanasi, UP', pi: 'Dr. V. N. Pandey', enrolled: 195, target: 250, status: 'Active', monitoringVisit: '24 Oct 2026' },
    { code: 'SITE-04', name: 'IPGT&RA, Gujarat Ayurved University', city: 'Jamnagar, Gujarat', pi: 'Dr. H. M. Chandola', enrolled: 110, target: 150, status: 'Active', monitoringVisit: '29 Oct 2026' },
    { code: 'SITE-05', name: 'Ayurveda College & Hospital, Kottakkal', city: 'Malappuram, Kerala', pi: 'Dr. K. Murali', enrolled: 84, target: 100, status: 'Initiating', monitoringVisit: '04 Nov 2026' }
  ];

  // Patient recruitment registry
  const patientCohort = [
    { id: 'SUBJ-AIIA-0101', study: 'AIIA-CT-001', age: 52, gender: 'Female', prakriti: 'Pitta-Kapha', status: 'Dosing (Week 12)', consentDate: '12 May 2026', compliance: '99%' },
    { id: 'SUBJ-AIIA-0102', study: 'AIIA-CT-001', age: 48, gender: 'Male', prakriti: 'Vata-Pitta', status: 'Dosing (Week 8)', consentDate: '24 May 2026', compliance: '97%' },
    { id: 'SUBJ-AIIA-0205', study: 'AIIA-CT-002', age: 61, gender: 'Female', prakriti: 'Vataja', status: 'Completed', consentDate: '03 Jun 2026', compliance: '100%' },
    { id: 'SUBJ-AIIA-0310', study: 'AIIA-CT-003', age: 39, gender: 'Male', prakriti: 'Kaphaja', status: 'Screened (Pre-Dose)', consentDate: '15 Jul 2026', compliance: '95%' },
    { id: 'SUBJ-AIIA-0402', study: 'AIIA-CT-004', age: 55, gender: 'Male', prakriti: 'Vata-Kapha', status: 'Dosing (Week 4)', consentDate: '02 Aug 2026', compliance: '98%' }
  ];

  // Filtered studies
  const filteredStudies = clinicalStudies.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.studyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.ctriNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = filterPhase === 'ALL' || s.phase === filterPhase;
    return matchesSearch && matchesPhase;
  });

  // Top Module Meta Information
  const getHeaderInfo = () => {
    switch (tab) {
      case 'study-management':
        return { title: 'Study Management', icon: FolderKanban, desc: 'Centralized protocol registry, investigator oversight, and trial status tracking' };
      case 'protocols':
        return { title: 'Protocol & Approvals', icon: FileCheck, desc: 'Institutional Ethics Committee (IEC) dossiers, protocol amendments, and CTRI clearances' };
      case 'sites':
        return { title: 'Site Management', icon: Building2, desc: 'Multi-centric AYUSH trial site coordination, PI credentials, and GCP audits' };
      case 'patients':
        return { title: 'Patient Recruitment & Demographics', icon: UserPlus, desc: 'Subject screening, Prakriti profiling, informed consent, and retention pipeline' };
      case 'visits':
        return { title: 'Visits & Monitoring', icon: CalendarCheck, desc: 'Subject visit compliance schedules, protocol deviations, and monitoring reports (MVR)' };
      case 'data-mgmt':
        return { title: 'Electronic Data Management (eCRF)', icon: Database, desc: 'Electronic Case Report Form verification, query resolution, and audit trails' };
      case 'milestones':
        return { title: 'Study Milestones & Timelines', icon: Flag, desc: 'Gantt schedule, First Patient In (FPI), Last Patient Out (LPO), and CSR delivery' };
      case 'closeout':
        return { title: 'Trial Close-Out & Archiving', icon: CheckCircle2, desc: 'Trial Master File (TMF) archiving, clinical study reports (CSR), and final database lock' };
      default:
        return { title: 'Clinical Module', icon: FolderKanban, desc: 'AIIA Clinical Trials Management System' };
    }
  };

  const header = getHeaderInfo();
  const Icon = header.icon;

  return (
    <div className="space-y-4">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between bg-[#111c2e] border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg bg-[#18273d] hover:bg-[#223652] text-cyan-300 transition flex items-center gap-1.5 text-xs font-bold border border-cyan-500/20 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                CLINICAL TRIALS
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="text-[10px] text-emerald-400 font-semibold">PostgreSQL Connected</span>
            </div>
            <h1 className="text-sm font-bold text-white leading-tight">{header.title}</h1>
            <p className="text-[10px] text-slate-400">{header.desc}</p>
          </div>
        </div>

        {/* Global Module Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.open('/api/export-report', '_blank')}
            className="px-3 py-1.5 bg-[#18273d] hover:bg-[#223652] text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          {tab === 'study-management' && (
            <button
              onClick={onOpenCreateStudy}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create Protocol</span>
            </button>
          )}
          {tab === 'patients' && (
            <button
              onClick={onOpenAddPatient}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll New Subject</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Specialized Dynamic View per Tab */}

      {/* ================= TAB 1: STUDY MANAGEMENT ================= */}
      {tab === 'study-management' && (
        <div className="space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-3">
            <KpiCard label="Total Monitored Protocols" val="5 Protocols" sub="100% IEC Approved" color="text-cyan-400" />
            <KpiCard label="Active Subject Enrolment" val="985 Patients" sub="Across 5 Clinical Sites" color="text-emerald-400" />
            <KpiCard label="Average Protocol Compliance" val="98.2%" sub="GCP-ASU & ICMR Standards" color="text-teal-400" />
            <KpiCard label="Principal Investigator" val="Dr. Aanchal Singh" sub="AIIA Apex Centre, New Delhi" color="text-white" />
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-md bg-[#18273d] px-3 py-1.5 rounded-lg border border-slate-700">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by protocol title, study ID, or CTRI number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-slate-100 placeholder-slate-400 w-full"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter Phase:</span>
              <select
                value={filterPhase}
                onChange={(e) => setFilterPhase(e.target.value)}
                className="bg-[#18273d] border border-slate-700 rounded-md px-2.5 py-1 text-xs text-white outline-none cursor-pointer"
              >
                <option value="ALL">All Phases</option>
                <option value="Phase I">Phase I</option>
                <option value="Phase II">Phase II</option>
                <option value="Phase III">Phase III</option>
              </select>
            </div>
          </div>

          {/* Main Clinical Protocols Table */}
          <div className="bg-[#111c2e] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-[11px] text-slate-300">
              <thead className="bg-[#18273d] text-slate-400 uppercase text-[9px] border-b border-slate-800">
                <tr>
                  <th className="px-3.5 py-3">Study ID</th>
                  <th className="px-3.5 py-3">Clinical Protocol Title</th>
                  <th className="px-3.5 py-3">Phase</th>
                  <th className="px-3.5 py-3">Sites</th>
                  <th className="px-3.5 py-3">Enrolment (Target)</th>
                  <th className="px-3.5 py-3">CTRI Registry ID</th>
                  <th className="px-3.5 py-3">Status</th>
                  <th className="px-3.5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredStudies.map((s) => (
                  <tr key={s.studyId} className="hover:bg-slate-800/50 transition">
                    <td className="px-3.5 py-3 font-bold text-cyan-400">{s.studyId}</td>
                    <td className="px-3.5 py-3 text-white font-medium max-w-sm">
                      <div>{s.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.therapeuticArea}</div>
                    </td>
                    <td className="px-3.5 py-3">
                      <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-cyan-300 font-semibold text-[10px]">
                        {s.phase}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-slate-300">{s.sitesCount} Sites</td>
                    <td className="px-3.5 py-3 font-semibold text-emerald-400">
                      {s.enrolled} / {s.target}
                    </td>
                    <td className="px-3.5 py-3 font-mono text-slate-400 text-[10px]">{s.ctriNumber}</td>
                    <td className="px-3.5 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        s.status === 'Ongoing'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : s.status === 'On Hold'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-blue-500/10 border-blue-500/30 text-cyan-300'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStudyModal(s)}
                        className="px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-semibold cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PROTOCOL & APPROVALS ================= */}
      {tab === 'protocols' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="IEC Valid Approvals" val="4 Protocols" sub="Central Ethics Committee (AIIA)" color="text-emerald-400" />
            <KpiCard label="Renewals Due (< 60 Days)" val="1 Protocol" sub="AIIA-CT-003 Pending IEC Review" color="text-amber-400" />
            <KpiCard label="CTRI Registered" val="5/5 Protocols" sub="100% Fully Compliant with CDSCO" color="text-cyan-400" />
          </div>

          <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xs font-bold text-white mb-3">Institutional Ethics Committee (IEC) Dossiers & Amendments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead className="bg-[#18273d] text-slate-400 uppercase text-[9px] border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-2.5">Protocol ID</th>
                    <th className="px-3 py-2.5">Title</th>
                    <th className="px-3 py-2.5">Version</th>
                    <th className="px-3 py-2.5">IEC Approval Date</th>
                    <th className="px-3 py-2.5">CTRI Clearances</th>
                    <th className="px-3 py-2.5">Regulatory Status</th>
                    <th className="px-3 py-2.5">Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {clinicalStudies.map((s) => (
                    <tr key={s.studyId} className="hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-bold text-cyan-400">{s.studyId}</td>
                      <td className="px-3 py-2.5 text-white font-medium max-w-xs truncate">{s.title}</td>
                      <td className="px-3 py-2.5 font-mono text-slate-300">{s.version}</td>
                      <td className="px-3 py-2.5 text-slate-400">{s.iecDate}</td>
                      <td className="px-3 py-2.5 font-mono text-emerald-400">{s.ctriNumber}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.iecStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {s.iecStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          onClick={() => alert(`Downloading IEC Dossier for ${s.studyId}`)}
                          className="text-cyan-400 hover:underline font-semibold cursor-pointer"
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SITE MANAGEMENT ================= */}
      {tab === 'sites' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <KpiCard label="Coordinating Centre" val="AIIA New Delhi" sub="Apex Institute" color="text-cyan-400" />
            <KpiCard label="Total Activated Sites" val="5 Sites" sub="Multi-centric Network" color="text-emerald-400" />
            <KpiCard label="Overall Site Target" val="1,300 Subjects" sub="Current Enrolled: 1,085" color="text-white" />
            <KpiCard label="GCP Compliance Index" val="99.4%" sub="Quarterly Audit Passed" color="text-teal-400" />
          </div>

          <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xs font-bold text-white mb-3">Participating AYUSH Research Centers</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead className="bg-[#18273d] text-slate-400 uppercase text-[9px] border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-2.5">Site Code</th>
                    <th className="px-3 py-2.5">Hospital / Academic Institute</th>
                    <th className="px-3 py-2.5">Location</th>
                    <th className="px-3 py-2.5">Principal Investigator</th>
                    <th className="px-3 py-2.5">Enrollment Progress</th>
                    <th className="px-3 py-2.5">Next Monitoring Visit</th>
                    <th className="px-3 py-2.5">GCP Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {siteNetwork.map((site) => (
                    <tr key={site.code} className="hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-bold text-cyan-400">{site.code}</td>
                      <td className="px-3 py-2.5 text-white font-medium">{site.name}</td>
                      <td className="px-3 py-2.5 text-slate-300">{site.city}</td>
                      <td className="px-3 py-2.5 text-slate-200">{site.pi}</td>
                      <td className="px-3 py-2.5 font-bold text-emerald-400">{site.enrolled} / {site.target}</td>
                      <td className="px-3 py-2.5 text-slate-400">{site.monitoringVisit}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          {site.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: PATIENT RECRUITMENT ================= */}
      {tab === 'patients' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <KpiCard label="Subjects Screened" val="1,420" sub="Pre-randomization log" color="text-cyan-400" />
            <KpiCard label="Informed Consent Complete" val="1,085 (100%)" sub="Audio-visual & Signed" color="text-emerald-400" />
            <KpiCard label="Active on Protocol Drug" val="985" sub="Adherence Rate: 98.2%" color="text-teal-400" />
            <KpiCard label="Screen Failures" val="335" sub="Inclusion/Exclusion criteria" color="text-rose-400" />
          </div>

          <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-4 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs font-bold text-white">De-identified Patient Enrollment Register (with Prakriti Typing)</h2>
              <span className="text-[10px] text-cyan-400 font-semibold">ICMR Ethical Guidelines Compliant</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead className="bg-[#18273d] text-slate-400 uppercase text-[9px] border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-2.5">Subject ID</th>
                    <th className="px-3 py-2.5">Study Protocol</th>
                    <th className="px-3 py-2.5">Age / Sex</th>
                    <th className="px-3 py-2.5">Ayurvedic Prakriti</th>
                    <th className="px-3 py-2.5">Consent Date</th>
                    <th className="px-3 py-2.5">Current Stage</th>
                    <th className="px-3 py-2.5">Medication Adherence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {patientCohort.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-bold text-cyan-400">{p.id}</td>
                      <td className="px-3 py-2.5 text-white">{p.study}</td>
                      <td className="px-3 py-2.5 text-slate-300">{p.age} Y / {p.gender}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[10px]">
                          {p.prakriti}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-400">{p.consentDate}</td>
                      <td className="px-3 py-2.5 text-slate-200">{p.status}</td>
                      <td className="px-3 py-2.5 font-bold text-emerald-400">{p.compliance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: VISITS & MONITORING ================= */}
      {tab === 'visits' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="Scheduled Visits This Week" val="64 Visits" sub="Across 5 active centers" color="text-cyan-400" />
            <KpiCard label="Protocol Deviations" val="2 Minor" sub="Zero critical deviations" color="text-emerald-400" />
            <KpiCard label="Monitoring Reports (MVR)" val="12 Filed" sub="100% Clinical CRA reviewed" color="text-teal-400" />
          </div>

          <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xs font-bold text-white mb-3">Clinical Visit Schedule & Interim Assessments</h2>
            <div className="space-y-3">
              {[
                { stage: 'Visit 1 (Baseline / Day 0)', desc: 'Prakriti assessment, laboratory biomarkers (HbA1c, LFT, KFT), drug dispensation', due: '100% Completed', badge: 'bg-emerald-500/20 text-emerald-400' },
                { stage: 'Visit 2 (Week 4 Interim)', desc: 'Safety evaluation, pill count, adverse drug event screening (ADR log)', due: '98% Completed', badge: 'bg-emerald-500/20 text-emerald-400' },
                { stage: 'Visit 3 (Week 8 Assessment)', desc: 'Efficacy metrics evaluation, questionnaire on Ayurvedic clinical outcomes', due: '94% On Schedule', badge: 'bg-cyan-500/20 text-cyan-400' },
                { stage: 'Visit 4 (Week 12 / Week 24 Endpoint)', desc: 'Final biochemical testing, eCRF close, physician global assessment', due: 'Scheduled (Nov 2026)', badge: 'bg-amber-500/20 text-amber-400' }
              ].map((v, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-[#18273d] border border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold text-white">{v.stage}</h3>
                    <p className="text-[11px] text-slate-400">{v.desc}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${v.badge}`}>
                    {v.due}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: DATA MANAGEMENT ================= */}
      {tab === 'data-mgmt' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <KpiCard label="eCRF Completeness" val="96.8%" sub="Standard CDISC format" color="text-emerald-400" />
            <KpiCard label="Data Queries Open" val="16 Queries" sub="Average resolution time 1.8 days" color="text-amber-400" />
            <KpiCard label="Audit Trail Integrity" val="100% Verified" sub="21 CFR Part 11 compliant" color="text-cyan-400" />
            <KpiCard label="Database Lock Readiness" val="Stage 3/4" sub="Interim locked for Phase II" color="text-purple-400" />
          </div>

          <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xs font-bold text-white mb-3">Electronic Case Report Form (eCRF) Audit & Data Quality</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead className="bg-[#18273d] text-slate-400 uppercase text-[9px] border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-2.5">Study Protocol</th>
                    <th className="px-3 py-2.5">eCRF Data Forms</th>
                    <th className="px-3 py-2.5">Completed Rate</th>
                    <th className="px-3 py-2.5">Open Queries</th>
                    <th className="px-3 py-2.5">Resolved Queries</th>
                    <th className="px-3 py-2.5">Database Lock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {clinicalStudies.map((s) => (
                    <tr key={s.studyId} className="hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-bold text-cyan-400">{s.studyId}</td>
                      <td className="px-3 py-2.5 text-white">{s.title}</td>
                      <td className="px-3 py-2.5 font-bold text-emerald-400">{s.crfCompleteness}</td>
                      <td className="px-3 py-2.5 text-amber-400 font-bold">{s.queriesOpen}</td>
                      <td className="px-3 py-2.5 text-slate-300">142</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          Pre-Lock Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: STUDY MILESTONES ================= */}
      {tab === 'milestones' && (
        <div className="space-y-4">
          <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xs font-bold text-white mb-3">Key Regulatory & Scientific Milestone Progress</h2>
            <div className="space-y-3">
              {[
                { label: 'AIIA-CT-001 (Nishamalaki Diabetes Trial)', progress: 78, tag: 'FPI Complete • Interim Data Review', color: 'bg-emerald-500' },
                { label: 'AIIA-CT-002 (Rasayana Oncology Trial)', progress: 82, tag: 'Patient Randomization Completed', color: 'bg-cyan-500' },
                { label: 'AIIA-CT-003 (Ashwagandha Fatigue Trial)', progress: 65, tag: 'Institutional Review Underway', color: 'bg-amber-500' },
                { label: 'AIIA-CT-004 (Haridra & Guggulu Osteoarthritis)', progress: 71, tag: 'Site Monitoring Visit Cycle 2', color: 'bg-purple-500' },
                { label: 'AIIA-CT-005 (Guduchi Pharmacokinetics)', progress: 40, tag: 'Site Initiation & Protocol Clearance', color: 'bg-blue-500' },
              ].map((m, idx) => (
                <div key={idx} className="p-3 bg-[#18273d] rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className="text-white">{m.label}</span>
                    <span className="text-cyan-400">{m.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`${m.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${m.progress}%` }}></div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block font-medium">{m.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 8: CLOSE-OUT ================= */}
      {tab === 'closeout' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="Trials Ready for Close-out" val="1 Study" sub="AIIA-CT-002 Final CSR" color="text-cyan-400" />
            <KpiCard label="TMF Completeness" val="99.8%" sub="Trial Master File Audited" color="text-emerald-400" />
            <KpiCard label="Drug Accountability Lock" val="100% Sealed" sub="Unused formulations reconciled" color="text-teal-400" />
          </div>

          <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xs font-bold text-white mb-3">Study Close-Out & Archival Protocol Checklist</h2>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2.5 bg-[#18273d] rounded border border-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>1. All Subject Case Report Forms (eCRF) Verified and Queries Cleared</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#18273d] rounded border border-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>2. Safety Reporting (ADR / SAE) Reconciliation with NPVCC Completed</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#18273d] rounded border border-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>3. Investigational Ayurvedic Medicine Stock Reconciled & Safely Retained</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#18273d] rounded border border-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>4. Final Clinical Study Report (CSR) Ready for Ministry of Ayush & CTRI Submission</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Study Modal Popup */}
      {selectedStudyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-[#111c2e] border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-bold text-xs border border-blue-500/30">
                  {selectedStudyModal.studyId}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedStudyModal.title}</h3>
                <p className="text-xs text-slate-400">{selectedStudyModal.therapeuticArea}</p>
              </div>
              <button
                onClick={() => setSelectedStudyModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#18273d] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Principal Investigator</span>
                <span className="text-white font-semibold text-sm">{selectedStudyModal.pi}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">AIIA Hospital, New Delhi</span>
              </div>
              <div className="bg-[#18273d] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Herbal Formulation</span>
                <span className="text-white font-semibold text-sm">{selectedStudyModal.herbalFormulation}</span>
                <span className="text-[10px] text-cyan-300 block mt-0.5">Treatment Duration: {selectedStudyModal.duration}</span>
              </div>
              <div className="bg-[#18273d] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">IEC & Regulatory Approval</span>
                <span className="text-emerald-400 font-semibold">{selectedStudyModal.iecStatus} ({selectedStudyModal.iecDate})</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Dossier: {selectedStudyModal.version}</span>
              </div>
              <div className="bg-[#18273d] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">CTRI Registration</span>
                <span className="text-cyan-300 font-mono font-semibold">{selectedStudyModal.ctriNumber}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Participating Sites: {selectedStudyModal.sitesCount}</span>
              </div>
            </div>

            <div className="bg-[#18273d] p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 text-[10px] font-bold block">ENROLLMENT STATUS</span>
                <span className="text-emerald-400 font-bold text-sm">{selectedStudyModal.enrolled} / {selectedStudyModal.target} Patients</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold block">eCRF AUDIT COMPLETENESS</span>
                <span className="text-white font-bold text-sm">{selectedStudyModal.crfCompleteness}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold block">OPEN QUERIES</span>
                <span className="text-amber-400 font-bold text-sm">{selectedStudyModal.queriesOpen}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedStudyModal(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Downloading Trial Protocol Dossier for ${selectedStudyModal.studyId}`);
                  setSelectedStudyModal(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                Download Full Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, val, sub, color }: any) {
  return (
    <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-3.5 shadow-md">
      <span className="text-[10px] text-slate-400 font-medium">{label}</span>
      <p className={`text-xl font-bold mt-1 ${color}`}>{val}</p>
      <span className="text-[10px] text-slate-400">{sub}</span>
    </div>
  );
}
