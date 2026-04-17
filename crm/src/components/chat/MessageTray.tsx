import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import type { ApiMessage } from "@/types/ApiMessage";
import type { ApiContact } from "@/types/ApiContacts";

interface MessageTrayProps {
  selectedId?: string;
  onSelect?: (id: string) => void;
}


const MessageTray = ({selectedId: controlledId,onSelect,}: MessageTrayProps) => {
  
  const [internalSelectedId, setInternalSelectedId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("Todas");
  const [messages, setMessages] = useState<ApiMessage[]>([]);

  const selectedId = controlledId || internalSelectedId;
  const tabs = ["Todas", "No leídos", "Prospectos", "Clientes"];

const [allContacts, setAllContacts] = useState<ApiContact[]>([]);

useEffect(() => {
  fetch("https://s03-26-equipo-02-web-app-development.onrender.com/messages")
    .then(res => res.json())
    .then(json => setMessages(json.data));

  fetch("https://s03-26-equipo-02-web-app-development.onrender.com/contacts")
    .then(res => res.json())
    .then(json => setAllContacts(json.data));
}, []);

  const handleSelect = (id: string) => {
    if (onSelect) onSelect(id);
    setInternalSelectedId(id);
  };

  const conversationMap = new Map<string, ApiMessage>();

  for (const msg of messages) {
    const contactId = msg.contact.id;
    const existing = conversationMap.get(contactId);

    if (!existing || new Date(msg.createdAt) > new Date(existing.createdAt)) {
      conversationMap.set(contactId, msg);
    }
  }

  const unreadCountMap = new Map<string, number>();

  for (const msg of messages) {
    if (!msg.isRead) {
      const count = unreadCountMap.get(msg.contact.id) || 0;
      unreadCountMap.set(msg.contact.id, count + 1);
    }
  }

const conversationsWithMessages = Array.from(conversationMap.values()).map(msg => ({
  id: msg.contact.id,
  contactName: `${msg.contact.firstName} ${msg.contact.lastName}`.trim(),
  contactEmail: msg.contact.email,
  lastMessage: msg.content,
  timestamp: msg.createdAt,
  unreadCount: unreadCountMap.get(msg.contact.id) || 0,
  channel: msg.channel.type,
  tags: ["Cliente", "Interesado"],
}));

// IDs que ya tienen mensajes
const contactIdsWithMessages = new Set(conversationsWithMessages.map(c => c.id));

// Contactos sin mensajes
const conversationsWithoutMessages = allContacts
  .filter(c => !contactIdsWithMessages.has(c.id))
  .map(c => ({
    id: c.id,
    contactName: `${c.firstName} ${c.lastName}`.trim(),
    contactEmail: c.email,
    lastMessage: "Sin mensajes",
    timestamp: "",
    unreadCount: 0,
    channel: c.phone ? "whatsapp" : "email",
    tags: [],
  }));

const conversations = [...conversationsWithMessages, ...conversationsWithoutMessages];

  const channelLabel: Record<string, string> = {
    whatsapp: "Whatsapp",
    email: "Email",
  };
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
          <SearchIcon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
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
                    {new Date(chat.timestamp).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </span>
            </div>

            <p className="text-[14px] text-[#475569] line-clamp-1 mb-4 leading-relaxed">
              {chat.lastMessage}
            </p>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-3 py-1.5 text-[11px] font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
                {channelLabel[chat.channel] ?? chat.channel}
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
