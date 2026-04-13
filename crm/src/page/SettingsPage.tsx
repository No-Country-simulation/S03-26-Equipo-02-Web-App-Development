import SettingsModal from "@/components/modals/SettingsModal";
import { Plus, Tag, X, CircleAlert, Check } from "lucide-react";
import { useState } from "react";

interface TagItem {
  id: number;
  label: string;
}

const initialTags: TagItem[] = [
  { id: 1, label: "Propuesta" },
  { id: 2, label: "Empresa" },
  { id: 3, label: "Startup" },
  { id: 4, label: "Alta Prioridad" },
  { id: 5, label: "Demo Solicitado" },
  { id: 6, label: "Agencia" },
  { id: 7, label: "Prospecto Cálido" },
  { id: 8, label: "Onboarding" },
  { id: 9, label: "Evaluación" },
];

const SettingsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="p-8 flex flex-col gap-6 h-full bg-white">
      <div>
        <h1 className="text-[32px] font-bold mb-2">Ajustes</h1>
        <p className="text-sm font-bold">
          Configura aquí las preferencias de la aplicación.
        </p>
      </div>

      <div className="flex flex-col gap-4 p-6 border rounded-lg">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Etiquetas</h3>
            <p className="font-semibold">
              Organiza y clasifica tus contactos con etiquetas personalizadas
            </p>
          </div>
          <button
            className="flex gap-2 items-center bg-[#0D9488] text-white px-8 py-3 rounded-lg hover:bg-[#0B7A6F]"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus />
            Agregar Etiquetas
          </button>
          <SettingsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>

        <div className="flex flex-col w-full">
          {initialTags.map((tag) => (
            <div
              key={tag.id}
              className="w-full flex items-center border rounded-[8px] px-3 py-2 justify-between"
            >
              <div className="flex items-center">
                <Tag size={16} />
                <span className="ml-2 font-semibold">{tag.label}</span>
              </div>
              <X className="cursor-pointer" size={16} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 border rounded-lg">
        <h3 className="font-semibold text-[16px]">Resumen de Actividad</h3>

        <div className="flex flex-col w-full gap-3">
          <div className="flex justify-between">
            <div className="flex gap-4 items-center">
              <span className=" bg-[#F0F9FF] p-2.5 rounded-[8px]">
                <CircleAlert color="#0369a1" className="" />
              </span>
              <div>
                <h4 className="font-bold text-[14px]">Prospecto</h4>
                <span className="text-[14px] text-[#475569]">
                  Contacto potencial, aun no convertido
                </span>
              </div>
            </div>
            <button className=" font-semibold px-4 py-2 rounded-[8px] border">
              Estado por defecto
            </button>
          </div>

          <div className="flex justify-between border-t pt-3">
            <div className="flex gap-4 items-center">
              <span className=" bg-[#ECFDF5] p-2.5 rounded-[8px]">
                <Check color="#21886a" className="" />
              </span>
              <div>
                <h4 className="font-bold text-[14px]">Cliente</h4>
                <span className="text-[14px] text-[#475569]">
                  Cliente activo que ha realizado una compra
                </span>
              </div>
            </div>
            <button className=" font-semibold px-4 py-2 rounded-[8px] border">
              Activo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
