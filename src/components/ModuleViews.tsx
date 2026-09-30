'use client';

import React from 'react';
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
  Plus
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
  const getHeader = () => {
    switch (tab) {
      case 'study-management':
        return { title: 'Study Management', icon: FolderKanban, desc: 'Central protocol tracking & active trial oversight' };
      case 'protocols':
        return { title: 'Protocol & Approvals', icon: FileCheck, desc: 'Institutional Ethics Committee (IEC) documentation' };
      case 'sites':
        return { title: 'Site Management', icon: Building2, desc: 'Multi-centric AYUSH trial site coordination' };
      case 'patients':
        return { title: 'Patient Recruitment & Enrollment', icon: UserPlus, desc: 'Subject screening, consent & retention status' };
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
        return { title: 'New Drugs and Clinical Trials Rules 2019', icon: Scale, desc: 'Regulatory compliance matrix under CDSCO / Ministry of AYUSH' };
      case 'audit':
        return { title: 'Audit & Inspection Readiness', icon: SearchCheck, desc: 'Trial Master File (TMF) and site audit trails' };
      case 'cdisc':
        return { title: 'CDISC Standards (SDTM / ODM)', icon: Cpu, desc: 'Interoperable clinical data standardization datasets' };
      case 'fhir':
        return { title: 'HL7 FHIR R4 Interoperability', icon: Share2, desc: 'Electronic Health Record (EHR) and ABHA digital connectivity' };
      default:
        return { title: 'Module Details', icon: FolderKanban, desc: 'AIIA CTMS Clinical Trial System' };
    }
  };

  const header = getHeader();
  const Icon = header.icon;

  return (
    <div className="space-y-4">
      {/* Top Banner for Module */}
      <div className="flex items-center justify-between bg-[#0a192c] border border-slate-800 rounded-xl p-4 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
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
              <span>New Study</span>
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

      {/* Main Table */}
      <div className="bg-[#0a192c] border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-white">Records & Synchronized Data</span>
          <span className="text-[10px] text-emerald-400 font-medium">PostgreSQL Neon Connected</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] text-slate-300">
            <thead className="bg-[#11243c] text-slate-400 uppercase text-[9px]">
              <tr>
                <th className="px-3 py-2">Study ID</th>
                <th className="px-3 py-2">Protocol Title</th>
                <th className="px-3 py-2">Phase</th>
                <th className="px-3 py-2">Sites</th>
                <th className="px-3 py-2">Enrollment Status</th>
                <th className="px-3 py-2">CTRI Reference</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {studies.map((row: any) => (
                <tr key={row.studyId} className="hover:bg-slate-800/40">
                  <td className="px-3 py-2.5 font-medium text-cyan-400">{row.studyId}</td>
                  <td className="px-3 py-2.5 text-white">{row.title}</td>
                  <td className="px-3 py-2.5">{row.phase}</td>
                  <td className="px-3 py-2.5">{row.sitesCount} Sites</td>
                  <td className="px-3 py-2.5">{`${row.enrolled} / ${row.target}`}</td>
                  <td className="px-3 py-2.5 text-slate-400">{row.ctriNumber || 'CTRI/2026/09/PENDING'}</td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-emerald-400">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
