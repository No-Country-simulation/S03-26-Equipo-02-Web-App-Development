import { Pencil, ListTodo, File, Info, Clock, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Checkbox } from "@/components/ui/checkbox";

const ChatActions = () => {
  return (
    <div className="h-full p-5 space-y-5 bg-white">
      <div className="text-center pb-4 border-b border-border">
        <div className="rounded-full bg-[#F8FAFC] flex items-center justify-center w-16 h-16 text-lg mx-auto mb-2">
          <h1 className="text-[16px] font-semibold">DP</h1>
        </div>

        <h2 className="text-base font-semibold mb-1">David Park</h2>
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p>d.park@techfirm.com</p>
          <p>+1 555-0128</p>
        </div>
      </div>

      <Accordion className="max-w-lg gap-4">
        <AccordionItem
          className="shadow-xs rounded-lg px-3 bg-[#F8FAFC]"
          value="acciones"
        >
          <AccordionTrigger className="flex items-center gap-2 font-bold">
            <Pencil size={20} color="#0F172A" />
            Acciones Rápidas
          </AccordionTrigger>

          <AccordionContent>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 rounded-md font-bold hover:bg-gray-100">
                Crear Tarea
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md font-bold hover:bg-gray-100">
                Agregar Nota
              </button>
              <button className="w-full text-left px-4 py-2 rounded-md font-bold hover:bg-gray-100">
                Gestion de Etiquetas
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          className="shadow-xs rounded-lg px-3 bg-[#F8FAFC]"
          value="tareas"
        >
          <AccordionTrigger className="flex items-center gap-2  font-bold">
            <ListTodo size={20} color="#0F172A" />
            Tareas
          </AccordionTrigger>

          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Checkbox id="task-1" className="mt-1" />
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="task-1"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Preparar demo personalizada para el equipo de Sarah
                  </label>
                  <span className="flex items-center gap-2">
                    <Clock size={16} color="#BE123C" />
                    <p className="font-semibold text-[12px] text-[#BE123C]">
                      Vence hoy
                    </p>
                  </span>
                  <span className="text-xs bg-red-500 text-white px-3 py-2 rounded-[8px] w-fit">
                    Alta
                  </span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          className="shadow-xs rounded-lg px-3 bg-[#F8FAFC]"
          value="notas"
        >
          <AccordionTrigger className="flex items-center gap-2 font-bold ">
            <File size={20} color="#0F172A" />
            Notas
          </AccordionTrigger>

          <AccordionContent>
            <div className="space-y-3 bg-amber-100 flex justify-around border rounded-lg p-3">
              <p className="w-30 font-semibold">Esta es una nota de ejemplo. mas texto de prueba para ver cómo se muestra en la interfaz.</p>
              <button className="flex justify-center items-center cursor-pointer h-10 w-10 bg-red-500 text-white rounded-[8px]">
                <Trash2 size={20} />
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          className="shadow-xs rounded-lg px-3 bg-[#F8FAFC]"
          value="informacion"
        >
          <AccordionTrigger className="flex items-center gap-2  font-bold">
            <Info size={20} color="#0F172A" />
            Informacion
          </AccordionTrigger>

          <AccordionContent>
            <div className="space-y-3">
              <div>
                <h2>Etiquetas</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-white font-semibold border rounded-[8px] px-3 py-2 text-xs w-fit">
                    Empresa
                  </span>
                  <span className="bg-white font-semibold border rounded-[8px] px-3 py-2 text-xs w-fit">
                    Alta Prioridad
                  </span>
                </div>
              </div>

              <div>
                <h2>Estado</h2>
                <p className="bg-[#0D9488] mt-2 text-white font-semibold border rounded-[8px] px-3 py-2 text-xs w-fit">Cliente</p>
              </div>

              <div>
                <h2>Canal</h2>
                <p className="bg-white mt-2 font-semibold border rounded-[8px] px-3 py-2 text-xs w-fit">Whatsapp</p>
              </div>
            </div>



          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ChatActions;
