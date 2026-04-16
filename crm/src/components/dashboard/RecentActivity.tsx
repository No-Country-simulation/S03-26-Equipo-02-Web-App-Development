import type { Activity } from "@/hooks/useDashboard";
import { timeAgo } from "@/utils/timeAgo";

export function RecentActivity({ data }: { data: Activity[] }) {
  console.log("RecentActivity data:", data);
  return (
            <div className="lg:col-span-1 bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-900">Actividad Reciente</h3>
            <button className="text-sm font-semibold text-[#0D9488] hover:text-[#0f766c] transition-colors cursor-pointer">
              Ver todo
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-100 pr-1 scrollbar-hide">
            {data.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-slate-900">{item.initials}</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-bold text-slate-900 leading-tight">
                    {item.title}
                  </span>
                  <div className="flex items-start mt-1 gap-1.5">
                    <span className="text-[#0D9488] text-sm leading-tight">•</span>
                    <span className="text-sm text-slate-600 font-medium leading-tight">
                      {item.description}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-1">{item.date && timeAgo(item.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
  );
}
