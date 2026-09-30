'use client';

import React from 'react';
import Link from 'next/link';
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
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Scale,
  ScrollText,
  Search,
  Share2,
  GitBranch,
  Network,
  Users,
  Settings,
  Leaf
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0a192c] border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen select-none text-slate-300">
      <div className="overflow-y-auto py-2">
        {/* Top Branding */}
        <div className="px-4 py-3 border-b border-slate-800/80 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-white leading-tight">All India Institute of Ayurveda</h1>
            <p className="text-[10px] text-slate-400 font-sans">अखिल भारतीय आयुर्वेद संस्थान</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-2 pt-3 space-y-4 text-[11px]">
          {/* Main */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[#16385d] text-white font-medium shadow-sm">
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Clinical Trials */}
          <div>
            <p className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Clinical Trials</p>
            <div className="space-y-0.5">
              <NavItem icon={FolderKanban} text="Study Management" />
              <NavItem icon={FileCheck} text="Protocol & Approvals" />
              <NavItem icon={Building2} text="Site Management" />
              <NavItem icon={UserPlus} text="Patient Recruitment" />
              <NavItem icon={CalendarCheck} text="Visits & Monitoring" />
              <NavItem icon={Database} text="Data Management" />
              <NavItem icon={Flag} text="Study Milestones" />
              <NavItem icon={CheckCircle2} text="Close-Out" />
            </div>
          </div>

          {/* Pharmacovigilance */}
          <div>
            <p className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pharmacovigilance (NPvCC)</p>
            <div className="space-y-0.5">
              <NavItem icon={AlertTriangle} text="ADR / SAE Reporting" />
              <NavItem icon={Radio} text="Safety Signal Detection" />
              <NavItem icon={FileSpreadsheet} text="MedDRA / WHODrug" />
              <NavItem icon={FileText} text="PV Reports" />
            </div>
          </div>

          {/* Compliance & Regulatory */}
          <div>
            <p className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Compliance & Regulatory</p>
            <div className="space-y-0.5">
              <NavItem icon={ShieldCheck} text="CTRI Registration" />
              <NavItem icon={Scale} text="GCP-ASU & ICMR" />
              <NavItem icon={ScrollText} text="NDCT Rules 2019" />
              <NavItem icon={Search} text="Audit & Inspection" />
            </div>
          </div>

          {/* Data & Interoperability */}
          <div>
            <p className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Data & Interoperability</p>
            <div className="space-y-0.5">
              <NavItem icon={Share2} text="CDISC Data Standards" />
              <NavItem icon={GitBranch} text="HL7 FHIR Integration" />
              <NavItem icon={Network} text="ABDM Integration" />
            </div>
          </div>

          {/* Administration */}
          <div>
            <p className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Administration</p>
            <div className="space-y-0.5">
              <NavItem icon={Users} text="Users & Roles" />
              <NavItem icon={Settings} text="Settings" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#071322]/90">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
          <Leaf className="w-3.5 h-3.5 shrink-0" />
          <span>Ayurveda for a Healthier Tomorrow</span>
        </div>
        <p className="text-[9px] text-slate-400 mt-0.5">Research • Safety • Global Trust</p>
      </div>
    </aside>
  );
}

function NavItem({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <a href="#" className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 transition text-[11px]">
      <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span className="truncate">{text}</span>
    </a>
  );
}