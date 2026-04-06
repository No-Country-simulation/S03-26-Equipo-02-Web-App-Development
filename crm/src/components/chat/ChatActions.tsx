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

const ChatActions = () => {
  return (
    <div className="h-full p-5 space-y-5 bg-white">
      <div className="text-center pb-4 border-b border-border">
        <div className="rounded-full bg-[#65bcac] from-primary to-primary/70 text-primary-foreground flex items-center justify-center font-semibold transition-all duration-200 w-16 h-16 text-lg mx-auto mb-2 shadow-lg ring-4 ring-background">
          DP
        </div>

        <h2 className="text-base font-semibold mb-1">David Park</h2>
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p>d.park@techfirm.com</p>
          <p>+1 555-0128</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase text-muted-foreground mb-3 tracking-wide">
          Acciones rápidas
        </p>

        <button className="flex items-center gap-2 bg-[#65bcac] text-white text-sm px-3 py-2 rounded-md hover:bg-teal-600 transition">
          <CheckSquare className="w-4 h-4" />
          Crear Tarea
        </button>

        <button className="flex items-center gap-2 border text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition">
          <FileText className="w-4 h-4" />
          Agregar Nota
        </button>

        <button className="flex items-center gap-2 border text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition">
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
