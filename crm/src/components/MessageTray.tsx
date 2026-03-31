import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  return (
    <div>
            <div className="w-96 h-full bg-gray-50 border-r">
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
                  No leídos {0}
                </TabsTrigger>
                <TabsTrigger
                  value="prospectos"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Prospecto
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

        <section className="p-2 overflow-y-auto custom-scrollbar">
          {MOCK_CONVERSATIONS.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedId(chat.id)}
              className={`p-3.5 border-b w-full rounded-xl text-left transition-all duration-200 mb-1 group relative hover:bg-muted/60 border border-transparent hover:border-border/50 hover:shadow-sm ${
                selectedId === chat.id
                  ? "bg-[#65bcac]/20 border-[#65bcac] shadow-sm"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-[15px] truncate pr-2 transition-colors text-foreground/85 group-hover:text-foreground">
                  {chat.contactName}
                </h3>
                <span className="text-[11px] text-gray-400">
                  {chat.timestamp}
                </span>
              </div>

              <p className="text-[14px] mb-3 line-clamp-2 leading-relaxed text-muted-foreground group-hover:text-foreground/70">
                {chat.lastMessage}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 items-center flex-wrap">
                  <div
                    className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200 capitalize"
                  >
                    {chat.channel === "wa" ? (
                      <span>WA</span>
                    ) : (
                      <span>Mail</span>
                    )}
                  </div>

                  {chat.unreadCount > 0 && (
                    <span className="h-5 px-2 min-w-5 rounded-full bg-[#65bcac] from-primary to-primary/90 text-primary-foreground text-[11px] flex items-center justify-center font-semibold shadow-sm">
                      {chat.unreadCount}
                    </span>
                  )}

                  {chat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200 capitalize"
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
  )
}

export default MessageTray
