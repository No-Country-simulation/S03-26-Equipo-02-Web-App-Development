import {
  MessageSquare,
  LayoutDashboard,
  Users,
  SquareCheckBig,
  Settings,
} from "lucide-react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";

const Sidebar = () => {
  return (
    <aside className="flex flex-col h-screen w-64 border-r bg-[#f4f5f5]">
      <div className="p-6 border-b flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-[#65bcac] rounded-lg">
          <MessageSquare className="text-white" />
        </div>
        <span className="font-bold text-lg">ChatCRM</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 py-6">
        <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#65bdad] text-white ">
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Dashboard</span>
        </a>

        <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-[#65bdad] transition-colors hover:text-white">
          <MessageSquare size={18} />
          <span className="text-sm">Bandeja</span>
        </a>

        <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-[#65bdad] transition-colors hover:text-white">
          <Users size={18} />
          <span className="text-sm">Contactos</span>
        </a>

        <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-[#65bdad] transition-colors hover:text-white">
          <SquareCheckBig size={18} />
          <span className="text-sm">Tareas</span>
        </a>

        <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-[#65bdad] transition-colors hover:text-white">
          <Settings size={18} />
          <span className="text-sm">Ajustes</span>
        </a>
      </nav>

      <div className="p-6 border-t flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
        <div className="leading-tight">
          <p className="text-sm font-medium">Juan Pérez</p>
          <p className="text-xs text-gray-500">juan@empresa.com</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
