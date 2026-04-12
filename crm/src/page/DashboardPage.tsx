import { useState, useEffect } from "react";
import { useContacts } from "@/context/useContacts";
import {
  Calendar,
  ChevronDown,
  Download,
  HelpCircle,
  MessageSquareText,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
  Check,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const initialData = [
  { name: "17 Mar", messages: 40 },
  { name: "18 Mar", messages: 36 },
  { name: "19 Mar", messages: 53 },
  { name: "20 Mar", messages: 46 },
  { name: "21 Mar", messages: 60 },
  { name: "22 Mar", messages: 69 },
  { name: "23 Mar", messages: 56 },
];

const mockActivities = [
  {
    id: 1,
    initials: "DP",
    name: "David Park",
    action: "Nuevo mensaje sobre documentos de seguridad",
    time: "Hace 5 horas",
  },
  {
    id: 2,
    initials: "SJ",
    name: "Sarah Johnson",
    action: "Respondió sobre agendamiento de demo",
    time: "Hace 6 horas",
  },
  {
    id: 3,
    initials: "DP",
    name: "Nuevo Contacto",
    action: "David Park agregado",
    time: "Hace 8 horas",
  },
  {
    id: 4,
    initials: "ED",
    name: "Emma Davis",
    action: "Tarea completada: Enviar email de bienvenida",
    time: "Hace 1 día",
  },
  {
    id: 5,
    initials: "MC",
    name: "Michael Chen",
    action: "Demo solicitada",
    time: "Hace 1 día",
  },
];

export default function DashboardPage() {
  const { contacts } = useContacts();
  const [days, setDays] = useState(7);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"CSV" | "PDF">("CSV");
  const [chartData, setChartData] = useState(initialData);
  const [notification, setNotification] = useState<{
    show: boolean;
    format: string;
  }>({ show: false, format: "" });

  // Auto-hide notification
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newData = chartData.map((item) => ({
        ...item,
        messages: Math.floor(Math.random() * 50) + 20,
      }));
      setChartData(newData);
      setIsRefreshing(false);
    }, 1000);
  };

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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden animate-in zoom-in-95 duration-200 relative p-8">
            <button 
              onClick={() => setIsExportModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-[#E11D48] text-white rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm cursor-pointer"
            >
              <X className="w-6 h-6 stroke-[3px]" />
            </button>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900">Exportar Dashboard</h3>
              <p className="text-sm font-semibold text-slate-500 mt-1">Selecciona el formato de exportación para las métricas y datos</p>
            </div>

            <div className="space-y-4 mb-8">
              {/* Opción CSV */}
              <div 
                onClick={() => setSelectedFormat("CSV")}
                className={cn(
                  "p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 group",
                  selectedFormat === "CSV" 
                    ? "bg-[#ECFDF5] border-[#0D9488]/30 shadow-sm" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                  selectedFormat === "CSV" ? "bg-[#0D9488] text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                )}>
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Exportar como CSV</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Formato compatible con Excel y hojas de cálculo</p>
                </div>
              </div>

              {/* Opción PDF */}
              <div 
                onClick={() => setSelectedFormat("PDF")}
                className={cn(
                  "p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 group",
                  selectedFormat === "PDF" 
                    ? "bg-[#ECFDF5] border-[#0D9488]/30 shadow-sm" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                  selectedFormat === "PDF" ? "bg-[#0D9488] text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                )}>
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Exportar como PDF</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Documento imprimible con formato profesional</p>
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
              <DropdownMenuItem onClick={() => setDays(7)}>
                Últimos 7 días
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDays(15)}>
                Últimos 15 días
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDays(30)}>
                Últimos 30 días
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-10 px-4 bg-white border border-slate-200 rounded-md shadow-sm flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={cn("w-4 h-4 text-slate-500", isRefreshing && "animate-spin")}
            />
            {isRefreshing ? "Actualizando..." : "Actualizar"}
          </button>

          {/* Export button */}
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="h-10 px-4 bg-[#0D9488] text-white rounded-md shadow-sm flex items-center justify-center gap-2 text-sm font-semibold hover:bg-[#0f766c] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#F0FDF4] flex items-center justify-center text-[#0D9488]">
              <Users className="w-5 h-5" />
            </div>
            <div className="bg-[#00A86B] text-white flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              12%
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{contacts.length}</h2>
            <p className="text-sm font-bold text-slate-700 mt-2">
              Contactos activos
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6]">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div className="bg-[#00A86B] text-white flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              8%
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">458</h2>
            <p className="text-sm font-bold text-slate-700 mt-2">
              Mensajes enviados
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#F0FDF4] flex items-center justify-center text-[#10B981]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="bg-[#E11D48] text-white flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold">
              <TrendingDown className="w-3.5 h-3.5 text-white" />
              3%
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">94%</h2>
            <p className="text-sm font-bold text-slate-700 mt-2">
              Tasa de respuesta
            </p>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-900">
              Mensajes en el Tiempo
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0D9488]"></span>
              <span className="text-sm font-semibold text-slate-600">
                Mensajes
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  ticks={[0, 20, 40, 60, 80]}
                  domain={[0, 80]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#0F172A", fontWeight: "bold" }}
                />
                <Line
                  type="monotone"
                  dataKey="messages"
                  stroke="#65bdad"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#65bdad" }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#0D9488" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-900">
              Actividad Reciente
            </h3>
            <button className="text-sm font-semibold text-[#0D9488] hover:text-[#0f766c] transition-colors cursor-pointer">
              Ver todo
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[400px] pr-1 scrollbar-hide">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-slate-900">
                    {activity.initials}
                  </span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-bold text-slate-900 leading-tight">
                    {activity.name}
                  </span>
                  <div className="flex items-start mt-1 gap-1.5">
                    <span className="text-[#0D9488] text-sm leading-tight">
                      •
                    </span>
                    <span className="text-sm text-slate-600 font-medium leading-tight">
                      {activity.action}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-1">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#0D9488] rounded-full shadow-lg hover:shadow-xl hover:bg-[#0f766c] transition-all flex items-center justify-center z-50 cursor-pointer">
        <HelpCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

