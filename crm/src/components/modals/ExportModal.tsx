import { useState } from "react";
import { X, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModal = ({ isOpen, onClose }: ExportModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState<"CSV" | "PDF">("CSV");
  if (!isOpen) return null;
  const handleExport = () => {};

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-125 overflow-hidden animate-in zoom-in-95 duration-200 relative p-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-[#E11D48] text-white rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm cursor-pointer"
        >
          <X className="w-6 h-6 stroke-[3px]" />
        </button>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900">
            Exportar Contactos
          </h3>
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
              <h4 className="text-sm font-bold text-slate-800">
                Exportar como CSV
              </h4>
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
              <h4 className="text-sm font-bold text-slate-800">
                Exportar como PDF
              </h4>
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
  );
};

export default ExportModal;
