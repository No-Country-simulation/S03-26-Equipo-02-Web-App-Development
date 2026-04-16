import {Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ManageTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
}

const AVAILABLE_TAGS = ["VIP", "Urgente", "Follow-up", "Nuevo", "Interesado", "Calificado"];

const ManageTagsModal = ({isOpen, 
  onClose, 
  contactName,  
}: ManageTagsModalProps) => {
  const [tempSelectedTags, setTempSelectedTags] = useState<string[]>([]);


  const toggleTagSelection = (tag: string) => {
    setTempSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-112.5 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Gestionar Etiquetas</h3>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">
                Selecciona las etiquetas para {contactName}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Buscar etiquetas..."
              className="w-full h-11 pl-4 pr-10 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-[#0D9488]/10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-1 max-h-75 overflow-y-auto pr-2 scrollbar-hide mb-8">
            {AVAILABLE_TAGS.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={tempSelectedTags.includes(tag)}
                  onChange={() => toggleTagSelection(tag)}
                  className="w-5 h-5 rounded border-slate-200 text-[#0D9488] focus:ring-[#0D9488] cursor-pointer"
                />
                <span className={cn(
                  "text-[13px] font-bold px-3 py-1 rounded-md transition-all",
                  tempSelectedTags.includes(tag)
                    ? "bg-[#0D9488]/10 text-[#0D9488]"
                    : "bg-slate-50 text-slate-600"
                )}>
                  {tag}
                </span>
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-12 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              className="flex-1 h-12 bg-[#0D9488]/40 hover:bg-[#0D9488] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#0D9488]/10"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageTagsModal
