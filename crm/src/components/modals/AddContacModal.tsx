import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddContacModal = ({ isOpen, onClose }: AddContactModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
  });

  if (!isOpen) return null;

    const handleAddContact = () => {
  };


  return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Agregar Nuevo Contacto</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-0.5">Agrega un nuevo contacto a tu lista.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-8 rounded-lg bg-[#E11D48] text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[3px]" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800">Nombre</label>
                  <input
                    type="text"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-12 px-4 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none hover:ring-4 hover:ring-[#0D9488]/24 focus:ring-4 focus:ring-[#0D9488]/24 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800">Email</label>
                  <input
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-12 px-4 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none hover:ring-4 hover:ring-[#0D9488]/24 focus:ring-4 focus:ring-[#0D9488]/24 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="+54 11-68367166"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-12 px-4 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none hover:ring-4 hover:ring-[#0D9488]/24 focus:ring-4 focus:ring-[#0D9488]/24 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800">Estado</label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full h-12 px-4 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium text-slate-400 outline-none hover:ring-4 hover:ring-[#0D9488]/24 focus:ring-4 focus:ring-[#0D9488]/24 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Seleccionar Estado</option>
                      <option value="Cliente" className="text-slate-700">Cliente</option>
                      <option value="Prospecto" className="text-slate-700">Prospecto</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleAddContact}
                    disabled={!formData.name || !formData.email || !formData.phone || !formData.status}
                    className={cn(
                      "w-full h-12 rounded-xl text-sm font-bold transition-all",
                      formData.name && formData.email && formData.phone && formData.status
                        ? "bg-[#0D9488] text-white hover:bg-[#0f766c] shadow-lg shadow-[#0D9488]/20 cursor-pointer active:scale-[0.98]"
                        : "bg-[#F1F5F9] text-slate-400 cursor-not-allowed"
                    )}
                  >
                    Agregar Contacto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default AddContacModal
