import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number | string;
  change: number;
  icon: LucideIcon;
  colorIcon: string;
}

export function KpiCard({ title, value, change, icon: Icon, colorIcon }: Props) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 rounded-lg bg-[#F0FDF4] flex items-center justify-center ${colorIcon}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div
          className={`text-white flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
            isPositive ? "bg-[#00A86B]" : "bg-[#E11D48]"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-white" />
          )}
          {change}%
        </div>
      </div>
      <div>
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{value}</h2>
        <p className="text-sm font-bold text-slate-700 mt-2">{title}</p>
      </div>
    </div>
  );
}
