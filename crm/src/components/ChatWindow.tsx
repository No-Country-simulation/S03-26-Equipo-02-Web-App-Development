import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Message = {
  id: number;
  text: string;
  time: string;
  sender: "me" | "other";
};

const messages: Message[] = [
  {
    id: 1,
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
    text: "¡Excelente! Además, ¿cuál es su enfoque de encriptación de datos tanto en reposo como en tránsito?",
    time: "4:45 PM",
    sender: "other",
  },
];

const ChatWindow = () => {
  const [status, setStatus] = useState<"prospecto" | "cliente">("prospecto");
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-400 flex items-center justify-center text-white font-semibold">
            DP
          </div>

          <div className="flex flex-col relative">
            <h2 className="text-sm font-semibold">David Park</h2>
            <p className="text-xs text-gray-500">d.park@techfirm.com</p>

          </div>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border bg-gray-50 hover:bg-gray-100 transition"
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

        {/* Opciones */}
        <button>
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* MENSAJES */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-3 text-sm shadow-sm ${
                msg.sender === "me"
                  ? "bg-teal-500 text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              <p>{msg.text}</p>

              <span
                className={`block text-[10px] mt-2 ${
                  msg.sender === "me"
                    ? "text-teal-100 text-right"
                    : "text-gray-400"
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="border-t bg-white px-4 py-3 flex items-center gap-3">
        <input
          type="text"
          placeholder="Escribe un mensaje a David Park..."
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-600 transition">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
