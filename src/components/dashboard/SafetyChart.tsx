export default function SafetyChart() {
  const items = [
    { label: 'Mild', count: 4, pct: 50, color: 'bg-emerald-500' },
    { label: 'Moderate', count: 2, pct: 25, color: 'bg-yellow-500' },
    { label: 'Serious (SAE)', count: 1, pct: 12.5, color: 'bg-rose-500' },
    { label: 'Pending Review', count: 1, pct: 12.5, color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.label}>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-300">{it.label}</span>
            <span className="text-slate-400 font-semibold">{it.count} ({it.pct}%)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full ${it.color}`} style={{ width: `${it.pct}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}
