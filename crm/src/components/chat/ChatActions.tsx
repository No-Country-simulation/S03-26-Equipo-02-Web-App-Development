import {
  Pencil,
  ClipboardList,
  FileText,
  Info,
  CheckCircle2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ApiTask } from "@/types/ApiTask";
import type { ApiNotes } from "@/types/ApiNotes";
import type { ApiMessage } from "@/types/ApiMessage";

interface ChatActionsProps {
  contactId: string | null;
  contact: ApiMessage["contact"] | null;
}


const ChatActions = ({ contactId, contact }: ChatActionsProps) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [notes, setNotes] = useState<ApiNotes[]>([]);

  useEffect(() => {
    if (!contactId) return;

    fetch(`https://s03-26-equipo-02-web-app-development.onrender.com/tasks`)
      .then((res) => res.json())
      .then((json) => {
        const all: ApiTask[] = json.data || [];
        setTasks(all.filter((t) => t.contact.id === contactId && !t.complete));
      });

    fetch(
      `https://s03-26-equipo-02-web-app-development.onrender.com/notes/contact/${contactId}`,
    )
      .then((res) => res.json())
      .then((json) => setNotes(json.data));
  }, [contactId]);

  if (!contact) return null;

  const initials = `${contact.firstName} ${contact.lastName}`
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);

  return (
    <div className="h-full w-[300px] p-6 space-y-6 bg-white border-l border-[#E2E8F0] overflow-y-auto custom-scrollbar transition-all animate-in slide-in-from-right-2 duration-300">
      {/* Header Perfil */}
      <div className="text-center pb-6 border-b border-[#F1F5F9]">
        <div className="rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center w-16 h-16 mx-auto mb-3 shadow-sm">
          <span className="text-lg font-bold text-[#0F172A]">{initials}</span>
        </div>

        <h2 className="text-lg font-bold text-[#0F172A] mb-0.5">
          {contact.firstName}
        </h2>
        <div className="text-xs text-[#64748B] space-y-0.5">
          <p className="hover:text-[#0D9488] transition-colors cursor-pointer">
            {contact.email}
          </p>
          <p className="hover:text-[#0D9488] transition-colors cursor-pointer">
            {contact.phone}
          </p>
        </div>
      </div>

      {/* Menú de Acordeones */}
      <Accordion className="w-full space-y-3">
        {/* Acciones Rápidas */}
        <AccordionItem
          value="actions"
          className="border border-[#E2E8F0] rounded-lg px-3.5 bg-white shadow-sm overflow-hidden whitespace-nowrap"
        >
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2.5">
              <Pencil className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="text-[13px] font-bold text-[#1E293B]">
                Acciones Rápidas
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 px-0.5">
            <div className="space-y-1.5">
              <button
                onClick={() => navigate("/tasks")}
                className="w-full text-left px-3 py-2 rounded-lg font-bold text-[12px] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0D9488] transition-colors border border-transparent hover:border-[#E2E8F0]"
              >
                Crear Tarea
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg font-bold text-[12px] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0D9488] transition-colors border border-transparent hover:border-[#E2E8F0]">
                Agregar Nota
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tareas */}
        <AccordionItem
          value="tasks"
          className="border border-[#E2E8F0] rounded-lg px-3.5 bg-white shadow-sm overflow-hidden"
        >
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="text-[13px] font-bold text-[#1E293B]">
                Tareas
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 px-0.5">
            <div className="flex items-start gap-2.5 p-3 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]">
              <div className="flex flex-col gap-1.5">
                {tasks.length === 0 ? (
                  <p className="text-[12px] font-bold text-[#475569] p-3">
                    Sin tareas pendientes.
                  </p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F8FAFC] border"
                    >
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[12px] font-bold text-[#334155] leading-tight">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-1.5 text-[#BE123C] font-black text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>
                            {new Date(task.expirationDate).toLocaleDateString(
                              "es-AR",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Notas */}
        <AccordionItem
          value="notes"
          className="border border-[#E2E8F0] rounded-lg px-3.5 bg-white shadow-sm overflow-hidden"
        >
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2.5">
              <FileText className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="text-[13px] font-bold text-[#1E293B]">
                Notas
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 px-0.5">
            {notes.length === 0 ? (
              <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-lg p-3">
                <p className="text-[12px] text-[#92400E] font-bold">
                  Sin notas registradas.
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-lg p-3"
                >
                  <p className="text-[12px] text-[#92400E] font-bold leading-relaxed">
                    {note.description}
                  </p>
                </div>
              ))
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Información */}
        <AccordionItem
          value="info"
          className="border border-[#E2E8F0] rounded-lg px-3.5 bg-white shadow-sm overflow-hidden"
        >
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2.5">
              <Info className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="text-[13px] font-bold text-[#1E293B]">
                Información
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 px-1">
            <div className="space-y-4 pt-1">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-[#94A3B8] font-black mb-2">
                  Canal
                </p>
                <span className="inline-flex items-center px-3 py-1.5 bg-white border border-[#E2E8F0] text-[#1E293B] rounded-xl text-[11px] font-bold shadow-xs">
                  {contact.phone ? "Whatsapp" : "Email"}
                </span>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-[#94A3B8] font-black mb-2">
                  Estado
                </p>
                <div className="inline-flex items-center px-3 py-1.5 rounded-xl text-[11px] font-bold bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1] shadow-xs uppercase">
                  Pendiente
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
