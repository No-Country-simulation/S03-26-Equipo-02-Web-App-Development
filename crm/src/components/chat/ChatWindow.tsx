import { Ellipsis, ChevronDown, Send, Paperclip } from "lucide-react";
import { useState, useRef, useEffect } from "react";
//import { useContacts } from "@/context/useContacts";
import type { ApiMessage } from "@/types/ApiMessage";

interface ChatWindowProps {
  contactId: string | null;
  contact: ApiMessage["contact"] | null;
}

const ChatWindow = ({ contactId, contact }: ChatWindowProps) => {
  const [open, setOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ApiMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const initials = `${contact?.firstName ?? ""} ${contact?.lastName ?? ""}`
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);

  useEffect(() => {
    if (!contactId) return;

    fetch("https://s03-26-equipo-02-web-app-development.onrender.com/messages")
      .then((res) => res.json())
      .then((json) => {
        const filtered = json.data
          .filter((m: ApiMessage) => m.contact.id === contactId)
          .sort(
            (a: ApiMessage, b: ApiMessage) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
        setChatMessages(filtered);
      });
  }, [contactId]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [contact?.id, chatMessages]);

  if (!contact) return null;

  const handleSend = async () => {
    if (!messageText.trim()) return;

    if (contact?.phone) {
      await fetch(
        "https://s03-26-equipo-02-web-app-development.onrender.com/twilio/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: `whatsapp:${contact.phone}`,
            body: messageText,
          }),
        },
      );
    } else if (contact?.email) {
      await fetch(
        "https://s03-26-equipo-02-web-app-development.onrender.com/brevo/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: contact.email,
            subject: "",
            htmlContent: `<p>${messageText}</p>`,
          }),
        },
      );
    }

    const newMessage: ApiMessage = {
      id: crypto.randomUUID(),
      contact: contact,
      channel: { id: "", type: contact?.phone ? "whatsapp" : "email" },
      status: "sent",
      content: messageText,
      isRead: true,
      direction: "sent",
      twilioSid: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setMessageText("");
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      <div className="flex items-center justify-between px-6 py-3 border-b bg-white border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center font-bold text-[#0F172A] text-sm">
            {initials}
          </div>

          <div className="flex flex-col">
            <h2 className="font-bold text-[#0F172A] text-base leading-tight">
              {contact.firstName} {contact.lastName}
            </h2>
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
              <span className="text-[11px] font-bold text-[#475569] capitalize tracking-wide">
                Prospecto
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#0D9488] transition-colors" />
            </button>

            {open && (
              <div className="absolute top-full mt-2 right-0 w-44 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl z-20 overflow-hidden p-2 animate-in fade-in zoom-in-95 duration-200">
                <button className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-bold rounded-xl transition-all bg-[#0D9488] text-white">
                  <span>Prospecto</span>
                  <span className="text-lg">✓</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-bold rounded-xl transition-all mt-1 text-[#475569] hover:bg-[#F0FDFA] hover:text-[#0D9488]">
                  <span>Cliente</span>
                </button>
              </div>
            )}
          </div>

          <button className="p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors">
            <Ellipsis className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-8 py-6 scroll-smooth bg-[#FAFAFA] custom-scrollbar"
      >
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
                msg.direction === "sent" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex flex-col ${msg.direction === "sent" ? "items-end" : "items-start"} max-w-[75%]`}
              >
                {msg.direction === "received" && (
                  <p className="text-[12px] font-bold text-[#1E293B] mb-1.5 ml-1">
                    {msg.contact.firstName}
                  </p>
                )}

                <div
                  className={`relative rounded-xl px-4 py-3 text-[14px] leading-relaxed shadow-sm transition-all duration-200 ${
                    msg.direction === "sent"
                      ? "bg-[#0D9488] text-white rounded-br-none"
                      : "bg-white text-[#334155] border border-[#E2E8F0] rounded-bl-none"
                  }`}
                >
                  <p className="font-medium whitespace-pre-line">{msg.content}</p>

                  <span
                    className={`block text-[10px] font-bold mt-2.5 ${
                      msg.direction === "sent"
                        ? "text-teal-100 text-right"
                        : "text-[#94A3B8]"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-[#E2E8F0] sticky bottom-0">
        <div className=" mx-auto flex items-center gap-3 px-4 py-1.5 ">
          <input
            type="text"
            placeholder={`Escribe un mensaje...`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 border px-2 py-2 rounded-[8px] h-11 text-[14px] text-[#334155] outline-none focus:shadow-[0_0_0_3px_rgba(13,148,136,0.2)] focus:border-[#0D9488]"
          />
          <button className="p-2 text-[#64748B] hover:text-[#0D9488] hover:bg-white rounded-lg transition-all duration-200">
            <Paperclip size={18} />
          </button>
          <button
            className="bg-[#0D9488] flex items-center gap-2 cursor-pointer text-white px-5 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#0B7A6F] shadow-lg shadow-[#0D9488]/10 transition-all active:scale-95"
            onClick={handleSend}
            disabled={!messageText.trim()}
          >
            <Send size={15} />
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
