import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  tag: string;
  icon: LucideIcon;
  danger?: boolean;
}

export default function MetricCard({ title, value, tag, icon: Icon, danger }: MetricCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[11px] font-medium text-slate-400">{title}</span>
        <Icon className={`w-4 h-4 ${danger ? 'text-amber-400' : 'text-emerald-400'}`} />
      </div>
      <div>
        <h4 className="text-xl font-bold text-white">{value}</h4>
        <span className={`text-[10px] ${danger ? 'text-amber-400' : 'text-emerald-400'}`}>{tag}</span>
      </div>
    </div>
  );
}
