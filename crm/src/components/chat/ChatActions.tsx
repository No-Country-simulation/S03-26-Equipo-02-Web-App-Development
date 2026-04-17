import { Pencil, ClipboardList, FileText, Info, CheckCircle2 } from "lucide-react";
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
import { timeAgo } from "@/utils/timeAgo";

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

    fetch(`https://s03-26-equipo-02-web-app-development.onrender.com/notes/contact/${contactId}`)
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

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-[#059669]";
      case "medium":
        return "bg-[#F59E0B]";
      case "high":
        return "bg-[#E11D48]";
      default:
        return "bg-black";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "low":
        return "Baja";
      case "medium":
        return "Media";
      case "high":
        return "Alta";
      default:
        return priority;
    }
  };

  return (
    <div className="h-full w-75 p-6 space-y-6 bg-white border-l border-[#E2E8F0] overflow-y-auto custom-scrollbar transition-all animate-in slide-in-from-right-2 duration-300">
      {/* Header Perfil */}
      <div className="text-center pb-6 border-b border-[#F1F5F9]">
        <div className="rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center w-16 h-16 mx-auto mb-3 shadow-sm">
          <span className="text-lg font-bold text-[#0F172A]">{initials}</span>
        </div>

        <h2 className="text-lg font-bold text-[#0F172A] mb-0.5">{contact.firstName}</h2>
        <div className="text-xs text-[#64748B] space-y-0.5">
          <p className="hover:text-[#0D9488] transition-colors cursor-pointer">{contact.email}</p>
          <p className="hover:text-[#0D9488] transition-colors cursor-pointer">{contact.phone}</p>
        </div>
      </div>

      {/* Menú de Acordeones */}
      <Accordion className="w-full space-y-3">
        {/* Acciones Rápidas */}
        <AccordionItem
          value="actions"
          className="border border-[#E2E8F0] rounded-lg px-3.5 bg-white shadow-sm overflow-hidden"
        >
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center justify-center gap-2 text-[#1E293B]">
              <Pencil className="size-5" />
              <span className="text-sm font-bold">Acciones Rápidas</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 px-0.5">
            <div className="space-y-2">
              <button
                onClick={() => navigate("/tasks")}
                className="w-full text-left px-3 py-2 rounded-lg font-bold text-[12px] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0D9488] transition-colors border border-transparent hover:border-[#E2E8F0]"
              >
                Crear Tarea
              </button>
              <button
                onClick={() => navigate(`/contacts/${contact.id}`)}
                className="w-full text-left px-3 py-2 rounded-lg font-bold text-[12px] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0D9488] transition-colors border border-transparent hover:border-[#E2E8F0]"
              >
                Agregar Nota
              </button>
              <button
                onClick={() => navigate(`/contacts/${contact.id}`)}
                className="w-full text-left px-3 py-2 rounded-lg font-bold text-[12px] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0D9488] transition-colors border border-transparent hover:border-[#E2E8F0]"
              >
                Gestionar Etiqueta
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
            <div className="flex items-center justify-center gap-2 text-[#1E293B]">
              <ClipboardList className="size-5" />
              <span className="text-sm font-bold">Tareas</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 px-0.5">
            <div className="flex items-start gap-2.5 p-3 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]">
              <div className="flex flex-col gap-1.5">
                {tasks.length === 0 ? (
                  <p className="text-[12px] font-bold text-[#475569] p-3">Sin tareas pendientes.</p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F8FAFC] border"
                    >
                      <div className="space-y-1.5">
                        <p className="text-[12px] font-semibold text-[#0A0A0A]">{task.title}</p>
                        <div className="flex items-center gap-2 text-[#BE123C] font-black text-[10px]">
                          <CheckCircle2 className="size-4" />
                          <span>{task.expirationDate && timeAgo(task.expirationDate)}</span>
                        </div>
                        <p
                          className={`inline-flex items-center px-3 py-2 rounded-lg text-white text-xs font-semibold ${getPriorityStyles(task.priority)}`}
                        >
                          {getPriorityLabel(task.priority)}
                        </p>
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
            <div className="flex items-center justify-center gap-2 text-[#1E293B]">
              <FileText className="size-5" />
              <span className="text-sm font-bold">Notas</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 px-0.5">
            {notes.length === 0 ? (
              <div className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-lg p-3">
                <p className="text-[12px] text-[#92400E] font-bold">Sin notas registradas.</p>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-lg p-3">
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
            <div className="flex items-center justify-center gap-2 text-[#1E293B]">
              <Info className="size-5" />
              <span className="text-sm font-bold">Información</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 px-1">
            <div className="space-y-4 pt-1">
              <div>
                <p className="text-xs/5.5 text-[#0F172A] mb-2">Etiquetas</p>
                <div className="space-x-2">
                  <span className="inline-flex items-center px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[#1E293B] text-xs font-semibold">
                    Empresa
                  </span>
                  <span className="inline-flex items-center px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[#1E293B] text-xs font-semibold">
                    Alta Prioridad
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs/5.5 text-[#0F172A] mb-2">Estado</p>
                <span className="inline-flex items-center px-3 py-2 bg-[#0D9488] border border-[#E2E8F0] rounded-lg text-white text-xs font-semibold">
                  {contact.segmentType === "lead" ? "Prospecto" : "Cliente"}
                </span>
              </div>
              <div>
                <p className="text-xs/5.5 text-[#0F172A] mb-2">Canal</p>
                <span className="inline-flex items-center px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[#1E293B] text-xs font-semibold">
                  {contact.phone ? "Whatsapp" : "Email"}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ChatActions;
