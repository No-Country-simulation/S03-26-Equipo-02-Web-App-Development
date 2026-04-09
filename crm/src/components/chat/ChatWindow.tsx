import { Ellipsis, ChevronDown, Paperclip, SendHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  name?: string;
  text: string;
  time: string;
  sender: "me" | "other";
};

const messages: Message[] = [
  {
    id: 1,
    name: "David Park",
    text: "Hola, estoy evaluando soluciones CRM para nuestra empresa. ¿Pueden compartir su documentación de seguridad y cumplimiento?",
    time: "3:15 PM",
    sender: "other",
  },
  {
    id: 2,
    text: "¡Por supuesto! Estamos certificados SOC 2 Type II y cumplimos con GDPR. Te enviaré nuestro informe de seguridad y documentación de cumplimiento de inmediato.",
    time: "3:20 PM",
    sender: "me",
  },
  {
    id: 3,
    name: "David Park",
    text: "¡Excelente! Además, ¿cuál es su enfoque de encriptación de datos tanto en reposo como en tránsito?",
    time: "4:45 PM",
    sender: "other",
  },
];

const ChatWindow = () => {
  const [status, setStatus] = useState<"prospecto" | "cliente">("prospecto");
  const [open, setOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center font-semibold">
            DP
          </div>

          <div className="flex flex-col relative">
            <h2 className="font-semibold text-base mb-0.5">David Park</h2>

            <div className="text-xs text-gray-500 flex items-center gap-1.5">
              <span>sarah.johnson@company.com</span>
            </div>
          </div>

          <div className="relative ml-5">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-[12px] p-2 rounded-[5px] border bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="capitalize">{status}</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            {open && (
              <div className="absolute top-7 left-0 w-32 bg-white border rounded-md shadow-md z-10">
                <button
                  onClick={() => {
                    setStatus("prospecto");
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100"
                >
                  Prospecto
                </button>

                <button
                  onClick={() => {
                    setStatus("cliente");
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100"
                >
                  Cliente
                </button>
              </div>
            )}
          </div>
        </div>

        <button className="shadow-xs rounded-sm p-2 hover:bg-gray-50">
          <Ellipsis  className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <p className="px-4 py-1.5 shadow rounded-[8px] ">
              Hoy
            </p>
          </div>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex flex-col max-w-[70%]">
                {msg.sender === "other" && msg.name && (
                  <p className="text-[14px] font-bold text-[#475569] mb-2 ml-1">{msg.name}</p>
                )}

                <div
                  className={`rounded-[8px] px-4 py-3 text-sm shadow-lg ${
                    msg.sender === "me"
                      ? "bg-[#0D9488] text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>

                  <span
                    className={`block text-[12px] mt-2 ${
                      msg.sender === "me"
                        ? "text-white text-right"
                        : "text-[#475569]"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t bg-white px-4 py-3 flex items-center gap-3">
        <input
          type="text"
          placeholder="Escribe un mensaje a David Park..."
          className="flex-1 bg-[#F8FAFC] border-[#E2E8F0] border rounded-lg px-4 py-3 text-sm focus:outline-none"
        />
        <button className=" p-2 flex justify-center items-center shadow-lg rounded-[8px] hover:bg-gray-100">
          <Paperclip />
        </button>
        <button className="bg-[#0D9488] flex justify-center items-center gap-2 text-white px-6 py-3 rounded-[8px] text-sm hover:bg-[#0B7A6F] transition">
          <SendHorizontal />
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
