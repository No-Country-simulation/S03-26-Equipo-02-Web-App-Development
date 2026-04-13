import { Ellipsis, ChevronDown, Send, Paperclip } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useContacts } from "@/context/useContacts";

const MOCK_MESSAGES_TEMPLATES = [
  "Hola, estoy evaluando soluciones CRM para nuestra empresa. ¿Pueden compartir su documentación?",
  "¡Por supuesto! Te enviaré nuestro informe de seguridad de inmediato.",
  "¡Excelente! Además, ¿cuál es su enfoque de encriptación de datos?",
  "¿Tendrán disponibilidad para una llamada mañana?",
  "Gracias por la información, lo revisaré con mi equipo.",
  "¿Cuál es la diferencia entre el plan Pro y el Enterprise?"
];

const ChatWindow = ({ contactId }: { contactId: number | null }) => {
  const { contacts, setContacts } = useContacts();
  const contact = contacts.find(c => c.id === contactId) || contacts[0];
  const [open, setOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const initials = contact?.name.split(" ").map(n => n[0]).join("").substring(0, 2);

  const chatMessages = useMemo(() => {
    if (!contact) return [];
    const seed = contact.id;
    return [
      {
        id: 1,
        name: contact.name,
        text: MOCK_MESSAGES_TEMPLATES[seed % MOCK_MESSAGES_TEMPLATES.length],
        time: "3:15 PM",
        sender: "other" as const,
      },
      {
        id: 2,
        text: "¡Por supuesto! Estamos certificados SOC 2 Type II y cumplimos con GDPR. Te enviaré nuestro informe de seguridad y documentación de cumplimiento de inmediato.",
        time: "3:20 PM",
        sender: "me" as const,
      },
      {
        id: 3,
        name: contact.name,
        text: MOCK_MESSAGES_TEMPLATES[(seed + 1) % MOCK_MESSAGES_TEMPLATES.length],
        time: "4:45 PM",
        sender: "other" as const,
      }
    ];
  }, [contact?.id]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [contact?.id, chatMessages]);

  if (!contact) return null;

  const handleStatusChange = (newStatus: string) => {
     setContacts(contacts.map(c => 
      c.id === contact.id ? { ...c, status: newStatus } : c
    ));
    setOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b bg-white border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center font-bold text-[#0F172A] text-sm">
            {initials}
          </div>

          <div className="flex flex-col">
            <h2 className="font-bold text-[#0F172A] text-base leading-tight">{contact.name}</h2>
            <div className="text-xs text-[#64748B]">
              <span>{contact.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              <span className="text-[11px] font-bold text-[#475569] capitalize tracking-wide">{contact.status}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#0D9488] transition-colors" />
            </button>

            {open && (
              <div className="absolute top-full mt-2 right-0 w-44 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl z-20 overflow-hidden p-2 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => handleStatusChange("prospecto")}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-bold rounded-xl transition-all ${
                    contact.status?.toLowerCase() === "prospecto"
                      ? "bg-[#0D9488] text-white"
                      : "text-[#475569] hover:bg-[#F0FDFA] hover:text-[#0D9488]"
                  }`}
                >
                  <span>Prospecto</span>
                  {contact.status?.toLowerCase() === "prospecto" && <span className="text-lg">✓</span>}
                </button>
                <button
                  onClick={() => handleStatusChange("cliente")}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-bold rounded-xl transition-all mt-1 ${
                    contact.status?.toLowerCase() === "cliente"
                      ? "bg-[#0D9488] text-white"
                      : "text-[#475569] hover:bg-[#F0FDFA] hover:text-[#0D9488]"
                  }`}
                >
                  <span>Cliente</span>
                  {contact.status?.toLowerCase() === "cliente" && <span className="text-lg">✓</span>}
                </button>
              </div>
            )}
          </div>

          <button className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors">
            <Ellipsis className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-8 py-6 scroll-smooth bg-[#FAFAFA] custom-scrollbar">
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <p className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-lg text-[10px] font-black text-[#64748B] tracking-widest uppercase">
              Hoy
            </p>
          </div>
          
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"} max-w-[75%]`}>
                {msg.sender === "other" && msg.name && (
                  <p className="text-[12px] font-bold text-[#1E293B] mb-1.5 ml-1">{msg.name}</p>
                )}

                <div
                  className={`relative rounded-xl px-4 py-3 text-[14px] leading-relaxed shadow-sm transition-all duration-200 ${
                    msg.sender === "me"
                      ? "bg-[#0D9488] text-white rounded-br-none"
                      : "bg-white text-[#334155] border border-[#E2E8F0] rounded-bl-none"
                  }`}
                >
                  <p className="font-medium">{msg.text}</p>

                  <span
                    className={`block text-[10px] font-bold mt-2.5 ${
                      msg.sender === "me"
                        ? "text-teal-100 text-right"
                        : "text-[#94A3B8]"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-[#E2E8F0] sticky bottom-0">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-[#F8FAFC] px-4 py-1.5 rounded-xl border border-[#E2E8F0] shadow-sm focus-within:ring-2 focus-within:ring-[#0D9488]/10 focus-within:border-[#0D9488] transition-all">
          <input
            type="text"
            placeholder={`Escribe un mensaje...`}
            className="flex-1 bg-transparent border-none py-2 text-[14px] text-[#334155] placeholder:text-[#94A3B8] focus:ring-0"
          />
          <button className="p-2 text-[#64748B] hover:text-[#0D9488] hover:bg-white rounded-lg transition-all duration-200">
            <Paperclip size={18} />
          </button>
          <button className="bg-[#0D9488] flex items-center gap-2 text-white px-5 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#0B7A6F] shadow-lg shadow-[#0D9488]/10 transition-all active:scale-95">
            <Send size={15} />
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
