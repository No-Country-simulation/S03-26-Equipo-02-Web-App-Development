import { useState, useEffect } from "react";
import MessageTray from "@/components/chat/MessageTray";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatActions from "@/components/chat/ChatActions";
import { useSearchParams } from "react-router-dom";
import type { ApiMessage } from "@/types/ApiMessage";

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const urlId = searchParams.get("id");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(urlId ?? null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);

  useEffect(() => {
    fetch("https://s03-26-equipo-02-web-app-development.onrender.com/messages")
      .then(res => res.json())
      .then(json => {
        const data: ApiMessage[] = json.data;
        setMessages(data);
        if (!selectedContactId && data.length > 0) {
          const latest = data.reduce((a, b) =>
            new Date(a.createdAt) > new Date(b.createdAt) ? a : b
          );
          setSelectedContactId(latest.contact.id);
        }
      });
  }, [selectedContactId]);

const selectedContact = messages.find(m => m.contact.id === selectedContactId)?.contact ?? null;

  return (
    <div className="flex h-screen bg-white">
      <MessageTray 
        selectedId={selectedContactId?.toString()} 
        onSelect={(id) => setSelectedContactId((id))} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow contactId={selectedContactId} contact={selectedContact} />
      </div>

      <div className="w-75 border-l">
        <ChatActions contactId={selectedContactId} />
      </div>
    </div>
  );
};

export default ChatPage;
