export default function RecentActivity() {
  const activities = [
    { action: 'New ADR reported', sub: 'Study AIIA-CT-002', time: '2h ago' },
    { action: 'Site activation completed', sub: 'Site: Varanasi', time: '4h ago' },
    { action: 'Data query resolved', sub: 'Study AIIA-CT-001', time: '6h ago' },
  ];

  return (
    <div className="space-y-3">
      {activities.map((a, i) => (
        <div key={i} className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
          <div>
            <p className="text-slate-200 font-medium">{a.action}</p>
            <p className="text-[10px] text-slate-500">{a.sub}</p>
          </div>
          <span className="text-[10px] text-slate-500">{a.time}</span>
        </div>
      ))}
    </div>
  );
}
