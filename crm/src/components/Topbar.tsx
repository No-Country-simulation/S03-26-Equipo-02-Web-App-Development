import { SearchIcon, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Topbar = () => {
  return (
    <header className="h-14 border-b border-border bg-white flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
      <div className="w-full flex justify-between items-center">
        <div className="overflow-hidden rounded-md border border-input px-2.5 py-1 flex items-center gap-2 w-99 bg-[#f4f5f5]">
          <SearchIcon size={18} className="text-gray-500" />
          <input type="text" placeholder="Buscar contactos,conversaciones, tareas..." className=" bg-transparent border-none focus:outline-none w-full" />
        </div>

        <div className="flex gap-4 items-center">
          <span className="w-8 h-8 hover:bg-gray-100 flex items-center justify-center rounded-md ">
          <Bell size={17} />
          </span>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <h3>Usuraio</h3>

        </div>
      </div>
    </header>
  );
};

export default Topbar;
