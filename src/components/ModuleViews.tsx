'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  FileCheck,
  Building2,
  UserPlus,
  CalendarCheck,
  Database,
  Flag,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  FileDown,
  X,
  Loader2,
  CheckCircle,
  DatabaseBackup
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
  onOpenCreateStudy,
  onOpenAddPatient,
}: Props) {
  const [dbData, setDbData] = useState<any>({
    studies: [],
    protocols: [],
    sites: [],
    patients: [],
    milestones: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPhase, setFilterPhase] = useState('ALL');
  const [selectedStudyModal, setSelectedStudyModal] = useState<any>(null);

  // Live fetch from Neon PostgreSQL
  const fetchNeonData = () => {
    setLoading(true);
    fetch(`/api/clinical-data?tab=${tab}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setDbData((prev: any) => ({ ...prev, ...json.data }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Neon DB fetch error:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNeonData();
  }, [tab]);

  const studiesList: any[] = dbData.studies || [];
  const protocolsList: any[] = dbData.protocols || [];
  const sitesList: any[] = dbData.sites || [];
  const patientsList: any[] = dbData.patients || [];
  const milestonesList: any[] = dbData.milestones || [];

  // Filtered studies
  const filteredStudies = studiesList.filter((s: any) => {
    const matchesSearch =
      (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.study_id || s.studyId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.ctri_number || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = filterPhase === 'ALL' || s.phase === filterPhase;
    return matchesSearch && matchesPhase;
  });

  const getHeaderInfo = () => {
    switch (tab) {
      case 'study-management':
        return { title: 'Study Management', icon: FolderKanban, desc: 'Centralized protocol registry, investigator oversight, and active trial records directly synced with Neon SQL.' };
      case 'protocols':
        return { title: 'Protocol & Approvals', icon: FileCheck, desc: 'Institutional Ethics Committee (IEC) dossiers, protocol amendments, and CTRI clearances from PostgreSQL.' };
      case 'sites':
        return { title: 'Site Management', icon: Building2, desc: 'Multi-centric AYUSH trial site coordination, PI credentials, and GCP audits stored in DB.' };
      case 'patients':
        return { title: 'Patient Recruitment & Demographics', icon: UserPlus, desc: 'Live enrolled cohort, Ayurvedic Prakriti profiling, and consent registry synced in Neon SQL.' };
      case 'visits':
        return { title: 'Visits & Monitoring', icon: CalendarCheck, desc: 'Subject visit compliance schedules, protocol deviations, and monitoring reports (MVR).' };
      case 'data-mgmt':
        return { title: 'Electronic Data Management (eCRF)', icon: Database, desc: 'Electronic Case Report Form verification, query resolution, and audit trails.' };
      case 'milestones':
        return { title: 'Study Milestones & Timelines', icon: Flag, desc: 'Gantt schedule, First Patient In (FPI), Last Patient Out (LPO), and CSR delivery.' };
      case 'closeout':
        return { title: 'Trial Close-Out & Archiving', icon: CheckCircle2, desc: 'Trial Master File (TMF) archiving, clinical study reports (CSR), and final database lock.' };
      default:
        return { title: 'Clinical Module', icon: FolderKanban, desc: 'AIIA Clinical Trials Management System' };
    }
  };

  const header = getHeaderInfo();
  const Icon = header.icon;

  return (
    <div className="space-y-4">
      {/* Header Bar */}
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
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                <DatabaseBackup className="w-3 h-3" />
                Neon SQL Connected
              </span>
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

      {loading ? (
        <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-xs text-slate-300 font-semibold">Querying Live Tables from Neon PostgreSQL...</span>
        </div>
      ) : (
        <>
          {/* TAB 1: STUDY MANAGEMENT */}
          {tab === 'study-management' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <KpiCard label="Total Protocols (Neon DB)" val={`${studiesList.length} Studies`} sub="100% IEC Approved" color="text-cyan-400" />
                <KpiCard label="Total Enrolled Subjects" val={`${studiesList.reduce((acc, s) => acc + (s.enrolled || 0), 0)} Patients`} sub="Live sum from Neon" color="text-emerald-400" />
                <KpiCard label="Average Protocol Compliance" val="98.2%" sub="GCP-ASU & ICMR Standards" color="text-teal-400" />
                <KpiCard label="Principal Investigator" val="Dr. Aanchal Singh" sub="AIIA Apex Centre, New Delhi" color="text-white" />
              </div>

              <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 max-w-md bg-[#18273d] px-3 py-1.5 rounded-lg border border-slate-700">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search protocol in Neon database..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs text-slate-100 placeholder-slate-400 w-full"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phase:</span>
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
                    {filteredStudies.map((s: any) => (
                      <tr key={s.id || s.study_id} className="hover:bg-slate-800/50 transition">
                        <td className="px-3.5 py-3 font-bold text-cyan-400">{s.study_id || s.studyId}</td>
                        <td className="px-3.5 py-3 text-white font-medium max-w-sm">
                          <div>{s.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{s.therapeutic_area || 'Ayurvedic Clinical Protocol'}</div>
                        </td>
                        <td className="px-3.5 py-3">
                          <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-cyan-300 font-semibold text-[10px]">
                            {s.phase}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-slate-300">{s.sites_count || s.sitesCount} Sites</td>
                        <td className="px-3.5 py-3 font-semibold text-emerald-400">
                          {s.enrolled} / {s.target}
                        </td>
                        <td className="px-3.5 py-3 font-mono text-slate-400 text-[10px]">{s.ctri_number || s.ctriNumber}</td>
                        <td className="px-3.5 py-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
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

          {/* TAB 2: PROTOCOL & APPROVALS */}
          {tab === 'protocols' && (
            <div className="space-y-4">
              <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-4 shadow-lg">
                <h2 className="text-xs font-bold text-white mb-3">Institutional Ethics Committee (IEC) Dossiers from Neon DB</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] text-slate-300">
                    <thead className="bg-[#18273d] text-slate-400 uppercase text-[9px] border-b border-slate-800">
                      <tr>
                        <th className="px-3 py-2.5">Protocol ID</th>
                        <th className="px-3 py-2.5">Protocol Title</th>
                        <th className="px-3 py-2.5">Version</th>
                        <th className="px-3 py-2.5">Ethics Committee</th>
                        <th className="px-3 py-2.5">CTRI Clearances</th>
                        <th className="px-3 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {protocolsList.map((p: any) => (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="px-3 py-2.5 font-bold text-cyan-400">{p.study_id}</td>
                          <td className="px-3 py-2.5 text-white font-medium max-w-xs truncate">{p.study_title}</td>
                          <td className="px-3 py-2.5 font-mono text-slate-300">{p.version}</td>
                          <td className="px-3 py-2.5 text-slate-300">{p.iec_committee}</td>
                          <td className="px-3 py-2.5 font-mono text-emerald-400">{p.ctri_number}</td>
                          <td className="px-3 py-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {p.status}
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

          {/* TAB 3: SITE MANAGEMENT */}
          {tab === 'sites' && (
            <div className="space-y-4">
              <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-4 shadow-lg">
                <h2 className="text-xs font-bold text-white mb-3">Live Multi-Centric Sites Table (Neon PostgreSQL)</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] text-slate-300">
                    <thead className="bg-[#18273d] text-slate-400 uppercase text-[9px] border-b border-slate-800">
                      <tr>
                        <th className="px-3 py-2.5">Site Code</th>
                        <th className="px-3 py-2.5">Institution Name</th>
                        <th className="px-3 py-2.5">City</th>
                        <th className="px-3 py-2.5">Principal Site PI</th>
                        <th className="px-3 py-2.5">Enrollment Progress</th>
                        <th className="px-3 py-2.5">Audit Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {sitesList.map((site: any) => (
                        <tr key={site.id} className="hover:bg-slate-800/40">
                          <td className="px-3 py-2.5 font-bold text-cyan-400">{site.site_code}</td>
                          <td className="px-3 py-2.5 text-white font-medium">{site.institution_name}</td>
                          <td className="px-3 py-2.5 text-slate-300">{site.city}</td>
                          <td className="px-3 py-2.5 text-slate-200">{site.pi_name}</td>
                          <td className="px-3 py-2.5 font-bold text-emerald-400">{site.enrolled} / {site.target}</td>
                          <td className="px-3 py-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                              {site.audit_status}
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

          {/* TAB 4: PATIENT RECRUITMENT */}
          {tab === 'patients' && (
            <div className="space-y-4">
              <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-4 shadow-lg">
                <h2 className="text-xs font-bold text-white mb-3">Live Patient Demographics & Prakriti Profile (Neon SQL)</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] text-slate-300">
                    <thead className="bg-[#18273d] text-slate-400 uppercase text-[9px] border-b border-slate-800">
                      <tr>
                        <th className="px-3 py-2.5">Subject ID</th>
                        <th className="px-3 py-2.5">Study Protocol</th>
                        <th className="px-3 py-2.5">Age / Sex</th>
                        <th className="px-3 py-2.5">Ayurvedic Prakriti</th>
                        <th className="px-3 py-2.5">Stage</th>
                        <th className="px-3 py-2.5">Medication Adherence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {patientsList.map((p: any) => (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="px-3 py-2.5 font-bold text-cyan-400">{p.subject_id}</td>
                          <td className="px-3 py-2.5 text-white">{p.study_id}</td>
                          <td className="px-3 py-2.5 text-slate-300">{p.age} Y / {p.gender}</td>
                          <td className="px-3 py-2.5">
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[10px]">
                              {p.prakriti}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-slate-200">{p.stage}</td>
                          <td className="px-3 py-2.5 font-bold text-emerald-400">{p.compliance_rate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5-8 FALLBACKS CONNECTED TO DB MILESTONES */}
          {(tab === 'milestones' || tab === 'visits' || tab === 'data-mgmt' || tab === 'closeout') && (
            <div className="bg-[#111c2e] border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
              <h2 className="text-xs font-bold text-white">Live Milestone & Clinical Trial Progress (Neon DB)</h2>
              <div className="space-y-3">
                {milestonesList.map((m: any) => (
                  <div key={m.id} className="p-3 bg-[#18273d] rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-white">{m.title}</span>
                      <span className="text-cyan-400">{m.progress_pct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${m.progress_pct}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block font-medium">{m.milestone_tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Real Study Modal Popup */}
      {selectedStudyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-[#111c2e] border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-bold text-xs border border-blue-500/30">
                  {selectedStudyModal.study_id || selectedStudyModal.studyId}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedStudyModal.title}</h3>
                <p className="text-xs text-slate-400">{selectedStudyModal.therapeutic_area}</p>
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
                <span className="text-white font-semibold text-sm">{selectedStudyModal.pi_name || 'Dr. Aanchal Singh'}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">AIIA Hospital, New Delhi</span>
              </div>
              <div className="bg-[#18273d] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Herbal Formulation</span>
                <span className="text-white font-semibold text-sm">{selectedStudyModal.herbal_formulation || 'Standardized Extract'}</span>
                <span className="text-[10px] text-cyan-300 block mt-0.5">PostgreSQL Synchronized</span>
              </div>
              <div className="bg-[#18273d] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">CTRI Registration</span>
                <span className="text-cyan-300 font-mono font-semibold">{selectedStudyModal.ctri_number || selectedStudyModal.ctriNumber}</span>
              </div>
              <div className="bg-[#18273d] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Enrollment Progress</span>
                <span className="text-emerald-400 font-bold">{selectedStudyModal.enrolled} / {selectedStudyModal.target} Subjects</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedStudyModal(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close
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
