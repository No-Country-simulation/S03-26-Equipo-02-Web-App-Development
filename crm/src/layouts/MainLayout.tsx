import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { HelpCircle } from "lucide-react";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar/>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar/>
        <main className="flex-1 overflow-hidden bg-gray-50">
          <Outlet/>
        </main>
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#0D9488] rounded-full shadow-lg hover:shadow-xl hover:bg-[#0f766c] transition-all flex items-center justify-center z-50 cursor-pointer">
        <HelpCircle className="w-6 h-6 text-white" />
      </button>
      </div>
    </div>
  );
}
