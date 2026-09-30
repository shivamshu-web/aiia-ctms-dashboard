'use client';

import React from 'react';
import {
  Leaf,
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
  Activity,
  Users,
  Settings,
  HeartHandshake
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  darkMode?: boolean;
}

export default function Sidebar({ activeTab = 'dashboard', setActiveTab, darkMode = false }: SidebarProps) {
  const handleNav = (tabId: string) => {
    if (setActiveTab) {
      setActiveTab(tabId);
    }
  };

  return (
    <aside className={`w-64 border-r flex flex-col h-screen text-xs select-none transition-colors duration-300 ${
      darkMode ? 'bg-[#07131e] border-slate-800/90 text-slate-300' : 'bg-[#06241b] border-[#0a382b] text-emerald-100'
    }`}>
      {/* Brand Header */}
      <div className={`p-4 border-b flex items-center gap-3 ${
        darkMode ? 'border-slate-800 bg-[#0c1a29]' : 'border-[#0a382b] bg-[#082e22]'
      }`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-400/50 flex items-center justify-center text-white shadow-lg shadow-emerald-950/60 flex-shrink-0">
          <Leaf className="w-5 h-5 fill-white/20 text-white" />
        </div>
        <div>
          <h2 className="font-extrabold text-white text-xs leading-tight">All India Institute of Ayurveda</h2>
          <p className="text-[10px] text-emerald-400 font-semibold">Ministry of Ayush • Govt. of India</p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {/* Main Dashboard */}
        <div>
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => handleNav('dashboard')}
            badge="Live"
            darkMode={darkMode}
          />
        </div>

        {/* Section 1: Clinical Trials */}
        <div className="space-y-0.5">
          <SectionHeader title="CLINICAL TRIALS" darkMode={darkMode} />
          <NavItem icon={FolderKanban} label="Study Management" active={activeTab === 'study-management'} onClick={() => handleNav('study-management')} darkMode={darkMode} />
          <NavItem icon={FileCheck} label="Protocol & Approvals" active={activeTab === 'protocols'} onClick={() => handleNav('protocols')} darkMode={darkMode} />
          <NavItem icon={Building2} label="Site Management" active={activeTab === 'sites'} onClick={() => handleNav('sites')} darkMode={darkMode} />
          <NavItem icon={UserPlus} label="Patient Recruitment" active={activeTab === 'patients'} onClick={() => handleNav('patients')} darkMode={darkMode} />
          <NavItem icon={CalendarCheck} label="Visits & Monitoring" active={activeTab === 'visits'} onClick={() => handleNav('visits')} darkMode={darkMode} />
          <NavItem icon={Database} label="Data Management" active={activeTab === 'data-mgmt'} onClick={() => handleNav('data-mgmt')} darkMode={darkMode} />
          <NavItem icon={Flag} label="Study Milestones" active={activeTab === 'milestones'} onClick={() => handleNav('milestones')} darkMode={darkMode} />
          <NavItem icon={CheckCircle2} label="Close-Out" active={activeTab === 'closeout'} onClick={() => handleNav('closeout')} darkMode={darkMode} />
        </div>

        {/* Section 2: Pharmacovigilance */}
        <div className="space-y-0.5">
          <SectionHeader title="PHARMACOVIGILANCE (NPVCC)" darkMode={darkMode} />
          <NavItem icon={AlertTriangle} label="ADR / SAE Reporting" active={activeTab === 'safety-reporting'} onClick={() => handleNav('safety-reporting')} darkMode={darkMode} />
          <NavItem icon={Radio} label="Safety Signal Detection" active={activeTab === 'signal-detection'} onClick={() => handleNav('signal-detection')} darkMode={darkMode} />
          <NavItem icon={FileCode} label="MedDRA / WHODrug" active={activeTab === 'meddra'} onClick={() => handleNav('meddra')} darkMode={darkMode} />
          <NavItem icon={FileSpreadsheet} label="PV Reports" active={activeTab === 'pv-reports'} onClick={() => handleNav('pv-reports')} darkMode={darkMode} />
        </div>

        {/* Section 3: Compliance & Regulatory */}
        <div className="space-y-0.5">
          <SectionHeader title="COMPLIANCE & REGULATORY" darkMode={darkMode} />
          <NavItem icon={FileText} label="CTRI Registration" active={activeTab === 'ctri'} onClick={() => handleNav('ctri')} darkMode={darkMode} />
          <NavItem icon={ShieldCheck} label="GCP-ASU & ICMR" active={activeTab === 'gcp'} onClick={() => handleNav('gcp')} darkMode={darkMode} />
          <NavItem icon={Scale} label="NDCT Rules 2019" active={activeTab === 'ndct'} onClick={() => handleNav('ndct')} darkMode={darkMode} />
          <NavItem icon={SearchCheck} label="Audit & Inspection" active={activeTab === 'audit'} onClick={() => handleNav('audit')} darkMode={darkMode} />
        </div>

        {/* Section 4: Data & Interoperability */}
        <div className="space-y-0.5">
          <SectionHeader title="DATA & INTEROPERABILITY" darkMode={darkMode} />
          <NavItem icon={Cpu} label="CDISC Data Standards" active={activeTab === 'cdisc'} onClick={() => handleNav('cdisc')} darkMode={darkMode} />
          <NavItem icon={Share2} label="HL7 FHIR Integration" active={activeTab === 'fhir'} onClick={() => handleNav('fhir')} darkMode={darkMode} />
          <NavItem icon={Activity} label="ABDM Integration" active={activeTab === 'abdm'} onClick={() => handleNav('abdm')} darkMode={darkMode} />
        </div>

        {/* Section 5: Administration */}
        <div className="space-y-0.5">
          <SectionHeader title="ADMINISTRATION" darkMode={darkMode} />
          <NavItem icon={Users} label="Users & Roles" active={activeTab === 'users'} onClick={() => handleNav('users')} darkMode={darkMode} />
          <NavItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => handleNav('settings')} darkMode={darkMode} />
        </div>
      </div>

      {/* Footer Branding */}
      <div className={`p-3 border-t ${darkMode ? 'border-slate-800 bg-[#091522]' : 'border-[#0a382b] bg-[#051e16]'}`}>
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px]">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Ayurveda for Healthier Tomorrow</span>
        </div>
        <p className="text-[9px] text-slate-400 mt-0.5 font-medium">Research • Safety • Global Trust</p>
      </div>
    </aside>
  );
}

function SectionHeader({ title, darkMode }: { title: string; darkMode?: boolean }) {
  return (
    <p className={`text-[9px] font-bold uppercase px-2.5 pt-2 tracking-wider ${
      darkMode ? 'text-slate-400' : 'text-emerald-300/80'
    }`}>
      {title}
    </p>
  );
}

function NavItem({ icon: Icon, label, active, onClick, badge, darkMode }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer text-left ${
        active
          ? darkMode
            ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
            : 'bg-emerald-600 text-white font-bold shadow-md'
          : darkMode
          ? 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
          : 'text-emerald-100 hover:bg-[#0c4031] hover:text-white'
      }`}
    >
      <div className="flex items-center gap-2.5 truncate">
        <Icon className={`w-3.5 h-3.5 ${active ? (darkMode ? 'text-cyan-300' : 'text-white') : (darkMode ? 'text-slate-400' : 'text-emerald-300')}`} />
        <span className="truncate">{label}</span>
      </div>
      {badge && (
        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${
          darkMode
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
            : 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}
