import { useState, useEffect } from "react";
import { Download, HelpCircle, MessageSquareText, TrendingUp, Users, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/hooks/useDashboard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { MessagesChart } from "@/components/dashboard/MessagesChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardPage() {
  const [days, setDays] = useState(7);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"CSV" | "PDF">("CSV");
  const [notification, setNotification] = useState<{
    show: boolean;
    format: string;
  }>({ show: false, format: "" });

  const { dashboard, activities, messages, loading, refetch } = useDashboard(days);

  // Auto-hide notification
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const isFirstLoad = loading && !dashboard;

  if (isFirstLoad) return <div className="p-6">Loading...</div>;

  const handleExport = () => {
    setNotification({ show: true, format: selectedFormat });
    setIsExportModalOpen(false);
  };

  return (
    <div className="relative h-full overflow-y-auto p-6 lg:p-8 bg-[#FAFAFA] custom-scrollbar">
      {/* Toast Notification */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4 shadow-lg min-w-[320px] relative flex items-start gap-3">
            <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
            </div>
            <div className="flex flex-col flex-1">
              <h4 className="text-sm font-bold text-slate-800">
                {notification.format} descargado correctamente
              </h4>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                Puedes visualizarlo en tus descargas.
              </p>
            </div>
            <button
              onClick={() => setNotification({ ...notification, show: false })}
              className="ml-2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-125 overflow-hidden animate-in zoom-in-95 duration-200 relative p-8">
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-[#E11D48] text-white rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm cursor-pointer"
            >
              <X className="w-6 h-6 stroke-[3px]" />
            </button>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900">Exportar Dashboard</h3>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                Selecciona el formato de exportación para las métricas y datos
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {/* Opción CSV */}
              <div
                onClick={() => setSelectedFormat("CSV")}
                className={cn(
                  "p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 group",
                  selectedFormat === "CSV"
                    ? "bg-[#ECFDF5] border-[#0D9488]/30 shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-200",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                    selectedFormat === "CSV"
                      ? "bg-[#0D9488] text-white"
                      : "bg-slate-50 text-slate-400 group-hover:bg-slate-100",
                  )}
                >
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Exportar como CSV</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Formato compatible con Excel y hojas de cálculo
                  </p>
                </div>
              </div>

              {/* Opción PDF */}
              <div
                onClick={() => setSelectedFormat("PDF")}
                className={cn(
                  "p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 group",
                  selectedFormat === "PDF"
                    ? "bg-[#ECFDF5] border-[#0D9488]/30 shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-200",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                    selectedFormat === "PDF"
                      ? "bg-[#0D9488] text-white"
                      : "bg-slate-50 text-slate-400 group-hover:bg-slate-100",
                  )}
                >
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Exportar como PDF</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Documento imprimible con formato profesional
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="w-full py-4 bg-[#0D9488] text-white rounded-xl text-sm font-bold hover:bg-[#0f766c] shadow-lg shadow-[#0D9488]/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              Descargar
            </button>
          </div>
        </div>
      )}

      {/* Header section */}
      <DashboardHeader
        days={days}
        setDays={setDays}
        refetch={refetch}
        loading={loading}
        onExport={() => setIsExportModalOpen(true)}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card 1 */}
        <KpiCard
          title="Contactos activos"
          value={dashboard?.contacts.value ?? 0}
          change={dashboard?.contacts.change ?? 0}
          icon={Users}
          colorIcon="text-[#0D9488]"
        />
        {/* Card 2 */}
        <KpiCard
          title="Mensajes enviados"
          value={dashboard?.messages.value ?? 0}
          change={dashboard?.messages.change ?? 0}
          icon={MessageSquareText}
          colorIcon="text-[#3B82F6]"
        />
        {/* Card 3 */}
        <KpiCard
          title="Tasa de respuesta"
          value={`${dashboard?.responseRate.value ?? 0}%`}
          change={dashboard?.responseRate.change ?? 0}
          icon={TrendingUp}
          colorIcon="text-[#10B981]"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <MessagesChart data={messages} />

        {/* Recent Activity */}
        <RecentActivity data={activities} />
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#0D9488] rounded-full shadow-lg hover:shadow-xl hover:bg-[#0f766c] transition-all flex items-center justify-center z-50 cursor-pointer">
        <HelpCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
