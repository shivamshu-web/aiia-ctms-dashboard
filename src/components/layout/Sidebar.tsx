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
}

export default function Sidebar({ activeTab = 'dashboard', setActiveTab }: SidebarProps) {
  const handleNav = (tabId: string) => {
    if (setActiveTab) {
      setActiveTab(tabId);
    }
  };

  return (
    <aside className="w-64 bg-[#031911] border-r border-[#0d3d2b] flex flex-col h-screen text-xs select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#0d3d2b] bg-gradient-to-r from-[#031f15] to-[#04281c] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 border border-emerald-400/50 flex items-center justify-center text-white shadow-lg shadow-emerald-950/60">
          <Leaf className="w-5 h-5 fill-white/20 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-emerald-100 text-xs leading-tight">All India Institute of Ayurveda</h2>
          <p className="text-[10px] text-emerald-400/80 font-medium">Ministry of Ayush • Govt. of India</p>
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
          />
        </div>

        {/* Section 1: Clinical Trials */}
        <div className="space-y-0.5">
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
        <div className="space-y-0.5">
          <SectionHeader title="PHARMACOVIGILANCE (NPVCC)" />
          <NavItem icon={AlertTriangle} label="ADR / SAE Reporting" active={activeTab === 'safety-reporting'} onClick={() => handleNav('safety-reporting')} />
          <NavItem icon={Radio} label="Safety Signal Detection" active={activeTab === 'signal-detection'} onClick={() => handleNav('signal-detection')} />
          <NavItem icon={FileCode} label="MedDRA / WHODrug" active={activeTab === 'meddra'} onClick={() => handleNav('meddra')} />
          <NavItem icon={FileSpreadsheet} label="PV Reports" active={activeTab === 'pv-reports'} onClick={() => handleNav('pv-reports')} />
        </div>

        {/* Section 3: Compliance & Regulatory */}
        <div className="space-y-0.5">
          <SectionHeader title="COMPLIANCE & REGULATORY" />
          <NavItem icon={FileText} label="CTRI Registration" active={activeTab === 'ctri'} onClick={() => handleNav('ctri')} />
          <NavItem icon={ShieldCheck} label="GCP-ASU & ICMR" active={activeTab === 'gcp'} onClick={() => handleNav('gcp')} />
          <NavItem icon={Scale} label="NDCT Rules 2019" active={activeTab === 'ndct'} onClick={() => handleNav('ndct')} />
          <NavItem icon={SearchCheck} label="Audit & Inspection" active={activeTab === 'audit'} onClick={() => handleNav('audit')} />
        </div>

        {/* Section 4: Data & Interoperability */}
        <div className="space-y-0.5">
          <SectionHeader title="DATA & INTEROPERABILITY" />
          <NavItem icon={Cpu} label="CDISC Data Standards" active={activeTab === 'cdisc'} onClick={() => handleNav('cdisc')} />
          <NavItem icon={Share2} label="HL7 FHIR Integration" active={activeTab === 'fhir'} onClick={() => handleNav('fhir')} />
          <NavItem icon={Activity} label="ABDM Integration" active={activeTab === 'abdm'} onClick={() => handleNav('abdm')} />
        </div>

        {/* Section 5: Administration */}
        <div className="space-y-0.5">
          <SectionHeader title="ADMINISTRATION" />
          <NavItem icon={Users} label="Users & Roles" active={activeTab === 'users'} onClick={() => handleNav('users')} />
          <NavItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => handleNav('settings')} />
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-3 border-t border-[#0d3d2b] bg-[#02130c]">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
          <HeartHandshake className="w-3.5 h-3.5 text-emerald-300" />
          <span>Ayurveda for Healthier Tomorrow</span>
        </div>
        <p className="text-[9px] text-emerald-500/70 mt-0.5">Research • Safety • Global Trust</p>
      </div>
    </aside>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <p className="text-[9px] font-bold text-emerald-400/60 uppercase px-2.5 pt-2 tracking-wider">{title}</p>;
}

function NavItem({ icon: Icon, label, active, onClick, badge }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer text-left ${
        active
          ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold shadow-md shadow-emerald-950/50'
          : 'text-emerald-100/80 hover:bg-[#072a1d] hover:text-emerald-200'
      }`}
    >
      <div className="flex items-center gap-2.5 truncate">
        <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-emerald-400/70'}`} />
        <span className="truncate">{label}</span>
      </div>
      {badge && (
        <span className="bg-emerald-400/20 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-semibold border border-emerald-400/30">
          {badge}
        </span>
      )}
    </button>
  );
}
