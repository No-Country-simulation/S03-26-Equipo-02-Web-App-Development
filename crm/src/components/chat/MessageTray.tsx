import { useState } from "react";
import { SearchIcon } from "lucide-react";
import type { ConversationPreview } from "@/types/chatTray";

const MOCK_CONVERSATIONS: ConversationPreview[] = [
  {
    id: "1",
    contactName: "Sarah Johnson",
    contactEmail: "sarah@empresa.com",
    lastMessage: "¡Gracias por la rápida respuesta!",
    timestamp: "10:23 AM",
    unreadCount: 2,
    channel: "wa",
    tags: ["empresa"],
  },
  {
    id: "2",
    contactName: "Michael Chen",
    contactEmail: "m.chen@startup.com",
    lastMessage: "¿Podríamos agendar una demo?",
    timestamp: "Ayer",
    unreadCount: 1,
    channel: "email",
    tags: ["startup"],
  },
  {
    id: "3",
    contactName: "David Park",
    contactEmail: "d.park@techfirm.com",
    lastMessage: "Necesito documentos de cumplimiento de seguridad",
    timestamp: "Hace 5 horas",
    unreadCount: 0,
    channel: "email",
    tags: ["empresa", "prospecto-cálido"],
  },
  {
    id: "4",
    contactName: "David Park",
    contactEmail: "d.park@techfirm.com",
    lastMessage: "Necesito documentos de cumplimiento de seguridad",
    timestamp: "Hace 5 horas",
    unreadCount: 0,
    channel: "email",
    tags: ["empresa", "prospecto-cálido"],
  },
  {
    id: "5",
    contactName: "alexis Park",
    contactEmail: "d.park@techfirm.com",
    lastMessage: "Necesito documentos de cumplimiento de seguridad",
    timestamp: "Hace 5 horas",
    unreadCount: 0,
    channel: "email",
    tags: ["empresa", "prospecto-cálido"],
  },
];

const MessageTray = () => {
  const [selectedId, setSelectedId] = useState<string>("3");
  const tabs = ["Todas", "No leídos", "Prospectos", "Clientes"];
  const [activeTab, setActiveTab] = useState("Todas");

  return (
    <div>
      <div className="w-108.75 h-full p-6 bg-white border-r flex flex-col gap-5">
        <header className="space-y-4">
          <h1 className="text-black text-3xl font-bold font-['Inter'] leading-10">
            Bandeja de Entrada
          </h1>

          <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-lg w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 rounded-[3px] text-sm font-semibold transition-colors
        ${
          activeTab === tab
            ? "bg-[#0D9488] text-white"
            : "text-gray-500 bg-white"
        }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              className="w-full h-10 pl-9 pr-3 rounded-xs border border-gray-200 text-sm text-gray-500 bg-[#F8FAFC] focus:outline-none"
            />
          </div>
        </header>

        <section className="p-2 overflow-y-auto custom-scrollbar">
          {MOCK_CONVERSATIONS.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedId(chat.id)}
              className={`p-3 w-full rounded-[5px] text-left transition-all duration-200 mb-2 group relative hover:border-border/50 hover:shadow-sm ${
                selectedId === chat.id
                  ? "bg-[#F0FDFA] shadow-md"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[14px] truncate pr-2">
                  {chat.contactName}
                </h3>
                <span className="text-[12px] text-[#475569] font-semibold">
                  {chat.timestamp}
                </span>
              </div>
              <p className="text-[14px] mb-3 text-[#475569]">
                {chat.lastMessage}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 items-center flex-wrap">
                  <div className="text-[12px] font-inter font-semibold bg-white p-2 text-center rounded-lg border border-[#E2E8F0]">
                    {chat.channel === "wa" ? (
                      <span>Whatsapp</span>
                    ) : (
                      <span>Email</span>
                    )}
                  </div>
                  {chat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[12px] font-inter font-semibold bg-white p-2 text-center rounded-lg border border-[#E2E8F0] "
                    >
                      {tag.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default MessageTray;
