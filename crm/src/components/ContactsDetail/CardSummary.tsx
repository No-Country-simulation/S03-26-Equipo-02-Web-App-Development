import { MessageSquare, Tag, MailIcon,ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom";
import type { ApiContact } from "@/types/ApiContacts";

interface CardSummaryProps {
  contact: ApiContact | null;
}

const CardSummary = ({ contact }: CardSummaryProps) => {
  const navigate = useNavigate();

  if (!contact) return null;
  return (

          <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-8">Resumen de Actividad</h3>

                <div className="space-y-0 divide-y divide-slate-50">
                  <div className="py-6 flex justify-between items-center group cursor-pointer hover:bg-slate-50/50 -mx-8 px-8 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-[#0D9488]">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">Total de Mensajes</span>
                        <span className="text-xs font-semibold text-slate-500 mt-0.5">Conversaciones intercambiadas</span>
                      </div>
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900">3</span>
                  </div>

                  <div className="py-6 flex justify-between items-center group cursor-pointer hover:bg-slate-50/50 -mx-8 px-8 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">Etiquetas Activas</span>
                        <span className="text-xs font-semibold text-slate-500 mt-0.5">Clasificaciones aplicadas</span>
                      </div>
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900">2</span>
                  </div>

                  <div className="py-6 flex justify-between items-center group cursor-pointer hover:bg-slate-50/50 -mx-8 px-8 transition-colors border-b-none">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                        <MailIcon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">Canal Principal</span>
                        <span className="text-xs font-semibold text-slate-500 mt-0.5">Medio de comunicación preferido</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-md text-xs font-bold text-slate-700">Email</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Last Message Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold text-slate-900">Último Mensaje</h3>
                  <button
                    onClick={() => navigate(`/tray?id=${contact.id}`)}
                    className="text-sm font-bold text-[#0D9488] hover:text-[#0f766c] flex items-center gap-1 group transition-colors cursor-pointer"
                  >
                    Ver Conversación Completa
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>

                <div className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-50">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-sm font-bold text-slate-900 shrink-0">
                    Mb
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-900">{contact.firstName} {contact.lastName}</span>
                      <span className="text-[11px] font-semibold text-slate-400">10:23 AM</span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      ¡Gracias por la rápida respuesta! Sí, una demo estaría genial. ¿Cuál es tu disponibilidad la próxima semana?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  )
}

export default CardSummary
