import {
  Pencil,
  ClipboardList,
  FileText,
  Info,
  Plus,
  Tag,
  CheckCircle2
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useContacts } from "@/context/useContacts";

const ChatActions = ({ contactId }: { contactId: number | null }) => {
  const { contacts } = useContacts();
  const contact = contacts.find(c => c.id === contactId) || contacts[0];

  if (!contact) return null;

  const initials = contact.name.split(" ").map(n => n[0]).join("").substring(0, 2);

  return (
    <div className="h-full p-6 space-y-6 bg-white border-l transition-all animate-in slide-in-from-right-2 duration-300 overflow-y-auto custom-scrollbar">
      {/* Header Perfil */}
      <div className="text-center pb-6 border-b border-slate-50">
        <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center text-slate-700 font-extrabold text-lg mx-auto mb-4 border border-slate-100 shadow-sm">
          {initials}
        </div>

        <h2 className="text-[17px] font-extrabold text-slate-800 mb-1 tracking-tight">{contact.name}</h2>
        <div className="text-[12px] text-slate-500 space-y-1 font-bold">
          <p className="hover:text-slate-700 transition-colors cursor-pointer">{contact.email}</p>
          <p className="hover:text-slate-700 transition-colors cursor-pointer">{contact.phone}</p>
        </div>
      </div>

      {/* Menú de Acordeones */}
      <Accordion type="single" collapsible className="w-full space-y-3">
        {/* Acciones Rápidas */}
        <AccordionItem value="actions" className="border border-slate-100 rounded-xl px-4 bg-[#F8FAFC] overflow-hidden transition-all data-[state=open]:bg-white data-[state=open]:shadow-md">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Pencil className="w-4 h-4 text-slate-700" />
              <span className="text-[13px] font-extrabold text-slate-700">Acciones Rápidas</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="flex flex-col gap-2 pt-1">
              <button className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-50 text-[12px] font-bold text-slate-600 transition-colors cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                Crear nueva tarea
              </button>
              <button className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-50 text-[12px] font-bold text-slate-600 transition-colors cursor-pointer">
                <Tag className="w-3.5 h-3.5" />
                Gestionar etiquetas
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tareas */}
        <AccordionItem value="tasks" className="border border-slate-100 rounded-xl px-4 bg-[#F8FAFC] overflow-hidden transition-all data-[state=open]:bg-white data-[state=open]:shadow-md">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-4 h-4 text-slate-700" />
              <span className="text-[13px] font-extrabold text-slate-700">Tareas</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-[12px] font-bold text-slate-400 text-center py-6">
            No hay tareas pendientes
          </AccordionContent>
        </AccordionItem>

        {/* Notas */}
        <AccordionItem value="notes" className="border border-slate-100 rounded-xl px-4 bg-[#F8FAFC] overflow-hidden transition-all data-[state=open]:bg-white data-[state=open]:shadow-md">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-slate-700" />
              <span className="text-[13px] font-extrabold text-slate-700">Notas</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-[12px] font-bold text-slate-400 text-center py-6">
            Sin notas registradas
          </AccordionContent>
        </AccordionItem>

        {/* Información */}
        <AccordionItem value="info" className="border border-slate-100 rounded-xl px-4 bg-[#F8FAFC] overflow-hidden transition-all data-[state=open]:bg-white data-[state=open]:shadow-md">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-slate-700" />
              <span className="text-[13px] font-extrabold text-slate-700">Información</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 px-1">
            <div className="space-y-4 pt-2">

                <div>
                   <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5">Origen / Canal</p>
                   <span className="inline-flex items-center px-2.5 py-1 bg-white border border-slate-100 text-slate-700 rounded-lg text-[11px] font-extrabold shadow-sm">
                      Whatsapp
                   </span>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5">Estado actual</p>
                   <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[#0D9488] text-white shadow-sm">
                      {contact.status}
                   </div>
                </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ChatActions;
