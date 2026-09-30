'use client';

import React from 'react';
import {
  LayoutDashboard,
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
  HeartHandshake
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function Sidebar({ activeTab = 'dashboard', setActiveTab }: SidebarProps) {
  const handleNav = (tabId: string) => {
    if (setActiveTab) {
      setActiveTab(tabId);
    }
  };

  return (
    <aside className="w-64 bg-[#050f1a] border-r border-slate-800/80 flex flex-col h-screen text-xs select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-sm shadow">
          अ
        </div>
        <div>
          <h2 className="font-bold text-white text-xs leading-tight">All India Institute of Ayurveda</h2>
          <p className="text-[10px] text-slate-400">अखिल भारतीय आयुर्वेद संस्थान</p>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {/* Main Dashboard Link */}
        <div>
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => handleNav('dashboard')}
            badge="Live"
          />
        </div>

        {/* Section 1: Clinical Trials */}
        <div className="space-y-1">
          <SectionHeader title="CLINICAL TRIALS" />
          <NavItem icon={FolderKanban} label="Study Management" active={activeTab === 'study-management'} onClick={() => handleNav('study-management')} />
          <NavItem icon={FileCheck} label="Protocol & Approvals" active={activeTab === 'protocols'} onClick={() => handleNav('protocols')} />
          <NavItem icon={Building2} label="Site Management" active={activeTab === 'sites'} onClick={() => handleNav('sites')} />
          <NavItem icon={UserPlus} label="Patient Recruitment" active={activeTab === 'patients'} onClick={() => handleNav('patients')} />
          <NavItem icon={CalendarCheck} label="Visits & Monitoring" active={activeTab === 'visits'} onClick={() => handleNav('visits')} />
          <NavItem icon={Database} label="Data Management" active={activeTab === 'data-mgmt'} onClick={() => handleNav('data-mgmt')} />
          <NavItem icon={Flag} label="Study Milestones" active={activeTab === 'milestones'} onClick={() => handleNav('milestones')} />
          <NavItem icon={CheckCircle2} label="Close-Out" active={activeTab === 'closeout'} onClick={() => handleNav('closeout')} />
        </div>

        {/* Section 2: Pharmacovigilance */}
        <div className="space-y-1">
          <SectionHeader title="PHARMACOVIGILANCE (NPVCC)" />
          <NavItem icon={AlertTriangle} label="ADR / SAE Reporting" active={activeTab === 'safety-reporting'} onClick={() => handleNav('safety-reporting')} />
          <NavItem icon={Radio} label="Safety Signal Detection" active={activeTab === 'signal-detection'} onClick={() => handleNav('signal-detection')} />
          <NavItem icon={FileCode} label="MedDRA / WHODrug" active={activeTab === 'meddra'} onClick={() => handleNav('meddra')} />
          <NavItem icon={FileSpreadsheet} label="PV Reports" active={activeTab === 'pv-reports'} onClick={() => handleNav('pv-reports')} />
        </div>

        {/* Section 3: Compliance & Regulatory */}
        <div className="space-y-1">
          <SectionHeader title="COMPLIANCE & REGULATORY" />
          <NavItem icon={FileText} label="CTRI Registration" active={activeTab === 'ctri'} onClick={() => handleNav('ctri')} />
          <NavItem icon={ShieldCheck} label="GCP-ASU & ICMR" active={activeTab === 'gcp'} onClick={() => handleNav('gcp')} />
          <NavItem icon={Scale} label="NDCT Rules 2019" active={activeTab === 'ndct'} onClick={() => handleNav('ndct')} />
          <NavItem icon={SearchCheck} label="Audit & Inspection" active={activeTab === 'audit'} onClick={() => handleNav('audit')} />
        </div>

        {/* Section 4: Data & Interoperability */}
        <div className="space-y-1">
          <SectionHeader title="DATA & INTEROPERABILITY" />
          <NavItem icon={Cpu} label="CDISC Data Standards" active={activeTab === 'cdisc'} onClick={() => handleNav('cdisc')} />
          <NavItem icon={Share2} label="HL7 FHIR Integration" active={activeTab === 'fhir'} onClick={() => handleNav('fhir')} />
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-3 border-t border-slate-800/80 bg-[#071322]">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Ayurveda for a Healthier Tomorrow</span>
        </div>
        <p className="text-[9px] text-slate-500 mt-0.5">Research • Safety • Global Trust</p>
      </div>
    </aside>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <p className="text-[9px] font-bold text-slate-500 uppercase px-2 pt-2 tracking-wider">{title}</p>;
}

function NavItem({ icon: Icon, label, active, onClick, badge }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
        active
          ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/30'
          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-2.5 truncate">
        <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
        <span className="truncate">{label}</span>
      </div>
      {badge && (
        <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.2 rounded border border-emerald-500/30">
          {badge}
        </span>
      )}
    </button>
  );
}