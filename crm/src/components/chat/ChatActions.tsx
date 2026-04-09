import {
  CheckSquare,
  FileText,
  Tag,
  ClipboardList,
  File,
  Info,
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
    <div className="h-full p-5 space-y-5 bg-white border-l transition-all animate-in slide-in-from-right-2 duration-300">
      <div className="text-center pb-4 border-b border-border">
        <div className="rounded-full bg-[#0D9488] text-white flex items-center justify-center font-bold transition-all duration-200 w-16 h-16 text-lg mx-auto mb-3 shadow-md">
          {initials}
        </div>

        <h2 className="text-base font-extrabold text-slate-800 mb-1">{contact.name}</h2>
        <div className="text-xs text-slate-400 space-y-0.5 font-semibold">
          <p>{contact.email}</p>
          <p>{contact.phone}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-bold uppercase text-slate-400 mb-3 tracking-wider">
          Acciones rápidas
        </p>

        <button className="flex items-center gap-2 bg-[#0D9488] text-white text-[13px] font-bold px-3 py-2.5 rounded-xl hover:bg-[#0f766c] transition-all shadow-sm shadow-[#0D9488]/10 cursor-pointer">
          <CheckSquare className="w-4 h-4" />
          Crear Tarea
        </button>

        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-[13px] font-bold px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
          <FileText className="w-4 h-4" />
          Agregar Nota
        </button>

        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-[13px] font-bold px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer">
          <Tag className="w-4 h-4" />
          Gestionar Etiquetas
        </button>
      </div>

      <Accordion className="max-w-lg gap-3">
        <AccordionItem className="border rounded-lg px-3" value="shipping">
          <AccordionTrigger className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <ClipboardList size={15} color="#717182" />
            Tareas
          </AccordionTrigger>

          <AccordionContent></AccordionContent>
        </AccordionItem>

        <AccordionItem className="border rounded-lg px-3" value="returns">
          <AccordionTrigger className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <File size={15} color="#717182" />
            Notas
          </AccordionTrigger>

          <AccordionContent></AccordionContent>
        </AccordionItem>

        <AccordionItem className="border rounded-lg px-3" value="support">
          <AccordionTrigger className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Info size={15} color="#717182" />
            Informacion
          </AccordionTrigger>

          <AccordionContent></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ChatActions;
