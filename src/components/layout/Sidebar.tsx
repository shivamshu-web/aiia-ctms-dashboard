'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FlaskConical,
  Users,
  ShieldAlert,
  FileCheck2,
  Network,
  ShieldCheck,
  Building2,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Study Management', href: '/clinical-trials/studies', icon: FlaskConical },
  { name: 'Patient Recruitment', href: '/clinical-trials/patients', icon: Users },
  { name: 'ADR / SAE Reporting', href: '/pharmacovigilance/adr-sae', icon: ShieldAlert },
  { name: 'Compliance (CTRI)', href: '/compliance/ctri', icon: FileCheck2 },
  { name: 'FHIR / CDISC Standards', href: '/interoperability/fhir', icon: Network },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-screen p-4 flex flex-col justify-between shrink-0">
      <div>
        <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-900/30">
            AIIA
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">CTMS Portal</h1>
            <p className="text-[11px] text-emerald-400 font-medium">Ministry of Ayush</p>
          </div>
        </div>

        <nav className="mt-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-[11px]">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>NDCT Rules 2019</span>
          </div>
          <p className="text-slate-400 leading-tight">
            GCP-ASU Verified & HL7 FHIR Interoperable
          </p>
        </div>

        <div className="flex items-center gap-2 px-2 text-[10px] text-slate-500">
          <Building2 className="w-3.5 h-3.5" />
          <span>All India Institute of Ayurveda</span>
        </div>
      </div>
    </aside>
  );
}
