import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Calendar, ChevronDown, Download, RefreshCw } from "lucide-react";

type Props = {
  days: number;
  setDays: (value: number) => void;
  refetch: () => void;
  loading: boolean;
  onExport: () => void;
};

export function DashboardHeader({ days, setDays, refetch, loading, onExport }: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm font-semibold text-slate-700 mt-1">
          ¡Bienvenido de nuevo! Aquí está lo que está pasando hoy.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Timeframe selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-10 px-4 bg-white border border-slate-200 rounded-md shadow-sm flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
              <Calendar className="w-4 h-4 text-slate-500" />
              Últimos {days} días
              <ChevronDown className="w-4 h-4 text-slate-500 ml-1" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setDays(7)}>Últimos 7 días</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDays(15)}>Últimos 15 días</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDays(30)}>Últimos 30 días</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Refresh button */}
        <button
          onClick={refetch}
          disabled={loading}
          className="h-10 px-4 bg-white border border-slate-200 rounded-md shadow-sm flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4 text-slate-500", loading && "animate-spin")} />
          {loading ? "Actualizando..." : "Actualizar"}
        </button>

        {/* Export button */}
        <button
          onClick={onExport}
          className="h-10 px-4 bg-[#0D9488] text-white rounded-md shadow-sm flex items-center justify-center gap-2 text-sm font-semibold hover:bg-[#0f766c] transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>
    </div>
  );
}
