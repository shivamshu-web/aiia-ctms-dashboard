'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  FileCheck,
  MapPin,
  UserPlus,
  CalendarCheck,
  Database,
  Flag,
  CheckCircle,
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

const sections = [
  {
    title: '',
    items: [{ name: 'Dashboard', href: '/', icon: LayoutDashboard }],
  },
  {
    title: 'Clinical Trials',
    items: [
      { name: 'Study Management', href: '/clinical-trials/studies', icon: FolderKanban },
      { name: 'Protocol & Approvals', href: '#', icon: FileCheck },
      { name: 'Site Management', href: '#', icon: MapPin },
      { name: 'Patient Recruitment', href: '/clinical-trials/patients', icon: UserPlus },
      { name: 'Visits & Monitoring', href: '#', icon: CalendarCheck },
      { name: 'Data Management', href: '#', icon: Database },
      { name: 'Study Milestones', href: '#', icon: Flag },
      { name: 'Close-Out', href: '#', icon: CheckCircle },
    ],
  },
  {
    title: 'Pharmacovigilance (NPvCC)',
    items: [
      { name: 'ADR / SAE Reporting', href: '/pharmacovigilance/adr-sae', icon: AlertTriangle },
      { name: 'Safety Signal Detection', href: '#', icon: Radio },
      { name: 'MedDRA / WHODrug', href: '#', icon: FileSpreadsheet },
      { name: 'PV Reports', href: '#', icon: FileText },
    ],
  },
  {
    title: 'Compliance & Regulatory',
    items: [
      { name: 'CTRI Registration', href: '/compliance/ctri', icon: ShieldCheck },
      { name: 'GCP-ASU & ICMR', href: '#', icon: Scale },
      { name: 'NDCT Rules 2019', href: '#', icon: ScrollText },
      { name: 'Audit & Inspection', href: '#', icon: Search },
    ],
  },
  {
    title: 'Data & Interoperability',
    items: [
      { name: 'CDISC Data Standards', href: '/interoperability/cdisc', icon: Share2 },
      { name: 'HL7 FHIR Integration', href: '/interoperability/fhir', icon: GitBranch },
      { name: 'ABDM Integration', href: '#', icon: Network },
    ],
  },
  {
    title: 'Administration',
    items: [
      { name: 'Users & Roles', href: '#', icon: Users },
      { name: 'Settings', href: '#', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[230px] bg-[#0c1e33] border-r border-slate-800 text-slate-300 min-h-screen flex flex-col justify-between shrink-0 select-none">
      <div className="py-3 overflow-y-auto">
        {/* Logo Section */}
        <div className="px-4 pb-3 border-b border-slate-800/80 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-700/80 flex items-center justify-center text-white border border-emerald-500/40">
            <Leaf className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-[11px] font-bold text-white leading-tight">All India Institute of Ayurveda</h1>
            <p className="text-[10px] text-slate-400 font-hindi">अखिल भारतीय आयुर्वेद संस्थान</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-2 pt-2 space-y-3">
          {sections.map((sec, idx) => (
            <div key={idx}>
              {sec.title && (
                <p className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {sec.title}
                </p>
              )}
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] transition ${
                        isActive
                          ? 'bg-[#18395c] text-white font-medium shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-3 border-t border-slate-800 bg-[#091728]">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
          <Leaf className="w-3.5 h-3.5" />
          <span>Ayurveda for a Healthier Tomorrow</span>
        </div>
        <p className="text-[9px] text-slate-400 mt-0.5">Research • Safety • Global Trust</p>
      </div>
    </aside>
  );
}