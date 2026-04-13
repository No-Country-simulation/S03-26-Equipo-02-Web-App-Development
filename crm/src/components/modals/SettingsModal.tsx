import { X } from "lucide-react";
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-[#0F172A52]" />
      <div className="relative bg-white rounded-lg z-10">
        <div className="bg-white rounded-[8px] p-6 w-160 h-65.5 flex flex-col gap-4 shadow-[#0F172A29]">
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-[16px]">
                Crear una nueva etiqueta
              </h3>
              <p className="text-[#475569] font-bold text-sm">
                Agregar una nueva etiqueta para organizar tus contactos
              </p>
            </div>
            <span
              className="w-10 h-10 flex justify-center bg-[#E11D48] border-[#FDA4AF] items-center rounded-lg cursor-pointer hover:bg-red-500"
              onClick={onClose}
            >
              <X color="#fff" />
            </span>
          </div>

          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="text-[14px] font-semibold">
              Nombre de la Etiqueta
            </label>
            <input
              type="text"
              placeholder="Prouesta"
              className="w-full border rounded-[5px] px-3 py-2 outline-none focus:shadow-[0_0_0_3px_rgba(13,148,136,0.2)] focus:border-[#0D9488]"
            />
            <button
              disabled:opacity-50
              type="submit"
              className="flex justify-center bg-[#0D9488] text-white font-semibold text-[14px] px-8 py-3 w-full mt-3 rounded-[5px] hover:bg-[#0B7A6F]"
            >
              Crear Etiqueta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
