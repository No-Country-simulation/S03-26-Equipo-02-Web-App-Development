import {
  MessageSquare,
  LayoutDashboard,
  Users,
  MessageSquareText,
  SquareCheckBig,
  Settings,
} from "lucide-react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

import { NavLink } from "react-router-dom";

const navMain = [
  { icon: MessageSquareText, label: "Bandeja", to: "/" },
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: Users, label: "Contactos", to: "/contacts" },
  { icon: SquareCheckBig, label: "Tareas", to: "/tasks" },
];

const navConfig = [{ icon: Settings, label: "Ajustes", to: "/settings" }];

const Sidebar = () => {
  return (
    <aside className="w-60 h-screen p-6 bg-[#F8FAFC] inline-flex flex-col justify-start items-start gap-8">
      <div className="self-stretch py-4 border-b border-gray-200 inline-flex justify-start items-center gap-2.5">
        <div className="w-8 h-8 px-1.5 bg-linear-to-br bg-[#61B5A9] rounded-lg shadow-sm flex justify-center items-center shrink-0">
          <MessageSquare size={16} className="text-white" />
        </div>
        <span className="text-neutral-950 text-base font-semibold">ChatCRM</span>
      </div>
      <nav className="self-stretch flex-1 border-b border-gray-200 flex flex-col justify-start items-start gap-4">
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <p className="text-xs font-medium text-gray-400 tracking-widest uppercase font-mono">
            Core Dashboard
          </p>
          {navMain.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `self-stretch h-10 px-4 py-2 rounded-lg inline-flex justify-start items-center gap-2 transition-colors ${
                  isActive
                    ? "bg-[#0D9488] text-white"
                    : "bg-[#F8FAFC] text-gray-700 hover:bg-[#65bdad]/10 hover:text-[#65bdad]"
                }`
              }
            >
              <Icon size={20} />
              <span className="flex-1 text-sm font-semibold">{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <p className="text-xs font-medium text-gray-400 tracking-widest uppercase font-mono">
            Configuración
          </p>
          {navConfig.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `self-stretch h-10 px-4 py-2 rounded-lg inline-flex justify-start items-center gap-2 transition-colors ${
                  isActive
                    ? "bg-[#0D9488] text-white"
                    : "bg-[#F8FAFC] text-gray-700 hover:bg-[#65bdad]/10 hover:text-[#65bdad]"
                }`
              }
            >
              <Icon size={20} />
              <span className="flex-1 text-sm font-semibold">{label}</span>
            </NavLink>
          ))}
        </div>

      </nav>

      {/* Usuario */}
      <div className="px-3 py-2 bg-[#F8FAFC] rounded-lg inline-flex justify-start items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors w-full">
        <div className="relative w-8 h-8 shrink-0">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback className="text-xs">JP</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
        </div>
        <div className="flex flex-col justify-start items-start flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate">Juan Pérez</p>
          <p className="text-xs font-semibold text-gray-500 truncate">juan@empresa.com</p>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
