import { Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useContacts } from "@/context/useContacts";
import { useState, useEffect } from "react";
import { getTasks } from "@/services/tasks";

const Topbar = () => {
  const location = useLocation();
  const { contacts } = useContacts();
  const [tasksCount, setTasksCount] = useState(0);

  useEffect(() => {
    // Obtener las tareas al montar el componente
    getTasks().then(res => {
      const data = Array.isArray(res) ? res : (res?.data || []);
      setTasksCount(data.filter((t:any) => !t.complete && !t.completed && t.status !== "completed").length);
    }).catch(e => console.error(e));

    // Escuchar el evento que emitirá TasksPage
    const handleTasksUpdate = (e: any) => {
      setTasksCount(e.detail);
    };
    window.addEventListener("tasksUpdated", handleTasksUpdate);
    
    return () => window.removeEventListener("tasksUpdated", handleTasksUpdate);
  }, []);

  const getPageInfo = () => {
    const path = location.pathname;
    
    // Normalize path to ignore trailing slashes
    const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");

    if (normalizedPath === "/dashboard") {
      return {
        title: "Dashboard",
        subtitle: `${contacts.length} registros activos`
      };
    }
    if (normalizedPath === "/" || normalizedPath === "/tray") {
      return {
        title: "Bandeja",
        subtitle: `${contacts.length} conversaciones activas`
      };
    }
    if (normalizedPath === "/contacts") {
      return {
        title: "Contactos",
        subtitle: `${contacts.length} registros activos`
      };
    }
    if (normalizedPath.startsWith("/contacts/")) {
      return {
        title: "Detalle de Contacto",
        subtitle: "Visualizando perfil del cliente"
      };
    }

    if (normalizedPath === "/tasks") {
      return {
        title: "Tareas",
        subtitle: `${tasksCount} tareas pendientes`
      };
    }
    if (normalizedPath === "/settings") {
      return {
        title: "Ajustes",
        subtitle: "Configuración del sistema"
      };
    }
    return {
      title: "ChatCRM",
      subtitle: "Panel de Gestión"
    };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="bg-white px-6 py-4 border-b border-slate-100 flex items-center min-h-[72px]">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-[#0D9488] uppercase tracking-widest">{title}</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{subtitle}</p>
        </div>

        <div className="flex gap-4 items-center">
          <button className="w-10 h-10 hover:bg-slate-50 flex items-center justify-center rounded-xl transition-colors relative border border-slate-50 cursor-pointer">
            <Bell size={18} className="text-slate-600" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
