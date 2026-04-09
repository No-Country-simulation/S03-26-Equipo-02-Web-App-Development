import { useState, useEffect } from "react";
import MessageTray from "@/components/chat/MessageTray";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatActions from "@/components/chat/ChatActions";
import { useSearchParams } from "react-router-dom";

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const urlId = searchParams.get("id");
  const [selectedContactId, setSelectedContactId] = useState<number | null>(urlId ? Number(urlId) : 2); // Default to Sarah or URL ID

  useEffect(() => {
    if (urlId) {
      setSelectedContactId(Number(urlId));
    }
  }, [urlId]);

  return (
    <div className="flex h-full">
      <MessageTray 
        selectedId={selectedContactId?.toString()} 
        onSelect={(id) => setSelectedContactId(Number(id))} 
      />

      <div className="flex-1 min-w-0 bg-gray-50 border-r">
        <ChatWindow contactId={selectedContactId} />
      </div>

      <div className="w-[320px] bg-gray-50">
        <ChatActions contactId={selectedContactId} />
      </div>
    </div>
  );
};

export default ChatPage;
