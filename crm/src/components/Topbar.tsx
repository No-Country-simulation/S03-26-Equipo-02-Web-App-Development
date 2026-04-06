import { Bell } from "lucide-react";


const Topbar = () => {
  return (
    <header className=" bg-white px-6 py-3 bg-Bg-Surface-Default border-b border-Border-Default inline-flex justify-start items-center gap-4">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h3 className="text-md font-medium font-['JetBrains_Mono'] leading-4 text-[#0F766E]">Bandeja</h3>
          <p className="text-md font-medium font-['JetBrains_Mono'] leading-4 text-[#0F766E]">8 conversaciones activas</p>
        </div>

        <div className="flex gap-4 items-center">
          <span className="w-10 h-10 hover:bg-gray-100 flex items-center justify-center rounded-md ">
          <Bell size={17} />
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
