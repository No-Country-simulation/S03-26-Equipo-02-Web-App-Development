import type { MessagePoint } from "@/hooks/useDashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: MessagePoint[];
}

export function MessagesChart({ data }: Props) {
  const chartData = data.map((item) => ({
    name: new Date(item.date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
    }),
    messages: item.value,
  }));

  return (
    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-slate-900">Mensajes en el Tiempo</h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0D9488]"></span>
          <span className="text-sm font-semibold text-slate-600">Mensajes</span>
        </div>
      </div>
      <div className="h-75 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="messages" stroke="#65bdad" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
