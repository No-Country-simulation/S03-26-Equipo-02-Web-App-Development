import { MoreVertical, ChevronDown, Send } from "lucide-react";
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
        time: "10:23 AM",
        sender: "other" as const,
      },
      {
        id: 2,
        text: "¡Hola! Con gusto te ayudo con eso. ¿Prefieres que lo hablemos por aquí o agendamos una breve llamada?",
        time: "10:25 AM",
        sender: "me" as const,
      },
      {
        id: 3,
        name: contact.name,
        text: MOCK_MESSAGES_TEMPLATES[(seed + 1) % MOCK_MESSAGES_TEMPLATES.length],
        time: "10:30 AM",
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
    <div className="flex-1 flex flex-col bg-slate-50/30 h-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0D9488] flex items-center justify-center text-white font-bold shadow-md">
            {initials}
          </div>
          <div className="flex flex-col">
            <h2 className="font-extrabold text-slate-900 text-[15px]">{contact.name}</h2>
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
              <span className="text-[#0D9488]">WhatsApp •</span>
              <span>{contact.email}</span>
            </div>
          </div>
          <div className="relative ml-4">
            <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group">
              <span className="capitalize text-slate-600 group-hover:text-slate-900">{contact.status}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
            </button>
            {open && (
              <div className="absolute top-10 left-0 w-36 bg-white border border-slate-100 rounded-xl shadow-xl z-[100] p-1.5 animate-in zoom-in-95 duration-200">
                <button onClick={() => handleStatusChange("Prospecto")} className="w-full text-left px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-[#0D9488]/10 hover:text-[#0D9488] rounded-lg transition-colors">Prospecto</button>
                <button onClick={() => handleStatusChange("Cliente")} className="w-full text-left px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-[#0D9488]/10 hover:text-[#0D9488] rounded-lg transition-colors">Cliente</button>
              </div>
            )}
          </div>
        </div>
        <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"><MoreVertical className="w-5 h-5" /></button>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <p className="px-4 py-1 bg-slate-100/80 rounded-full text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Hoy</p>
          </div>
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className="flex flex-col max-w-[75%]">
                {msg.sender === "other" && msg.name && <p className="text-[10px] font-bold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">{msg.name}</p>}
                <div className={`rounded-2xl px-5 py-3.5 text-sm shadow-sm transition-all hover:shadow-md ${msg.sender === "me" ? "bg-[#0D9488] text-white rounded-tr-none" : "bg-white text-slate-800 border border-slate-50 rounded-tl-none"}`}>
                  <p className="font-semibold leading-relaxed">{msg.text}</p>
                  <span className={`block text-[9px] font-bold mt-2.5 uppercase tracking-tighter ${msg.sender === "me" ? "text-[#CCFBF1] text-right" : "text-slate-400"}`}>{msg.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border-t px-6 py-4 flex items-center gap-4 sticky bottom-0">
        <div className="flex-1 relative">
           <input type="text" placeholder={`Escribe un mensaje a ${contact.name}...`} className="w-full h-12 bg-slate-50/50 border border-slate-100 rounded-xl px-5 py-2 text-sm font-semibold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-[#0D9488]/10 focus:bg-white transition-all" />
        </div>
        <button className="h-12 px-6 bg-[#0D9488] text-white rounded-xl text-sm font-bold hover:bg-[#0f766c] shadow-lg shadow-[#0D9488]/20 transition-all active:scale-[0.98] flex items-center gap-2 group cursor-pointer">
          <span>Enviar</span>
           <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
