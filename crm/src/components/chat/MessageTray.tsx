import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { useContacts } from "@/context/useContacts";

const MOCK_CHAT_METADATA = [
  {
    contactEmail: "sarah@empresa.com",
    lastMessage: "¡Gracias por la rápida respuesta! La demo fue excelente.",
    timestamp: "10:23 AM",
    unreadCount: 2,
    channel: "wa",
  },
  {
    contactEmail: "m.chen@startup.com",
    lastMessage: "¿Podríamos agendar una demo para el equipo técnico?",
    timestamp: "Ayer",
    unreadCount: 1,
    channel: "email",
  },
  {
    contactEmail: "d.park@techfirm.com",
    lastMessage: "Necesito los documentos de cumplimiento de seguridad actualizados.",
    timestamp: "Hace 5 horas",
    unreadCount: 0,
    channel: "email",
  },
];

interface MessageTrayProps {
  selectedId?: string;
  onSelect?: (id: string) => void;
}

const MessageTray = ({ selectedId: controlledId, onSelect }: MessageTrayProps) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string>("2");
  const [activeTab, setActiveTab] = useState("Todas");
  const { contacts } = useContacts();

  const selectedId = controlledId || internalSelectedId;
  const tabs = ["Todas", "No leídos", "Prospectos", "Clientes"];

  const handleSelect = (id: string) => {
    if (onSelect) onSelect(id);
    setInternalSelectedId(id);
  };

  const conversations = contacts.map((contact, index) => {
    const mock = MOCK_CHAT_METADATA.find(m => 
      m.contactEmail.toLowerCase() === contact.email.toLowerCase() ||
      (contact.name.toLowerCase().includes("sarah") && m.contactEmail.includes("sarah"))
    ) || MOCK_CHAT_METADATA[index % MOCK_CHAT_METADATA.length];

    return {
      id: contact.id.toString(),
      contactName: contact.name,
      contactEmail: contact.email,
      lastMessage: mock.lastMessage,
      timestamp: mock.timestamp,
      unreadCount: mock.unreadCount,
      channel: mock.channel,
      tags: contact.tags || [],
    };
  });

  return (
    <div className="w-[380px] h-screen bg-white border-r flex flex-col overflow-hidden">
      <header className="p-6 space-y-6">
        <h1 className="text-[#020617] text-3xl font-bold tracking-tight">
          Bandeja de Entrada
        </h1>

        <div className="flex items-center gap-2 bg-[#F8FAFC] p-1.5 rounded-xl border border-[#F1F5F9]">
          {tabs.map((tab) => {
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all duration-200 whitespace-nowrap
        ${
          activeTab === tab
            ? "bg-[#0D9488] text-white shadow-md shadow-[#0D9488]/20"
            : "text-[#475569] hover:bg-white hover:shadow-sm"
        }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="relative w-full">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#E2E8F0] text-sm text-[#475569] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all placeholder:text-[#94A3B8]"
          />
        </div>
      </header>

      <section className="flex-1 px-4 pb-6 overflow-y-auto custom-scrollbar space-y-3">
        {conversations.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleSelect(chat.id)}
            className={`p-5 w-full rounded-2xl text-left transition-all duration-300 cursor-pointer relative ${
              selectedId === chat.id
                ? "bg-[#F0FDFA] border border-[#CCFBF1] shadow-sm"
                : "hover:bg-gray-50 border border-transparent"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[#0F172A] text-[15px]">
                {chat.contactName}
              </h3>
              <span className="text-[11px] text-[#64748B] font-semibold">
                {chat.timestamp}
              </span>
            </div>
            
            <p className="text-[14px] text-[#475569] line-clamp-1 mb-4 leading-relaxed">
              {chat.lastMessage}
            </p>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-3 py-1.5 text-[11px] font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
                {chat.channel === "wa" ? "Whatsapp" : "Email"}
              </span>
              {chat.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-[11px] font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-xl shadow-xs"
                >
                  {tag.replace("-", " ")}
                </span>
              ))}
              {chat.tags.length > 2 && (
                <span className="px-2.5 py-1.5 text-[11px] font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
                  +{chat.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default MessageTray;
