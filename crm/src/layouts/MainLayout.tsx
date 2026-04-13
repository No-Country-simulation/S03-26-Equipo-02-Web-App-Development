import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar/>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar/>
        <main className="flex-1 overflow-hidden bg-gray-50">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}
