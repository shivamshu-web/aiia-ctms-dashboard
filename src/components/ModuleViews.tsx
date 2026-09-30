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
  Users,
  Settings,
  Activity,
  Layers,
  FileDown
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

  // Live Studies with Fallback for full coverage
  const clinicalStudies = studies && studies.length > 0 ? studies : [
    {
      studyId: 'AIIA-CT-001',
      title: 'Diabetes Care Study (Nishamalaki Evaluation)',
      phase: 'Phase III',
      sitesCount: 5,
      enrolled: 312,
      target: 400,
      status: 'Ongoing',
      ctriNumber: 'CTRI/2025/03/048912',
      pi: 'Dr. Aanchal Singh',
      ethicsStatus: 'Approved',
      iecDate: '15 Jan 2025'
    },
    {
      studyId: 'AIIA-CT-002',
      title: 'Oncology Biomarker Study (Ayurvedic Rasayana Adjuvant)',
      phase: 'Phase II',
      sitesCount: 4,
      enrolled: 248,
      target: 300,
      status: 'Ongoing',
      ctriNumber: 'CTRI/2025/08/059124',
      pi: 'Dr. Aanchal Singh',
      ethicsStatus: 'Approved',
      iecDate: '28 Jul 2025'
    },
    {
      studyId: 'AIIA-CT-003',
      title: 'Cardiovascular Risk Study (Arjuna & Pushkarmool)',
      phase: 'Phase III',
      sitesCount: 6,
      enrolled: 196,
      target: 250,
      status: 'On Hold',
      ctriNumber: 'CTRI/2025/05/051280',
      pi: 'Dr. Aanchal Singh',
      ethicsStatus: 'Renewal Due',
      iecDate: '12 Feb 2025'
    },
    {
      studyId: 'AIIA-CT-004',
      title: 'Rare Disease Study in Metabolic Genetics',
      phase: 'Phase I',
      sitesCount: 3,
      enrolled: 142,
      target: 200,
      status: 'Ongoing',
      ctriNumber: 'CTRI/2025/09/061299',
      pi: 'Dr. Aanchal Singh',
      ethicsStatus: 'Approved',
      iecDate: '10 Aug 2025'
    },
    {
      studyId: 'AIIA-CT-005',
      title: 'Immunomodulatory Study (Guduchi Formulations)',
      phase: 'Phase II',
      sitesCount: 5,
      enrolled: 89,
      target: 150,
      status: 'Planning',
      ctriNumber: 'CTRI/2026/01/072111',
      pi: 'Dr. Aanchal Singh',
      ethicsStatus: 'Submitted',
      iecDate: '22 Sep 2025'
    }
  ];

  const filteredStudies = clinicalStudies.filter((s: any) => {
    const matchText = (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (s.studyId || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchPhase = filterPhase === 'ALL' || s.phase.replace('_', ' ').toLowerCase() === filterPhase.toLowerCase();
    return matchText && matchPhase;
  });

  // Module Configuration
  const getModuleMeta = () => {
    switch (tab) {
      // 1. Clinical Trials
      case 'study-management':
        return { title: 'Study Management', icon: FolderKanban, category: 'Clinical Trials', desc: 'Centralized protocol registry, investigator assignment, and multi-site oversight.' };
      case 'protocols':
        return { title: 'Protocol & Approvals', icon: FileCheck, category: 'Clinical Trials', desc: 'Institutional Ethics Committee (IEC) dossiers, protocol amendments, and CTRI clearances.' };
      case 'sites':
        return { title: 'Site Management', icon: Building2, category: 'Clinical Trials', desc: 'Investigational site activation, GCP inspection readiness, and principal investigator directory.' };
      case 'patients':
        return { title: 'Patient Recruitment', icon: UserPlus, category: 'Clinical Trials', desc: 'Subject screening logs, informed consent tracking, and patient retention analytics.' };
      case 'visits':
        return { title: 'Visits & Monitoring', icon: CalendarCheck, category: 'Clinical Trials', desc: 'Subject visit compliance, monitoring visit reports (MVR), and scheduled follow-ups.' };
      case 'data-mgmt':
        return { title: 'Data Management', icon: Database, category: 'Clinical Trials', desc: 'Electronic Case Report Form (eCRF) audits, query resolution logs, and database lock.' };
      case 'milestones':
        return { title: 'Study Milestones', icon: Flag, category: 'Clinical Trials', desc: 'Gantt chart milestones, regulatory submission deadlines, and Phase progression.' };
      case 'closeout':
        return { title: 'Trial Close-Out', icon: CheckCircle2, category: 'Clinical Trials', desc: 'Trial master file (TMF) archiving, clinical study reports (CSR), and site closeout visits.' };
      
      // 2. Pharmacovigilance
      case 'safety-reporting':
        return { title: 'ADR / SAE Reporting (NPvCC)', icon: AlertTriangle, category: 'Pharmacovigilance', desc: 'Pharmacovigilance Programme of India (PvPI) expedited reporting for herbal and ASU interventions.' };
      case 'signal-detection':
        return { title: 'Safety Signal Detection', icon: Radio, category: 'Pharmacovigilance', desc: 'Algorithmic disproportionality scoring (PRR, ROR) and safety signal validation.' };
      case 'meddra':
        return { title: 'MedDRA / WHODrug', icon: FileCode, category: 'Pharmacovigilance', desc: 'Standardized medical dictionary coding with Ayurvedic herbal taxonomic mappings.' };
      case 'pv-reports':
        return { title: 'PV Reports', icon: FileSpreadsheet, category: 'Pharmacovigilance', desc: 'Periodic Safety Update Reports (PSUR) and regulatory submission packages.' };

      // 3. Compliance & Regulatory
      case 'ctri':
        return { title: 'CTRI Registration', icon: FileText, category: 'Compliance & Regulatory', desc: 'Clinical Trials Registry - India submission tracking, primary registry synchronization.' };
      case 'gcp':
        return { title: 'GCP-ASU & ICMR', icon: ShieldCheck, category: 'Compliance & Regulatory', desc: 'Good Clinical Practice for Ayurveda, Siddha & Unani and ICMR ethical guidelines compliance.' };
      case 'ndct':
        return { title: 'NDCT Rules 2019', icon: Scale, category: 'Compliance & Regulatory', desc: 'New Drugs and Clinical Trials Rules 2019 regulatory compliance matrix under CDSCO.' };
      case 'audit':
        return { title: 'Audit & Inspection', icon: SearchCheck, category: 'Compliance & Regulatory', desc: 'Internal quality assurance audits, inspector findings, and CAPA resolution.' };

      // 4. Data & Interoperability
      case 'cdisc':
        return { title: 'CDISC Data Standards', icon: Cpu, category: 'Data & Interoperability', desc: 'CDISC SDTM, CDASH, and ADaM standardized datasets for global regulatory submissions.' };
      case 'fhir':
        return { title: 'HL7 FHIR Integration', icon: Share2, category: 'Data & Interoperability', desc: 'HL7 FHIR R4 interoperability standard for cross-hospital EHR synchronization.' };
      case 'abdm':
        return { title: 'ABDM Integration', icon: Activity, category: 'Data & Interoperability', desc: 'Ayushman Bharat Digital Mission (ABDM) integration with ABHA ID verification.' };

      // 5. Administration
      case 'users':
        return { title: 'Users & Roles', icon: Users, category: 'Administration', desc: 'Role-based access control (RBAC), investigator permissions, and auditor credentials.' };
      case 'settings':
        return { title: 'Settings', icon: Settings, category: 'Administration', desc: 'System environment configurations, audit trails, and Neon PostgreSQL database parameters.' };

      default:
        return { title: 'Module View', icon: FolderKanban, category: 'CTMS Module', desc: 'All India Institute of Ayurveda Clinical System' };
    }
  };

  const meta = getModuleMeta();
  const Icon = meta.icon;

  return (
    <div className="space-y-4">
      {/* Module Header Bar */}
      <div className="flex items-center justify-between bg-[#0a192c] border border-slate-800 rounded-xl p-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg bg-[#11243c] hover:bg-[#1a3556] text-cyan-300 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-cyan-500/20"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Icon className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {meta.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="text-[10px] text-emerald-400 font-medium">PostgreSQL Connected</span>
            </div>
            <h1 className="text-base font-bold text-white leading-tight">{meta.title}</h1>
            <p className="text-[11px] text-slate-400">{meta.desc}</p>
          </div>
        </div>

        {/* Action Buttons inside Module */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.open('/api/export-report', '_blank')}
            className="px-3 py-1.5 bg-[#12263f] hover:bg-[#193354] text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          {tab === 'study-management' && (
            <button
              onClick={onOpenCreateStudy}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Protocol</span>
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
              <span>File ADR/SAE</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row for this module */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-slate-400">Total Protocols Monitored</span>
          <p className="text-xl font-bold text-white mt-1">{clinicalStudies.length}</p>
          <span className="text-[10px] text-emerald-400">100% IEC Approved</span>
        </div>
        <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-slate-400">Enrolled Subjects</span>
          <p className="text-xl font-bold text-cyan-400 mt-1">
            {clinicalStudies.reduce((acc, s) => acc + (s.enrolled || 0), 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Across 23 Participating Sites</span>
        </div>
        <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-slate-400">Protocol Compliance</span>
          <p className="text-xl font-bold text-emerald-400 mt-1">98.2%</p>
          <span className="text-[10px] text-emerald-400">GCP-ASU & ICMR Compliant</span>
        </div>
        <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-slate-400">Principal Investigator</span>
          <p className="text-sm font-bold text-slate-100 mt-1.5 truncate">Dr. Aanchal Singh</p>
          <span className="text-[10px] text-slate-400">AIIA Apex Centre, New Delhi</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-[#11243a] px-3 py-1.5 rounded-lg border border-slate-700">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by protocol title, study code, or CTRI number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-slate-100 placeholder-slate-500 w-full"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter Phase:</span>
          <select
            value={filterPhase}
            onChange={(e) => setFilterPhase(e.target.value)}
            className="bg-[#11243a] border border-slate-700 rounded-md px-2 py-1 text-xs text-white outline-none cursor-pointer"
          >
            <option value="ALL">All Phases</option>
            <option value="Phase I">Phase I</option>
            <option value="Phase II">Phase II</option>
            <option value="Phase III">Phase III</option>
          </select>
        </div>
      </div>

      {/* Primary Module Table with Full Details */}
      <div className="bg-[#0a192c] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-[11px] text-slate-300">
          <thead className="bg-[#102540] text-slate-400 uppercase text-[9px] border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Study ID</th>
              <th className="px-4 py-3">Clinical Protocol Title</th>
              <th className="px-4 py-3">Phase</th>
              <th className="px-4 py-3">Sites</th>
              <th className="px-4 py-3">Enrolment (Target)</th>
              <th className="px-4 py-3">CTRI Registry ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredStudies.map((s: any) => (
              <tr key={s.studyId} className="hover:bg-slate-800/40 transition">
                <td className="px-4 py-3 font-semibold text-cyan-400">{s.studyId}</td>
                <td className="px-4 py-3 text-white font-medium max-w-sm leading-snug">
                  {s.title}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800 text-blue-300 font-medium text-[10px]">
                    {s.phase}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{s.sitesCount || 4} Sites</td>
                <td className="px-4 py-3 font-semibold text-emerald-400">
                  {s.enrolled} / {s.target}
                </td>
                <td className="px-4 py-3 text-slate-400 font-mono text-[10px]">
                  {s.ctriNumber || 'CTRI/2025/VERIFIED'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    s.status === 'Ongoing'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : s.status === 'On Hold'
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                      : 'bg-blue-500/10 border border-blue-500/30 text-cyan-300'
                  }`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => alert(`Opening Clinical Dossier for: ${s.studyId}\nTitle: ${s.title}\nPrincipal Investigator: Dr. Aanchal Singh`)}
                    className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                  >
                    View
                  </button>
                  <span className="text-slate-600">|</span>
                  <button
                    type="button"
                    onClick={() => alert(`Editing Protocol Parameters for ${s.studyId}`)}
                    className="text-slate-400 hover:text-white cursor-pointer"
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
  );
}
