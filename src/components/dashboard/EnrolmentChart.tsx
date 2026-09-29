'use client';

export default function EnrolmentChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <h3 className="text-sm font-bold text-white mb-2">Study Enrolment Trend</h3>
      <div className="h-44 flex items-end gap-3 pt-6">
        {[40, 60, 75, 90, 85, 100].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-emerald-500/30 hover:bg-emerald-500/50 rounded-t transition"
              style={{ height: `${h}%` }}
            ></div>
            <span className="text-[10px] text-slate-500">M{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
