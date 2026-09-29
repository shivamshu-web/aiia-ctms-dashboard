import { Study } from '@/types/study';

export default function ActiveStudiesTable({ studies }: { studies: Study[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold">
          <tr>
            <th className="px-3 py-3">Study ID</th>
            <th className="px-3 py-3">Title</th>
            <th className="px-3 py-3">Phase</th>
            <th className="px-3 py-3">Sites</th>
            <th className="px-3 py-3">Enrolment</th>
            <th className="px-3 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {studies.map((s) => (
            <tr key={s.studyCode} className="hover:bg-slate-800/40">
              <td className="px-3 py-3 font-semibold text-emerald-400">{s.studyCode}</td>
              <td className="px-3 py-3 text-white font-medium">{s.title}</td>
              <td className="px-3 py-3">{s.phase}</td>
              <td className="px-3 py-3">{s.sitesCount}</td>
              <td className="px-3 py-3">{s.enrolledCount} / {s.targetPatients}</td>
              <td className="px-3 py-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
