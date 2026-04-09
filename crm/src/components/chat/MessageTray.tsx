import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ConversationPreview } from "@/types/chatTray";
import { useContacts } from "@/context/useContacts";

const MOCK_CHAT_DATA = [
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
  {
    contactEmail: "generic",
    lastMessage: "Hola, me gustaría recibir más información sobre el plan enterprise.",
    timestamp: "11:45 AM",
    unreadCount: 0,
    channel: "wa",
  },
  {
    contactEmail: "generic2",
    lastMessage: "Quedo a la espera de su confirmación para la reunión de mañana.",
    timestamp: "Hace 2 días",
    unreadCount: 0,
    channel: "email",
  }
];

const MessageTray = ({ selectedId: controlledId, onSelect }: { selectedId?: string, onSelect?: (id: string) => void }) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string>("1");
  const { contacts } = useContacts();

  const selectedId = controlledId || internalSelectedId;
  const handleSelect = (id: string) => {
    if (onSelect) onSelect(id);
    setInternalSelectedId(id);
  };

  // Combine live contacts with mock chat metadata
  const conversations = contacts.map((contact, index) => {
    const mockData = MOCK_CHAT_DATA.find(m => 
      m.contactEmail.toLowerCase() === contact.email.toLowerCase() ||
      contact.name.toLowerCase().includes("sarah") && m.contactEmail.includes("sarah")
    ) || MOCK_CHAT_DATA[index % MOCK_CHAT_DATA.length];

    return {
      id: contact.id.toString(),
      contactName: contact.name,
      contactEmail: contact.email,
      lastMessage: mockData.lastMessage,
      timestamp: mockData.timestamp,
      unreadCount: mockData.unreadCount,
      channel: mockData.channel,
      tags: contact.tags || [],
      status: contact.status
    };
  });

  return (
    <div>
      <div className="w-96 h-full bg-white border-r">
        <header className="px-5 py-4 border-b border-border space-y-4">
          <h1 className="text-lg font-semibold">Bandeja de Entrada</h1>
          <div>
            <Tabs defaultValue="conversaciones" className="w-full">
              <TabsList className="w-full justify-start border-b">
                <TabsTrigger
                  value="conversaciones"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Todos
                </TabsTrigger>
                <TabsTrigger
                  value="tareas"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  No leídos
                </TabsTrigger>
                <TabsTrigger
                  value="prospectos"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Prospectos
                </TabsTrigger>
                <TabsTrigger
                  value="clientes"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Clientes
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="overflow-hidden flex items-center gap-2 rounded-md border bg-white px-3 py-1">
            <SearchIcon size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Buscar..."
              className=" bg-transparent border-none focus:outline-none w-full hover"
            />
          </div>
        </header>

        <section className="p-2 overflow-y-auto custom-scrollbar h-[calc(100vh-180px)]">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelect(chat.id)}
              className={`p-3.5 border-b w-full rounded-xl text-left transition-all duration-200 mb-1 group relative hover:bg-muted/60 border border-transparent hover:border-border/50 hover:shadow-sm ${
                selectedId === chat.id
                  ? "bg-[#65bcac]/20 border-[#65bcac] shadow-sm"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[15px] truncate pr-2 transition-colors text-slate-900 group-hover:text-black">
                  {chat.contactName}
                </h3>
                <span className="text-[11px] font-semibold text-slate-400">
                  {chat.timestamp}
                </span>
              </div>

              <p className="text-[13px] font-medium mb-3 line-clamp-2 leading-relaxed text-slate-500 group-hover:text-slate-700">
                {chat.lastMessage}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 items-center flex-wrap">
                  <div className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 font-bold uppercase">
                    {chat.channel === "wa" ? "WA" : "Mail"}
                  </div>

                  {chat.unreadCount > 0 && (
                    <span className="h-5 px-2 min-w-5 rounded-full bg-[#0D9488] text-white text-[11px] flex items-center justify-center font-bold shadow-sm">
                      {chat.unreadCount}
                    </span>
                  )}

                  {chat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-white text-slate-500 px-2 py-0.5 rounded border border-slate-200 font-bold lowercase"
                    >
                      {tag}
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
